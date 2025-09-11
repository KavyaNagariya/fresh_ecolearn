import { config } from "dotenv";

// Load environment variables first
config();

import { 
  type User, type InsertUser, 
  type Contact, type InsertContact,
  type StudentProfile, type InsertStudentProfile,
  type UserLessonProgress, type InsertUserLessonProgress,
  type Badge, type InsertBadge,
  type UserBadge, type InsertUserBadge,
  type ChallengeSubmission, type InsertChallengeSubmission,
  type QuizResult, type InsertQuizResult,
  type ModuleProgress, type InsertModuleProgress
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, contacts, studentProfiles, userLessonProgress, 
  badges, userBadges, userChallengeSubmissions,
  userQuizResults, userModuleProgress
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Basic user operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUserWithId(userId: string, user: InsertUser): Promise<User>;
  deleteUser(userId: string): Promise<boolean>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  
  // Student profile operations
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  updateStudentProfile(userId: string, updates: Partial<StudentProfile>): Promise<StudentProfile | undefined>;
  getLeaderboard(schoolName?: string, limit?: number): Promise<StudentProfile[]>;
  
  // Lesson progress operations
  createOrUpdateLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress>;
  getUserLessonProgress(userId: string): Promise<UserLessonProgress[]>;
  
  // Badge operations
  createBadge(badge: InsertBadge): Promise<Badge>;
  getAllBadges(): Promise<Badge[]>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  getUserBadges(userId: string): Promise<UserBadge[]>;
  
  // Challenge operations
  createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission>;
  getUserChallengeSubmissions(userId: string): Promise<ChallengeSubmission[]>;
  
  // Quiz results operations
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getUserQuizResults(userId: string): Promise<QuizResult[]>;
  getQuizResult(userId: string, moduleId: string): Promise<QuizResult | undefined>;
  
  // Module progress operations
  createOrUpdateModuleProgress(progress: InsertModuleProgress): Promise<ModuleProgress>;
  getUserModuleProgress(userId: string): Promise<ModuleProgress[]>;
  getUserUnlockedModules(userId: string): Promise<string[]>;
}

// PostgreSQL Storage Implementation
export class PostgreSQLStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(connectionString: string) {
    const queryClient = postgres(connectionString);
    this.db = drizzle(queryClient);
  }

  // Basic user operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createUserWithId(userId: string, insertUser: InsertUser): Promise<User> {
    const userWithId = { ...insertUser, id: userId };
    const result = await this.db.insert(users).values(userWithId).returning();
    return result[0];
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete all related data for this user in order (avoid foreign key issues)
      await this.db.delete(userQuizResults).where(eq(userQuizResults.userId, userId));
      await this.db.delete(userModuleProgress).where(eq(userModuleProgress.userId, userId));
      await this.db.delete(userLessonProgress).where(eq(userLessonProgress.userId, userId));
      await this.db.delete(userBadges).where(eq(userBadges.userId, userId));
      await this.db.delete(userChallengeSubmissions).where(eq(userChallengeSubmissions.userId, userId));
      await this.db.delete(studentProfiles).where(eq(studentProfiles.userId, userId));
      await this.db.delete(users).where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await this.db.insert(contacts).values(insertContact).returning();
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await this.db.select().from(contacts);
  }

  // Student profile operations
  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const result = await this.db.insert(studentProfiles).values(profile).returning();
    return result[0];
  }

  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    const result = await this.db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
    return result[0];
  }

  async updateStudentProfile(userId: string, updates: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    const result = await this.db
      .update(studentProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studentProfiles.userId, userId))
      .returning();
    return result[0];
  }

  async getLeaderboard(schoolName?: string, limit: number = 10): Promise<StudentProfile[]> {
    let query = this.db.select().from(studentProfiles);
    
    if (schoolName) {
      query = query.where(eq(studentProfiles.schoolName, schoolName)) as any;
    }
    
    return await query.orderBy(desc(studentProfiles.ecoPoints)).limit(limit);
  }

  // Lesson progress operations
  async createOrUpdateLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress> {
    // Check if progress exists
    const existing = await this.db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, progress.userId),
          eq(userLessonProgress.lessonId, progress.lessonId)
        )
      );

    if (existing.length > 0) {
      // Update existing
      const result = await this.db
        .update(userLessonProgress)
        .set({ ...progress, completedAt: progress.completed ? new Date() : null })
        .where(eq(userLessonProgress.id, existing[0].id))
        .returning();
      return result[0];
    } else {
      // Create new
      const result = await this.db
        .insert(userLessonProgress)
        .values({ ...progress, completedAt: progress.completed ? new Date() : null })
        .returning();
      return result[0];
    }
  }

  async getUserLessonProgress(userId: string): Promise<UserLessonProgress[]> {
    return await this.db
      .select()
      .from(userLessonProgress)
      .where(eq(userLessonProgress.userId, userId));
  }

  // Badge operations
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const result = await this.db.insert(badges).values(badge).returning();
    return result[0];
  }

  async getAllBadges(): Promise<Badge[]> {
    return await this.db.select().from(badges);
  }

  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    const result = await this.db.insert(userBadges).values(userBadge).returning();
    return result[0];
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return await this.db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
  }

  // Challenge operations
  async createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission> {
    const result = await this.db.insert(userChallengeSubmissions).values(submission).returning();
    return result[0];
  }

  async getUserChallengeSubmissions(userId: string): Promise<ChallengeSubmission[]> {
    return await this.db
      .select()
      .from(userChallengeSubmissions)
      .where(eq(userChallengeSubmissions.userId, userId));
  }
  
  // Quiz results operations
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const insertResult = await this.db.insert(userQuizResults).values(result).returning();
    return insertResult[0];
  }

  async getUserQuizResults(userId: string): Promise<QuizResult[]> {
    return await this.db.select().from(userQuizResults).where(eq(userQuizResults.userId, userId));
  }

  async getQuizResult(userId: string, moduleId: string): Promise<QuizResult | undefined> {
    const result = await this.db
      .select()
      .from(userQuizResults)
      .where(
        and(
          eq(userQuizResults.userId, userId),
          eq(userQuizResults.moduleId, moduleId)
        )
      )
      .orderBy(desc(userQuizResults.createdAt))
      .limit(1);
    return result[0];
  }
  
  // Module progress operations
  async createOrUpdateModuleProgress(progress: InsertModuleProgress): Promise<ModuleProgress> {
    // Check if progress exists for this user and module
    const existing = await this.db
      .select()
      .from(userModuleProgress)
      .where(
        and(
          eq(userModuleProgress.userId, progress.userId),
          eq(userModuleProgress.moduleId, progress.moduleId)
        )
      );

    if (existing.length > 0) {
      // Update existing progress
      const updateResult = await this.db
        .update(userModuleProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(
          and(
            eq(userModuleProgress.userId, progress.userId),
            eq(userModuleProgress.moduleId, progress.moduleId)
          )
        )
        .returning();
      return updateResult[0];
    } else {
      // Create new progress
      const insertResult = await this.db.insert(userModuleProgress).values(progress).returning();
      return insertResult[0];
    }
  }

  async getUserModuleProgress(userId: string): Promise<ModuleProgress[]> {
    return await this.db.select().from(userModuleProgress).where(eq(userModuleProgress.userId, userId));
  }

  async getUserUnlockedModules(userId: string): Promise<string[]> {
    // Get the latest unlocked modules data for user
    const progress = await this.db
      .select({ unlockedModules: userModuleProgress.unlockedModules })
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, userId))
      .orderBy(desc(userModuleProgress.updatedAt))
      .limit(1);
    
    if (progress.length > 0) {
      return JSON.parse(progress[0].unlockedModules);
    }
    return ["module-1"]; // Default to module 1 unlocked
  }
}

