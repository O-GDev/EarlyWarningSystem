import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, X, Send } from 'lucide-react';
import { useAiAssistant } from '@/lib/openai';
import ChatMessage from './chat-message';

interface AssistantDialogProps {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AssistantDialog({ 
  trigger, 
  defaultOpen = false, 
  onOpenChange 
}: AssistantDialogProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useAiAssistant({
    initialMessages: [
      { 
        role: 'assistant', 
        content: 'Welcome to the EWERS AI Assistant. How can I help with crisis monitoring and response today?' 
      }
    ]
  });

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [open, onOpenChange]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage = inputValue;
    setInputValue('');
    await sendMessage(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Suggested questions
  const suggestions = [
    "Show crisis assessment",
    "Generate response plan",
    "Analyze social media trends",
    "Identify at-risk communities"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-3xl h-[75vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-neutral-100 flex flex-row justify-between items-center">
          <DialogTitle className="flex items-center text-lg font-semibold">
            <Bot className="h-5 w-5 text-secondary mr-2" />
            AI Assistant
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-600">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 overflow-y-auto space-y-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <ChatMessage 
              key={index}
              content={message.content}
              isUser={message.role === 'user'}
            />
          ))}
          
          {isLoading && (
            <ChatMessage 
              content="Analyzing and generating response..."
              isUser={false}
              isTyping={true}
            />
          )}
          
          {error && (
            <Card className="p-3 bg-red-50 text-red-700 text-sm">
              Error: {error}. Please try again.
            </Card>
          )}
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t border-neutral-100 block">
          <div className="flex space-x-2">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI assistant..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || inputValue.trim() === ''}
              className="flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-none"
                onClick={() => {
                  setInputValue(suggestion);
                }}
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
