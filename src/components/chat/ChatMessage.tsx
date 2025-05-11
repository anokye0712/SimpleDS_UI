import React from 'react';
import { Bot, User, AlertTriangle, Loader2 } from 'lucide-react';
import { Message, Context } from '@/types';
import { ContextDisplay } from '@/components/chat/ContextDisplay';
import { useSettingsStore } from '@/store/settingsStore';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  contexts?: Context[];
}

export function ChatMessage({ message, contexts }: ChatMessageProps) {
  const { showContext } = useSettingsStore();
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`py-6 ${isAssistant ? 'bg-muted/5' : ''}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-4">
        <div className="flex-none mt-1">
          <div className={`h-8 w-8 rounded-xl glass flex items-center justify-center ${
            isAssistant ? 'text-primary' : 'text-secondary'
          }`}>
            {isAssistant ? <Bot size={18} /> : <User size={18} />}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              {isAssistant ? 'Assistant' : 'You'}
              {message.isLoading && (
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              )}
            </div>
            
            {message.error ? (
              <div className="flex items-start gap-2 glass p-3 text-destructive rounded-xl">
                <AlertTriangle size={16} className="mt-1 flex-none" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{message.error}</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {isAssistant ? (
                  <ReactMarkdown>{message.content || ' '}</ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            )}
            
            {showContext && isAssistant && contexts && contexts.length > 0 && (
              <ContextDisplay contexts={contexts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}