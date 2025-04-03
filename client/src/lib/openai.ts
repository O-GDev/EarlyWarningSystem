import { useState } from 'react';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface AiAssistantProps {
  systemPrompt?: string;
  initialMessages?: Message[];
}

export function useAiAssistant({
  systemPrompt = "You are an AI assistant for an Early Warning Early Response System (EWERS). You help with crisis analysis, provide recommendations for response actions, and assist in interpreting data patterns. Be concise, analytical, and focus on actionable insights.",
  initialMessages = []
}: AiAssistantProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: systemPrompt },
    ...initialMessages
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(userMessage: string) {
    setIsLoading(true);
    setError(null);

    // Add user message to state
    const newUserMessage: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          model: MODEL,
        }),
      });

      // We still process the response even if status code isn't 200
      // because we've modified the server to always return a valid response
      const data = await response.json();
      
      // Check if we have an error message in the response
      if (data.error) {
        setError(data.error);
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: "I'm having trouble connecting to the AI service. This could be due to a configuration issue or a temporary service disruption." 
        };
        setMessages(prev => [...prev, assistantMessage]);
        return assistantMessage.content;
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.message || 'I apologize, but I was unable to generate a response.' 
      };

      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Still provide a fallback message to the UI
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: "I'm experiencing technical difficulties. Please try again later or contact the administrator." 
      };
      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage.content;
    } finally {
      setIsLoading(false);
    }
  }

  function clearMessages() {
    setMessages([{ role: 'system', content: systemPrompt }]);
  }

  return {
    messages: messages.filter(m => m.role !== 'system'),
    sendMessage,
    clearMessages,
    isLoading,
    error
  };
}

export async function getAiAnalysis(text: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model: MODEL,
      }),
    });

    // Always process the response even if not 200 OK
    const data = await response.json();
    
    if (data.error) {
      console.error('AI analysis error:', data.error);
      return 'AI analysis is currently unavailable. This feature requires an OpenAI API key.';
    }
    
    return data.analysis || 'No analysis available';
  } catch (err) {
    console.error('AI analysis error:', err);
    return 'AI analysis is temporarily unavailable. Please try again later.';
  }
}

export async function getResponseRecommendations(incident: any): Promise<string> {
  try {
    const response = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        incident,
        model: MODEL,
      }),
    });

    // Always process the response even if not 200 OK
    const data = await response.json();
    
    if (data.error) {
      console.error('AI recommendations error:', data.error);
      return 'AI recommendations are currently unavailable. This feature requires an OpenAI API key.';
    }
    
    return data.recommendations || 'No recommendations available';
  } catch (err) {
    console.error('AI recommendations error:', err);
    return 'AI recommendations are temporarily unavailable. Please try again later.';
  }
}

export async function getTrendAnalysis(trendData: any): Promise<{
  insights: string;
  recommendations: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
}> {
  try {
    const response = await fetch('/api/ai/analyze-trends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trendData,
        model: MODEL,
      }),
    });

    // Always process the response even if not 200 OK
    const data = await response.json();
    
    if (data.error) {
      console.error('AI trend analysis error:', data.error);
      return {
        insights: 'AI trend analysis is currently unavailable. This feature requires an OpenAI API key.',
        recommendations: 'Configure your OpenAI API key to access AI-powered recommendations.',
        riskLevel: 'medium',
        confidence: 0
      };
    }
    
    return data.analysis || {
      insights: 'No trend analysis available',
      recommendations: 'Try again later or contact support',
      riskLevel: 'medium',
      confidence: 0
    };
  } catch (err) {
    console.error('AI trend analysis error:', err);
    return {
      insights: 'AI trend analysis is temporarily unavailable. Please try again later.',
      recommendations: 'Check your connection and try again.',
      riskLevel: 'medium',
      confidence: 0
    };
  }
}
