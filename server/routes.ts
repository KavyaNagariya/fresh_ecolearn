import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertStudentProfileSchema, insertUserSchema, insertQuizResultSchema, insertModuleProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // User authentication and profile endpoints
  
  // Ensure user exists in database (create if not exists)
  app.post("/api/auth/ensure-user", async (req, res) => {
    try {
      const { userId, username, password, authProvider } = req.body;
      
      if (!userId || !username || !password) {
        return res.status(400).json({ error: "Missing required user data" });
      }

      // Check if user already exists
      const existingUser = await storage.getUser(userId);
      if (existingUser) {
        return res.json({ success: true, user: existingUser, created: false });
      }

      // Create new user with appropriate password handling
      const userData = {
        username: username,
        password: password, // For Google: UID, for email: 'firebase_auth'
      };
      
      const validatedData = insertUserSchema.parse(userData);
      const user = await storage.createUserWithId(userId, validatedData);
      
      res.json({ success: true, user, created: true, authProvider });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid user data", details: error.errors });
      } else {
        console.error('User creation error:', error);
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });
  
  // Delete user and all related data (for Firebase Auth sync)
  app.delete("/api/auth/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "Missing user ID" });
      }

      const deleted = await storage.deleteUser(userId);
      
      if (deleted) {
        res.json({ success: true, message: "User and all related data deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete user" });
      }
    } catch (error) {
      console.error('User deletion error:', error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  
  // Create or get user profile
  app.post("/api/auth/profile", async (req, res) => {
    try {
      const { userId, email, displayName } = req.body;
      
      if (!userId || !email) {
        return res.status(400).json({ error: "Missing required user data" });
      }

      // Check if profile already exists
      const existingProfile = await storage.getStudentProfile(userId);
      if (existingProfile) {
        return res.json({ success: true, profile: existingProfile, exists: true });
      }

      // Profile doesn't exist, user needs to complete setup
      res.json({ success: true, profile: null, exists: false });
    } catch (error) {
      console.error('Profile check error:', error);
      res.status(500).json({ error: "Failed to check user profile" });
    }
  });

  // Create student profile
  app.post("/api/auth/create-profile", async (req, res) => {
    try {
      const validatedData = insertStudentProfileSchema.parse(req.body);
      const profile = await storage.createStudentProfile(validatedData);
      res.json({ success: true, profile });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid profile data", details: error.errors });
      } else {
        console.error('Profile creation error:', error);
        res.status(500).json({ error: "Failed to create profile" });
      }
    }
  });

  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getStudentProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json({ success: true, profile });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Update user profile
  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      const profile = await storage.updateStudentProfile(userId, updates);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json({ success: true, profile });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { school, limit } = req.query;
      const leaderboard = await storage.getLeaderboard(
        school as string,
        limit ? parseInt(limit as string) : 10
      );
      res.json({ success: true, leaderboard });
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Quiz Results API
  app.post("/api/quiz-results", async (req, res) => {
    try {
      const validatedData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(validatedData);
      res.json({ success: true, result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid quiz result data", details: error.errors });
      } else {
        console.error('Quiz result creation error:', error);
        res.status(500).json({ error: "Failed to save quiz result" });
      }
    }
  });

  app.get("/api/quiz-results/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await storage.getUserQuizResults(userId);
      res.json({ success: true, results });
    } catch (error) {
      console.error('Get quiz results error:', error);
      res.status(500).json({ error: "Failed to get quiz results" });
    }
  });

  app.get("/api/quiz-results/:userId/:moduleId", async (req, res) => {
    try {
      const { userId, moduleId } = req.params;
      const result = await storage.getQuizResult(userId, moduleId);
      res.json({ success: true, result });
    } catch (error) {
      console.error('Get quiz result error:', error);
      res.status(500).json({ error: "Failed to get quiz result" });
    }
  });

  // Module Progress API
  app.post("/api/module-progress", async (req, res) => {
    try {
      const validatedData = insertModuleProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateModuleProgress(validatedData);
      res.json({ success: true, progress });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid module progress data", details: error.errors });
      } else {
        console.error('Module progress creation error:', error);
        res.status(500).json({ error: "Failed to save module progress" });
      }
    }
  });

  app.get("/api/module-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserModuleProgress(userId);
      res.json({ success: true, progress });
    } catch (error) {
      console.error('Get module progress error:', error);
      res.status(500).json({ error: "Failed to get module progress" });
    }
  });

  app.get("/api/unlocked-modules/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Calculate unlocked modules based on quiz results
      const quizResults = await storage.getUserQuizResults(userId);
      let unlockedModules = ["module-1"]; // Always unlock module 1
      
      // Check if module 1 quiz is passed -> unlock module 2
      const module1Quiz = quizResults.find(qr => qr.moduleId === 'module-1');
      if (module1Quiz && module1Quiz.passed) {
        unlockedModules.push('module-2');
      }
      
      // Check if module 2 quiz is passed -> unlock module 3
      const module2Quiz = quizResults.find(qr => qr.moduleId === 'module-2');
      if (module2Quiz && module2Quiz.passed) {
        unlockedModules.push('module-3');
      }
      
      // Check if module 3 quiz is passed -> unlock module 4
      const module3Quiz = quizResults.find(qr => qr.moduleId === 'module-3');
      if (module3Quiz && module3Quiz.passed) {
        unlockedModules.push('module-4');
      }
      
      // Check if module 4 quiz is passed -> unlock module 5
      const module4Quiz = quizResults.find(qr => qr.moduleId === 'module-4');
      if (module4Quiz && module4Quiz.passed) {
        unlockedModules.push('module-5');
      }
      
      // Update the database with calculated unlocked modules
      try {
        await storage.createOrUpdateModuleProgress({
          userId,
          moduleId: 'global',
          completedSections: '[]',
          unlockedModules: JSON.stringify(unlockedModules)
        });
      } catch (error) {
        console.error('Failed to update unlocked modules in database:', error);
      }
      
      res.json({ success: true, unlockedModules });
    } catch (error) {
      console.error('Get unlocked modules error:', error);
      res.status(500).json({ error: "Failed to get unlocked modules" });
    }
  });
  
  // Debug endpoint to check user's current progress
  app.get("/api/debug/user-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const moduleProgress = await storage.getUserModuleProgress(userId);
      const quizResults = await storage.getUserQuizResults(userId);
      const lessonProgress = await storage.getUserLessonProgress(userId);
      
      res.json({ 
        success: true, 
        data: {
          moduleProgress,
          quizResults,
          lessonProgress
        }
      });
    } catch (error) {
      console.error('Debug user progress error:', error);
      res.status(500).json({ error: "Failed to get user progress" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
