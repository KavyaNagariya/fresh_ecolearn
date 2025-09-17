import { useLocation } from 'wouter';

interface ChatContextInfo {
  page: string;
  moduleId?: string;
  lessonId?: string;
  quizId?: string;
  challengeId?: string;
  userProgress?: string;
}

export function useChatContext(): ChatContextInfo {
  const [location] = useLocation();
  
  // Parse the current location to extract context
  const getContext = (): ChatContextInfo => {
    const context: ChatContextInfo = {
      page: location,
    };
    
    // Extract module ID from paths like /lesson/:moduleId or /quiz/:moduleId
    const moduleMatch = location.match(/\/(lesson|quiz)\/([^\/]+)/);
    if (moduleMatch) {
      context.moduleId = moduleMatch[2];
      context.page = moduleMatch[1]; // 'lesson' or 'quiz'
    }
    
    // Extract lesson section ID from paths like /lesson/:moduleId/section/:sectionId
    const sectionMatch = location.match(/\/lesson\/([^\/]+)\/section\/([^\/]+)/);
    if (sectionMatch) {
      context.moduleId = sectionMatch[1];
      context.lessonId = sectionMatch[2];
      context.page = 'lesson-section';
    }
    
    // Extract challenge ID from paths like /challenges/:challengeId
    const challengeMatch = location.match(/\/challenges\/([^\/]+)/);
    if (challengeMatch) {
      context.challengeId = challengeMatch[1];
      context.page = 'challenge';
    }
    
    // For dashboard, we might want to include some user progress info
    if (location === '/dashboard') {
      context.page = 'dashboard';
      // In a real implementation, you would fetch actual progress data here
      context.userProgress = 'User dashboard view';
    }
    
    return context;
  };
  
  return getContext();
}