import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertStudentProfileSchema, insertUserSchema, insertQuizResultSchema, insertModuleProgressSchema, insertChallengeSchema, insertChallengeSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { uploadToCloudinary } from "./cloudinary";

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

      // Check if profile already exists with timeout handling
      try {
        const existingProfile = await storage.getStudentProfile(userId);
        if (existingProfile) {
          return res.json({ success: true, profile: existingProfile, exists: true });
        }
      } catch (dbError) {
        console.error('Database error when checking profile:', dbError);
        // If database is down, return that profile doesn't exist to allow profile creation
        console.log('Database unavailable, allowing profile creation');
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
      
      try {
        const profile = await storage.getStudentProfile(userId);
        
        if (!profile) {
          return res.status(404).json({ error: "Profile not found" });
        }
        
        res.json({ success: true, profile });
      } catch (dbError) {
        console.error('Database error when getting profile:', dbError);
        // If database is down, return 404 so user gets redirected to profile setup
        return res.status(404).json({ error: "Profile not found (database unavailable)" });
      }
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

  // ===== CHALLENGE SYSTEM API ENDPOINTS =====
  
  // Configure multer for file uploads
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Accept only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Get all active challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const { week, category, isActive } = req.query;
      const challenges = await storage.getChallenges({
        week: week ? parseInt(week as string) : undefined,
        category: category as string,
        isActive: isActive !== undefined ? isActive === 'true' : true
      });
      res.json({ success: true, challenges });
    } catch (error) {
      console.error('Get challenges error:', error);
      res.status(500).json({ error: "Failed to get challenges" });
    }
  });

  // Get specific challenge
  app.get("/api/challenges/:challengeId", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const challenge = await storage.getChallenge(challengeId);
      
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      res.json({ success: true, challenge });
    } catch (error) {
      console.error('Get challenge error:', error);
      res.status(500).json({ error: "Failed to get challenge" });
    }
  });

  // Create new challenge (Admin only)
  app.post("/api/challenges", async (req, res) => {
    try {
      const validatedData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(validatedData);
      res.json({ success: true, challenge });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid challenge data", details: error.errors });
      } else {
        console.error('Challenge creation error:', error);
        res.status(500).json({ error: "Failed to create challenge" });
      }
    }
  });

  // Update challenge (Admin only)
  app.put("/api/challenges/:challengeId", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const updates = req.body;
      
      const challenge = await storage.updateChallenge(challengeId, updates);
      
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      
      res.json({ success: true, challenge });
    } catch (error) {
      console.error('Update challenge error:', error);
      res.status(500).json({ error: "Failed to update challenge" });
    }
  });

  // Submit photo challenge
  app.post("/api/challenges/:challengeId/submit", upload.single('photo'), async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { userId, caption } = req.body;
      const file = req.file;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      if (!file) {
        return res.status(400).json({ error: "Photo is required" });
      }

      // Check if challenge exists and is active
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      if (!challenge.isActive) {
        return res.status(400).json({ error: "Challenge is not active" });
      }

      // Check if user already submitted for this challenge
      const existingSubmission = await storage.getChallengeSubmission(userId, challengeId);
      if (existingSubmission) {
        // Allow resubmission only if the previous submission was rejected
        if (existingSubmission.status === 'approved') {
          return res.status(400).json({ error: "You have already submitted for this challenge and it was approved" });
        } else if (existingSubmission.status === 'pending') {
          return res.status(400).json({ error: "You have already submitted for this challenge and it's pending review" });
        }
        // If status is 'rejected', allow resubmission by continuing
      }

      // Upload photo to Cloudinary
      const uploadResult = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        `ecolearn/challenges/${challengeId}`
      );

      let submission;
      
      if (existingSubmission && existingSubmission.status === 'rejected') {
        // Update existing rejected submission
        const updateData = {
          photoUrl: uploadResult.url,
          caption: caption || '',
          status: 'pending' as const,
          pointsAwarded: 0,
          reviewedAt: null,
          reviewedBy: null,
          feedback: null
        };
        submission = await storage.updateChallengeSubmission(existingSubmission.id, updateData);
      } else {
        // Create new submission
        const submissionData = {
          userId,
          challengeId,
          photoUrl: uploadResult.url,
          caption: caption || ''
        };

        const validatedData = insertChallengeSubmissionSchema.parse(submissionData);
        submission = await storage.createChallengeSubmission(validatedData);
      }
      
      res.json({ success: true, submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid submission data", details: error.errors });
      } else {
        console.error('Challenge submission error:', error);
        res.status(500).json({ error: "Failed to submit challenge" });
      }
    }
  });

  // Get user's challenge submissions
  app.get("/api/submissions/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.query;
      
      const submissions = await storage.getUserChallengeSubmissions(userId, status as string);
      res.json({ success: true, submissions });
    } catch (error) {
      console.error('Get user submissions error:', error);
      res.status(500).json({ error: "Failed to get submissions" });
    }
  });

  // Get all submissions for a challenge
  app.get("/api/challenges/:challengeId/submissions", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { status } = req.query;
      
      const submissions = await storage.getChallengeSubmissions(challengeId, status as string);
      res.json({ success: true, submissions });
    } catch (error) {
      console.error('Get challenge submissions error:', error);
      res.status(500).json({ error: "Failed to get submissions" });
    }
  });

  // Get all pending submissions (Admin)
  app.get("/api/submissions/pending", async (req, res) => {
    try {
      const submissions = await storage.getPendingSubmissions();
      res.json({ success: true, submissions });
    } catch (error) {
      console.error('Get pending submissions error:', error);
      res.status(500).json({ error: "Failed to get pending submissions" });
    }
  });

  // Admin verification middleware
  const verifyAdminToken = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('admin_')) {
      return res.status(401).json({ error: "Invalid admin token" });
    }
    
    next();
  };

  // Approve/Reject submission (Admin)
  app.put("/api/submissions/:submissionId/review", verifyAdminToken, async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { status, feedback, reviewedBy } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'approved' or 'rejected'" });
      }

      const result = await storage.reviewChallengeSubmission(submissionId, {
        status,
        feedback,
        reviewedBy
      });
      
      if (!result) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json({ success: true, submission: result });
    } catch (error) {
      console.error('Review submission error:', error);
      res.status(500).json({ error: "Failed to review submission" });
    }
  });

  // Get approved submissions for gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const { limit, offset } = req.query;
      const submissions = await storage.getApprovedSubmissions({
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0
      });
      res.json({ success: true, submissions });
    } catch (error) {
      console.error('Get gallery submissions error:', error);
      res.status(500).json({ error: "Failed to get gallery submissions" });
    }
  });

  // ===== ADMIN AUTHENTICATION SYSTEM =====
  
  // Simple in-memory admin users (for demo purposes)
  const adminUsers = [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
      fullName: 'EcoLearn Administrator',
      role: 'admin'
    },
    {
      id: 'admin-2', 
      username: 'ecolearn_admin',
      password: 'ecolearn2024',
      fullName: 'EcoLearn Super Admin',
      role: 'super_admin'
    }
  ];

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Find admin user
      const admin = adminUsers.find(a => a.username === username && a.password === password);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate simple session token (in production, use JWT or proper session management)
      const token = `admin_${admin.id}_${Date.now()}`;
      
      res.json({ 
        success: true, 
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          fullName: admin.fullName,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    try {
      // In a real implementation, you would invalidate the token here
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Protected admin routes would use the middleware like this:
  // app.get("/api/admin/dashboard", verifyAdminToken, async (req, res) => { ... });

  const httpServer = createServer(app);

  return httpServer;
}
