import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAiAssistant } from '@/lib/openai';
import ChatMessage from '@/components/ai-assistant/chat-message';
import { useSidebar } from '@/contexts/sidebar-context';
import { Bot, Send, HelpCircle, RefreshCw, Save, BarChart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiAssistant() {
  const { isOpen } = useSidebar();
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    sendMessage, 
    clearMessages,
    isLoading, 
    error 
  } = useAiAssistant({
    initialMessages: [
      { 
        role: 'assistant', 
        content: 'Welcome to the EWERS AI Assistant. I can help with crisis analysis, provide recommendations for response actions, and assist in interpreting data patterns. How can I assist you today?' 
      }
    ]
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
  
  // Suggested questions for quick access
  const suggestedQuestions = [
    "What are the current conflict hotspots?",
    "Analyze emerging threats in the North East",
    "Generate a response plan for farmer-herder conflict",
    "What social media trends indicate potential unrest?",
    "Summarize recent security incidents",
    "Show crisis assessment for Borno state",
    "Identify at-risk communities in Kaduna"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'md:ml-64' : ''}`}>
          <Header title="AI Assistant" />
          
          <div className="flex-1 overflow-auto p-4 bg-neutral-50 flex flex-col">
            <div className="flex-1 flex gap-4 h-full max-h-full">
              {/* Main chat section */}
              <Card className="flex-1 flex flex-col">
                <CardHeader className="px-4 py-3 border-b border-neutral-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Bot className="h-5 w-5 text-secondary mr-2" />
                      EWERS AI Assistant
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" title="Help">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Clear conversation"
                        onClick={clearMessages}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Save conversation">
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Ask questions about crisis data, get recommendations, or analyze patterns
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 p-4 overflow-auto" ref={chatContainerRef}>
                  <div className="space-y-4">
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
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 border-t border-neutral-100">
                  <div className="w-full">
                    <div className="flex space-x-2">
                      <Input 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question or request assistance..."
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
                  </div>
                </CardFooter>
              </Card>
              
              {/* Sidebar with suggested questions */}
              <Card className="w-72 hidden lg:flex flex-col h-full">
                <CardHeader className="px-4 py-3 border-b border-neutral-100">
                  <CardTitle className="text-sm">Suggested Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 overflow-auto">
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                          setInputValue(question);
                        }}
                        disabled={isLoading}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 border-t border-neutral-100">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    disabled={isLoading || messages.length < 2}
                  >
                    <BarChart className="h-4 w-4" />
                    Generate Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