// In-Memory Storage Implementation (for development/fallback)
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private studentProfiles: Map<string, StudentProfile> = new Map();
  private userLessonProgress: Map<string, UserLessonProgress> = new Map();
  private badges: Map<string, Badge> = new Map();
  private userBadges: Map<string, UserBadge> = new Map();
  private challengeSubmissions: Map<string, ChallengeSubmission> = new Map();
  private quizResults: Map<string, QuizResult> = new Map();
  private moduleProgress: Map<string, ModuleProgress> = new Map();

  // Basic user operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date(), updatedAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async createUserWithId(userId: string, insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: userId, createdAt: new Date(), updatedAt: new Date() };
    this.users.set(userId, user);
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // Delete all related data for this user
      Array.from(this.quizResults.keys()).forEach(key => {
        if (this.quizResults.get(key)?.userId === userId) {
          this.quizResults.delete(key);
        }
      });
      
      Array.from(this.moduleProgress.keys()).forEach(key => {
        if (this.moduleProgress.get(key)?.userId === userId) {
          this.moduleProgress.delete(key);
        }
      });
      
      Array.from(this.userLessonProgress.keys()).forEach(key => {
        if (this.userLessonProgress.get(key)?.userId === userId) {
          this.userLessonProgress.delete(key);
        }
      });
      
      Array.from(this.userBadges.keys()).forEach(key => {
        if (this.userBadges.get(key)?.userId === userId) {
          this.userBadges.delete(key);
        }
      });
      
      Array.from(this.challengeSubmissions.keys()).forEach(key => {
        if (this.challengeSubmissions.get(key)?.userId === userId) {
          this.challengeSubmissions.delete(key);
        }
      });
      
      Array.from(this.studentProfiles.keys()).forEach(key => {
        if (this.studentProfiles.get(key)?.userId === userId) {
          this.studentProfiles.delete(key);
        }
      });
      
      this.users.delete(userId);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { ...insertContact, id, createdAt: new Date() };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Student profile operations
  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const id = randomUUID();
    const studentProfile: StudentProfile = {
      ...profile,
      id,
      ecoPoints: 0,
      currentLevel: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.studentProfiles.set(id, studentProfile);
    return studentProfile;
  }

  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    return Array.from(this.studentProfiles.values()).find(profile => profile.userId === userId);
  }

  async updateStudentProfile(userId: string, updates: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    const profile = await this.getStudentProfile(userId);
    if (profile) {
      const updated = { ...profile, ...updates, updatedAt: new Date() };
      this.studentProfiles.set(profile.id, updated);
      return updated;
    }
    return undefined;
  }

  async getLeaderboard(schoolName?: string, limit: number = 10): Promise<StudentProfile[]> {
    let profiles = Array.from(this.studentProfiles.values());
    if (schoolName) {
      profiles = profiles.filter(p => p.schoolName === schoolName);
    }
    return profiles
      .sort((a, b) => b.ecoPoints - a.ecoPoints)
      .slice(0, limit);
  }

  // Simplified implementations for other methods...
  async createOrUpdateLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress> {
    const id = randomUUID();
    const lessonProgress: UserLessonProgress = {
      ...progress,
      id,
      completedAt: progress.completed ? new Date() : null,
      createdAt: new Date()
    };
    this.userLessonProgress.set(id, lessonProgress);
    return lessonProgress;
  }

  async getUserLessonProgress(userId: string): Promise<UserLessonProgress[]> {
    return Array.from(this.userLessonProgress.values()).filter(p => p.userId === userId);
  }

  async createBadge(badge: InsertBadge): Promise<Badge> {
    const id = randomUUID();
    const newBadge: Badge = { ...badge, id, createdAt: new Date() };
    this.badges.set(id, newBadge);
    return newBadge;
  }

  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    const id = randomUUID();
    const newUserBadge: UserBadge = { ...userBadge, id, earnedAt: new Date() };
    this.userBadges.set(id, newUserBadge);
    return newUserBadge;
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(ub => ub.userId === userId);
  }

  async createChallengeSubmission(submission: InsertChallengeSubmission): Promise<ChallengeSubmission> {
    const id = randomUUID();
    const newSubmission: ChallengeSubmission = {
      ...submission,
      id,
      status: "pending",
      submittedAt: new Date(),
      reviewedAt: null
    };
    this.challengeSubmissions.set(id, newSubmission);
    return newSubmission;
  }

  async getUserChallengeSubmissions(userId: string): Promise<ChallengeSubmission[]> {
    return Array.from(this.challengeSubmissions.values()).filter(cs => cs.userId === userId);
  }
  
  // Quiz results operations
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = randomUUID();
    const quizResult: QuizResult = {
      ...result,
      id,
      createdAt: new Date()
    };
    this.quizResults.set(id, quizResult);
    return quizResult;
  }

  async getUserQuizResults(userId: string): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(qr => qr.userId === userId);
  }

  async getQuizResult(userId: string, moduleId: string): Promise<QuizResult | undefined> {
    return Array.from(this.quizResults.values())
      .filter(qr => qr.userId === userId && qr.moduleId === moduleId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  }
  
  // Module progress operations
  async createOrUpdateModuleProgress(progress: InsertModuleProgress): Promise<ModuleProgress> {
    const existing = Array.from(this.moduleProgress.values())
      .find(mp => mp.userId === progress.userId && mp.moduleId === progress.moduleId);
      
    if (existing) {
      const updated: ModuleProgress = { 
        ...existing, 
        ...progress, 
        updatedAt: new Date() 
      };
      this.moduleProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const moduleProgress: ModuleProgress = {
        ...progress,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.moduleProgress.set(id, moduleProgress);
      return moduleProgress;
    }
  }

  async getUserModuleProgress(userId: string): Promise<ModuleProgress[]> {
    return Array.from(this.moduleProgress.values()).filter(mp => mp.userId === userId);
  }

  async getUserUnlockedModules(userId: string): Promise<string[]> {
    const progress = Array.from(this.moduleProgress.values())
      .filter(mp => mp.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
    
    if (progress) {
      return JSON.parse(progress.unlockedModules);
    }
    return ["module-1"];
  }
}

// Storage factory function
function createStorage(): IStorage {
  const useDatabase = process.env.USE_DATABASE === 'true';
  const databaseUrl = process.env.DATABASE_URL;

  if (useDatabase && databaseUrl) {
    console.log('🗄️ Using PostgreSQL database storage');
    console.log('📍 Connected to:', databaseUrl.split('@')[1]?.split('/')[0] || 'database');
    return new PostgreSQLStorage(databaseUrl);
  } else {
    console.log('⚠️  WARNING: Using in-memory storage (data will be lost on restart)');
    console.log('🔧 To use shared database:');
    console.log('   1. Copy .env.example to .env');
    console.log('   2. Update DATABASE_URL with the correct NeonDB connection string');
    console.log('   3. Set USE_DATABASE=true');
    console.log('   4. Restart the server with npm run dev');
    return new MemStorage();
  }
}

export const storage = createStorage();
