import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useChatContext } from '@/hooks/useChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSessionsPanel } from '@/components/chat/ChatSessionsPanel';
import { Bot, Send, Loader2, Menu, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error,
    remainingMessages,
    currentSession,
    sessions
  } = useChat();
  
  const chatContext = useChatContext();
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  // Focus textarea on load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue('');
    
    try {
      await sendMessage(message, chatContext);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Eco Assistant</h1>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {remainingMessages} messages remaining today
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sessions sidebar - hidden on mobile by default */}
        <div
          className={cn(
            'hidden border-r bg-white dark:bg-gray-900 md:block',
            isSidebarOpen && 'absolute inset-y-0 left-0 z-10 block w-64 md:static md:w-80'
          )}
        >
          <ChatSessionsPanel />
        </div>

        {/* Main chat area */}
        <div className="flex flex-1 flex-col">
          {/* Messages area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                    <Bot className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">Welcome to Eco Assistant!</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    I'm here to help you learn about environmental sustainability. 
                    Ask me anything about climate change, renewable energy, waste reduction, and more!
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button variant="outline" className="h-auto flex-col items-start p-4">
                      <h3 className="font-semibold">Lesson Help</h3>
                      <p className="mt-1 text-xs text-gray-500">Get explanations for concepts</p>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col items-start p-4">
                      <h3 className="font-semibold">Quiz Hints</h3>
                      <p className="mt-1 text-xs text-gray-500">Get guidance without answers</p>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col items-start p-4">
                      <h3 className="font-semibold">Challenge Ideas</h3>
                      <p className="mt-1 text-xs text-gray-500">Eco-friendly project suggestions</p>
                    </Button>
                    <Button variant="outline" className="h-auto flex-col items-start p-4">
                      <h3 className="font-semibold">Progress Tips</h3>
                      <p className="mt-1 text-xs text-gray-500">Ways to improve your learning</p>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex w-full',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-xl px-4 py-3 shadow-sm',
                          message.role === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-900 shadow-gray-100 dark:bg-gray-800 dark:text-white dark:shadow-gray-800'
                        )}
                      >
                        <div className="whitespace-pre-wrap break-words">{message.content}</div>
                        <div className="mt-2 text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-xl bg-white px-4 py-3 shadow-sm shadow-gray-100 dark:bg-gray-800 dark:shadow-gray-800">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Eco is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="flex justify-start">
                      <div className="rounded-xl bg-red-100 px-4 py-3 text-red-800 shadow-sm shadow-red-100 dark:bg-red-900/30 dark:text-red-100 dark:shadow-red-900/20">
                        {error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t bg-white p-4 dark:bg-gray-900">
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about sustainability..."
                  className="min-h-[44px] flex-1 resize-none"
                  rows={1}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputValue.trim() || isLoading}
                  className="h-11 w-11 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
              <div className="mt-2 text-center text-xs text-gray-500">
                Eco Assistant provides educational guidance. For quiz questions, I'll give hints but not direct answers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}