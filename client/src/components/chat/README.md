# Eco Assistant Chat System

## Overview
The Eco Assistant is an AI-powered chatbot integrated into the educational platform to help students with environmental learning. It provides context-aware assistance for lessons, quizzes, and challenges.

## Features
- **Context-Aware Responses**: Understands what the student is currently working on
- **Rate Limiting**: Prevents API abuse with daily message limits
- **Session Management**: Maintains conversation history per user
- **Responsive Design**: Works on both desktop and mobile devices
- **Educational Focus**: Provides hints and explanations without giving direct quiz answers

## Components

### ChatWidget.tsx
A floating chat widget that appears on all pages. Users can click the chat icon to open/close the chat interface.

### ChatPage.tsx
A full-page chat interface for more immersive conversations.

### ChatContext.tsx
Manages chat state, sessions, and communication with the backend API.

### ChatSessionsPanel.tsx
Sidebar component for managing chat sessions.

### useChatContext.ts
Hook that provides context information about the user's current location and activity.

## API Endpoints

### Chat Sessions
- `POST /api/chat/sessions` - Create a new chat session
- `GET /api/chat/sessions/:userId` - Get all chat sessions for a user
- `DELETE /api/chat/sessions/:sessionId` - Delete a chat session

### Chat Messages
- `GET /api/chat/sessions/:sessionId/messages` - Get all messages in a session
- `POST /api/chat/sessions/:sessionId/messages` - Send a new message

## Database Schema

### chat_sessions
- `id` - Unique session identifier
- `userId` - User who owns the session
- `title` - Session title
- `createdAt` - When the session was created
- `updatedAt` - When the session was last updated

### chat_messages
- `id` - Unique message identifier
- `sessionId` - Session the message belongs to
- `role` - Either "user" or "assistant"
- `content` - Message content
- `context` - JSON string of context data
- `moduleId` - Optional module ID for context
- `timestamp` - When the message was sent

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key
- `GEMINI_MODEL` - Gemini model to use (default: gemini-1.5-flash)
- `CHAT_DAILY_MESSAGE_LIMIT` - Daily message limit per user (default: 100)

## AI Personality
The AI assistant "Eco" is designed to be:
- Friendly and encouraging
- Educational and informative
- Age-appropriate for students
- Solution-focused and motivational

Eco focuses on topics like climate change, sustainability, renewable energy, and waste reduction, but never gives direct quiz answers.