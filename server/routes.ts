import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertStudentProfileSchema, insertUserSchema } from "@shared/schema";
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
      const { userId, username, password } = req.body;
      
      if (!userId || !username || !password) {
        return res.status(400).json({ error: "Missing required user data" });
      }

      // Check if user already exists
      const existingUser = await storage.getUser(userId);
      if (existingUser) {
        return res.json({ success: true, user: existingUser, created: false });
      }

      // Create new user with Firebase UID as both ID and password
      const userData = {
        username: username,
        password: password, // This will be the Firebase UID
      };
      
      const validatedData = insertUserSchema.parse(userData);
      const user = await storage.createUserWithId(userId, validatedData);
      
      res.json({ success: true, user, created: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid user data", details: error.errors });
      } else {
        console.error('User creation error:', error);
        res.status(500).json({ error: "Failed to create user" });
      }
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

  const httpServer = createServer(app);

  return httpServer;
}
