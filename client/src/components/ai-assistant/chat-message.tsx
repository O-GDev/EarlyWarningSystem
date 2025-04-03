import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isTyping?: boolean;
}

export default function ChatMessage({ content, isUser, isTyping = false }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex space-x-3", 
      isUser && "justify-end"
    )}>
      {!isUser && (
        <Avatar className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-white flex-shrink-0">
          <Bot className="h-5 w-5" />
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-lg p-3 max-w-[80%]",
        isUser ? "bg-primary/10" : "bg-neutral-50"
      )}>
        {isTyping ? (
          <div className="flex items-center">
            <span>{content}</span>
            <span className="ml-1 inline-block w-2 h-2 bg-current rounded-full animate-pulse"></span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
          <User className="h-5 w-5" />
        </Avatar>
      )}
    </div>
  );
}
