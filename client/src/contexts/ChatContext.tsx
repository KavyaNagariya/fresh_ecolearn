import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  context?: any;
  moduleId?: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isChatOpen: boolean;
  isLoading: boolean;
  error: string | null;
  remainingMessages: number;
  toggleChat: () => void;
  sendMessage: (content: string, context?: any) => Promise<void>;
  createNewSession: (title?: string) => Promise<void>;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingMessages, setRemainingMessages] = useState<number>(100);

  // Fetch user chat sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['chatSessions', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      
      const response = await fetch(`/api/chat/sessions/${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
      
      const data = await response.json();
      return data.sessions || [];
    },
    enabled: !!user?.uid,
  });

  // Fetch messages for current session
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', currentSession?.id],
    queryFn: async () => {
      if (!currentSession?.id) return [];
      
      const response = await fetch(`/api/chat/sessions/${currentSession.id}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }
      
      const data = await response.json();
      return data.messages || [];
    },
    enabled: !!currentSession?.id,
  });

  // Create new chat session
  const createSessionMutation = useMutation({
    mutationFn: async (title?: string) => {
      if (!user?.uid) throw new Error('User not authenticated');
      
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          title: title || 'Eco Assistant Chat',
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create chat session');
      }
      
      const data = await response.json();
      return data.session;
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      setCurrentSession(newSession);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, context }: { content: string; context?: any }) => {
      if (!user?.uid) throw new Error('User not authenticated');
      if (!currentSession?.id) throw new Error('No active chat session');
      
      const response = await fetch(`/api/chat/sessions/${currentSession.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          content,
          context,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', currentSession?.id] });
      setRemainingMessages(data.remainingMessages || 100);
    },
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete session');
      }
      
      return sessionId;
    },
    onSuccess: (deletedSessionId) => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      if (currentSession?.id === deletedSessionId) {
        setCurrentSession(null);
      }
    },
  });

  // Create a new session
  const createNewSession = async (title?: string) => {
    try {
      setError(null);
      await createSessionMutation.mutateAsync(title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    }
  };

  // Send a message
  const sendMessage = async (content: string, context?: any) => {
    try {
      setError(null);
      await sendMessageMutation.mutateAsync({ content, context });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  // Switch to a different session
  const switchSession = (sessionId: string) => {
    const session = sessions.find((s: ChatSession) => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    try {
      setError(null);
      await deleteSessionMutation.mutateAsync(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    
    // If chat is being opened and there's no session, create one
    if (!isChatOpen && !currentSession && sessions.length > 0) {
      setCurrentSession(sessions[0]);
    } else if (!isChatOpen && !currentSession && user?.uid) {
      createNewSession();
    }
  };

  // Auto-create first session if user is authenticated and no sessions exist
  useEffect(() => {
    if (user?.uid && sessions.length > 0 && !currentSession) {
      setCurrentSession(sessions[0]);
    } else if (user?.uid && sessions.length === 0 && !currentSession) {
      createNewSession();
    }
  }, [user, sessions, currentSession]);

  const value = {
    sessions,
    currentSession,
    messages,
    isChatOpen,
    isLoading: sessionsLoading || messagesLoading || createSessionMutation.isPending || sendMessageMutation.isPending,
    error,
    remainingMessages,
    toggleChat,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}