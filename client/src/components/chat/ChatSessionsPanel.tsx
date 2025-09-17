import { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export function ChatSessionsPanel() {
  const { sessions, currentSession, switchSession, createNewSession, deleteSession } = useChat();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(sessionId);
    try {
      await deleteSession(sessionId);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Chat Sessions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => createNewSession()}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No chat sessions yet. Start a conversation with Eco!
          </div>
        ) : (
          <div className="divide-y">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex cursor-pointer items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  currentSession?.id === session.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                }`}
                onClick={() => switchSession(session.id)}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(session.updatedAt), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  disabled={isDeleting === session.id}
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                >
                  {isDeleting === session.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}