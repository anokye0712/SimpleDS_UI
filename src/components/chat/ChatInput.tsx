import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = 'Type your message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    const adjustHeight = () => {
      textArea.style.height = 'auto';
      textArea.style.height = `${Math.min(textArea.scrollHeight, 200)}px`;
    };

    textArea.addEventListener('input', adjustHeight);
    
    return () => {
      textArea.removeEventListener('input', adjustHeight);
    };
  }, []);

  // Focus textarea after submitting
  useEffect(() => {
    if (message === '' && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background sticky bottom-0 z-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2 items-end relative border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="flex-1 max-h-[200px] min-h-[44px] resize-none py-3 px-4 focus:outline-none bg-transparent"
            aria-label="Message input"
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
            className="absolute right-2 bottom-2"
            aria-label="Send message"
          >
            <SendHorizontal size={18} />
          </Button>
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          <span>Press Shift + Enter for a new line</span>
        </div>
      </div>
    </form>
  );
}