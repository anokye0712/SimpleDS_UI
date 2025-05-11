import React from 'react';
import { Bot, Sun, Terminal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onStartNewChat: (initialMessage?: string) => void;
}

export function EmptyState({ onStartNewChat }: EmptyStateProps) {
  const examples = [
    "What programs are offered at KNUST's College of Agriculture?",
    "Tell me about the admission requirements for Engineering at KNUST",
    "What research centers exist at KNUST?",
    "Explain KNUST's history and development over the years",
    "What facilities are available at the College of Science?"
  ];

  return (
    <div className="h-full flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Bot size={24} className="text-primary" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">Welcome to KNUST Knowledge Assistant</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        I'm here to help answer your questions about KNUST - from academic programs to research centers, facilities and more.
      </p>
      
      <div className="grid gap-4 w-full max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Sun size={18} className="text-primary" />
            </div>
            <h3 className="font-medium">Comprehensive Knowledge</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Access detailed information about KNUST's colleges, departments, programs and facilities
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Zap size={18} className="text-primary" />
            </div>
            <h3 className="font-medium">Real-time Assistance</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get instant answers to your questions about KNUST with accurate, up-to-date information
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b">
            <h3 className="font-medium">Try asking about...</h3>
          </div>
          <div className="p-4 grid gap-3">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-sm font-normal h-auto py-2"
                onClick={() => onStartNewChat(example)}
              >
                <Terminal size={14} className="mr-2 text-muted-foreground" />
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}