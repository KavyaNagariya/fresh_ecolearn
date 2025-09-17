import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";

// Rate limiting in-memory store (in production, use Redis)
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

// Check if user has exceeded daily message limit
const checkRateLimit = (userId: string): { allowed: boolean; remaining: number } => {
  const DAILY_LIMIT = parseInt(process.env.CHAT_DAILY_MESSAGE_LIMIT || "100", 10);
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours

  if (!rateLimitStore[userId]) {
    rateLimitStore[userId] = { count: 0, resetTime: now + windowMs };
  }

  const userLimit = rateLimitStore[userId];

  // Reset counter if window has passed
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + windowMs;
  }

  // Check if user is within limit
  if (userLimit.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: DAILY_LIMIT - userLimit.count };
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });

// Eco Assistant personality and system prompt
const ECO_ASSISTANT_PROMPT = `You are Eco, a friendly environmental education assistant. Your purpose is to help students learn about environmental topics in an engaging and educational way.

Personality traits:
- Friendly and encouraging
- Educational and informative
- Age-appropriate for students
- Solution-focused and motivational

Knowledge focus areas:
- Climate change
- Sustainability
- Renewable energy
- Waste reduction
- Biodiversity
- Conservation

Response guidelines:
- Never give direct quiz answers, only hints and guidance
- Provide explanations that help students understand concepts
- Celebrate learning progress and effort
- Suggest relevant learning materials when appropriate
- Keep responses concise but informative
- Use emojis occasionally to make interactions more engaging

Context awareness:
- You will receive context about the user's current activity (lesson, module, quiz, challenge)
- Use this context to provide relevant, personalized responses
- Reference the user's progress when appropriate

Welcome message: "Hi there! 👋 I'm Eco, your friendly assistant for everything green and sustainable. How can I help you with your environmental learning today?"`;

// Helper function to format chat history for Gemini
const formatChatHistory = (messages: any[]) => {
  return messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
};

// Helper function to extract context information
const extractContextInfo = (context: any) => {
  if (!context) return "";
  
  let info = "";
  if (context.page) info += `Current page: ${context.page}\n`;
  if (context.moduleId) info += `Module: ${context.moduleId}\n`;
  if (context.lessonId) info += `Lesson: ${context.lessonId}\n`;
  if (context.quizId) info += `Quiz: ${context.quizId}\n`;
  if (context.challengeId) info += `Challenge: ${context.challengeId}\n`;
  if (context.userProgress) info += `User progress: ${context.userProgress}\n`;
  
  return info ? `Context information:\n${info}` : "";
};

// Simple in-memory storage for chat sessions (as a temporary fix)
const chatSessions: Record<string, any> = {};
const chatMessages: Record<string, any[]> = {};

export async function registerChatRoutes(app: Express) {
  // Create a new chat session
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const { userId, title } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Generate a simple session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create session object
      const session = {
        id: sessionId,
        userId: userId, // Store the original Firebase UID
        title: title || "Eco Assistant Chat",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store in memory
      chatSessions[sessionId] = session;
      
      res.json({ success: true, session });
    } catch (error) {
      console.error('Chat session creation error:', error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  // Get chat sessions for a user
  app.get("/api/chat/sessions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Filter sessions by user ID
      const userSessions = Object.values(chatSessions).filter((session: any) => session.userId === userId);
      
      res.json({ success: true, sessions: userSessions });
    } catch (error) {
      console.error('Get chat sessions error:', error);
      res.status(500).json({ error: "Failed to get chat sessions" });
    }
  });

  // Get messages for a chat session
  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const messages = chatMessages[sessionId] || [];
      res.json({ success: true, messages });
    } catch (error) {
      console.error('Get chat messages error:', error);
      res.status(500).json({ error: "Failed to get chat messages" });
    }
  });

  // Send a message to the chat
  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { userId, content, context } = req.body;
      
      if (!sessionId || !userId || !content) {
        return res.status(400).json({ error: "Session ID, User ID, and content are required" });
      }

      // Check rate limit using original Firebase UID
      const rateLimit = checkRateLimit(userId);
      if (!rateLimit.allowed) {
        return res.status(429).json({ 
          error: "Daily message limit exceeded", 
          message: "You've reached your daily limit for chat messages. Please try again tomorrow." 
        });
      }

      // Save user message
      const userMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        role: "user",
        content,
        context: context ? JSON.stringify(context) : null,
        moduleId: context?.moduleId || null,
        timestamp: new Date().toISOString()
      };
      
      // Store message
      if (!chatMessages[sessionId]) {
        chatMessages[sessionId] = [];
      }
      chatMessages[sessionId].push(userMessage);

      // Get chat history for context
      const history = chatMessages[sessionId] || [];
      
      // Prepare context information for AI
      const contextInfo = extractContextInfo(context);
      
      // Create prompt for Gemini with context
      const fullPrompt = `${ECO_ASSISTANT_PROMPT}

${contextInfo}

Chat history:
${history.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${content}
Assistant:`;

      // Generate AI response
      let aiResponse = "I'm having trouble connecting right now. Please try again in a moment.";
      
      try {
        const result = await model.generateContent(fullPrompt);
        aiResponse = result.response.text();
      } catch (aiError) {
        console.error('AI generation error:', aiError);
        // Return a friendly error message instead of failing completely
        aiResponse = "I'm experiencing some technical difficulties right now. Please try asking your question again in a moment, or check back later!";
      }

      // Save AI message
      const aiMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        role: "assistant",
        content: aiResponse,
        context: context ? JSON.stringify(context) : null,
        moduleId: context?.moduleId || null,
        timestamp: new Date().toISOString()
      };
      
      // Store message
      chatMessages[sessionId].push(aiMessage);

      // Update session timestamp
      if (chatSessions[sessionId]) {
        chatSessions[sessionId].updatedAt = new Date().toISOString();
      }

      res.json({ 
        success: true, 
        userMessage, 
        aiMessage,
        remainingMessages: rateLimit.remaining
      });
    } catch (error) {
      console.error('Chat message error:', error);
      res.status(500).json({ error: "Failed to send chat message" });
    }
  });

  // Delete a chat session
  app.delete("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      // Delete session and its messages
      const deleted = delete chatSessions[sessionId];
      delete chatMessages[sessionId];
      
      if (deleted) {
        res.json({ success: true, message: "Chat session deleted successfully" });
      } else {
        res.status(404).json({ error: "Chat session not found" });
      }
    } catch (error) {
      console.error('Delete chat session error:', error);
      res.status(500).json({ error: "Failed to delete chat session" });
    }
  });
}