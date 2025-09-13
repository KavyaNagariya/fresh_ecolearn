import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Basic Users table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Contact forms
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  feedback: text("feedback").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Student Profiles - Main EcoLearn data
export const studentProfiles = pgTable("student_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // Links to Firebase Auth
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  schoolName: text("school_name").notNull(),
  grade: text("grade").notNull(),
  class: text("class"), // Student's class/section (e.g., "A", "B", "Science", "Commerce")
  studentId: text("student_id"),
  ecoPoints: integer("eco_points").notNull().default(0),
  currentLevel: integer("current_level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Lesson Progress Tracking
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Badges System
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Emoji or icon identifier
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  pointsRequired: integer("points_required").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// User Badges (Many-to-Many relationship)
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  badgeId: varchar("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().default(sql`now()`),
});

// Challenges - Store challenge definitions
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  points: integer("points").notNull().default(10),
  category: text("category").notNull(), // e.g., "Climate Change", "Water Conservation"
  week: integer("week").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Challenge Submissions - Enhanced with more fields
export const userChallengeSubmissions = pgTable("user_challenge_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  challengeId: varchar("challenge_id").notNull(),
  photoUrl: text("photo_url"), // Cloudinary URL
  caption: text("caption"), // User's description of their photo/action
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  pointsAwarded: integer("points_awarded").notNull().default(0),
  submittedAt: timestamp("submitted_at").notNull().default(sql`now()`),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"), // Admin user ID who reviewed
  feedback: text("feedback"), // Reviewer's feedback or comments
});

// Quiz Results Storage
export const userQuizResults = pgTable("user_quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  moduleId: varchar("module_id").notNull(),
  score: integer("score").notNull().default(0),
  totalPoints: integer("total_points").notNull().default(0),
  passed: boolean("passed").notNull().default(false),
  attempts: text("attempts").notNull().default('[]'), // JSON string of attempts
  completedAt: timestamp("completed_at").notNull().default(sql`now()`),
  timeTaken: integer("time_taken").default(0), // in seconds
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Module Progress Storage  
export const userModuleProgress = pgTable("user_module_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  moduleId: varchar("module_id").notNull(),
  completedSections: text("completed_sections").notNull().default('[]'), // JSON string of section IDs
  unlockedModules: text("unlocked_modules").notNull().default('["module-1"]'), // JSON string of unlocked module IDs
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Admin Users - Separate admin authentication
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Hashed password
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("admin"), // admin, super_admin
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Insert Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  role: true,
  feedback: true,
});

export const insertStudentProfileSchema = createInsertSchema(studentProfiles).pick({
  userId: true,
  fullName: true,
  email: true,
  schoolName: true,
  grade: true,
  class: true,
  studentId: true,
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).pick({
  userId: true,
  lessonId: true,
  completed: true,
  score: true,
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  rarity: true,
  pointsRequired: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  points: true,
  category: true,
  week: true,
  isActive: true,
  startDate: true,
  endDate: true,
});

export const insertChallengeSubmissionSchema = createInsertSchema(userChallengeSubmissions).pick({
  userId: true,
  challengeId: true,
  photoUrl: true,
  caption: true,
});

export const insertQuizResultSchema = createInsertSchema(userQuizResults).pick({
  userId: true,
  moduleId: true,
  score: true,
  totalPoints: true,
  passed: true,
  attempts: true,
  timeTaken: true,
});

export const insertModuleProgressSchema = createInsertSchema(userModuleProgress).pick({
  userId: true,
  moduleId: true,
  completedSections: true,
  unlockedModules: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallengeSubmission = z.infer<typeof insertChallengeSubmissionSchema>;
export type ChallengeSubmission = typeof userChallengeSubmissions.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof userQuizResults.$inferSelect;
export type InsertModuleProgress = z.infer<typeof insertModuleProgressSchema>;
export type ModuleProgress = typeof userModuleProgress.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
