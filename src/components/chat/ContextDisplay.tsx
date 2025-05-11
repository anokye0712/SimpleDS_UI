import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Context } from '@/types';

interface ContextDisplayProps {
  contexts: Context[];
}

export function ContextDisplay({ contexts }: ContextDisplayProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!contexts.length) return null;

  return (
    <div className="glass rounded-xl overflow-hidden mt-2">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sources ({contexts.length})</span>
        </div>
        <button className="text-muted-foreground" aria-label={isOpen ? "Collapse sources" : "Expand sources"}>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isOpen && (
        <ScrollArea className="max-h-72">
          <div className="divide-y divide-border/50">
            {contexts.map((context) => (
              <div key={context.id} className="p-3 text-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-xs text-muted-foreground">
                    {context.source || 'Unknown source'}
                    {context.metadata?.documentName && ` - ${context.metadata.documentName}`}
                  </div>
                  
                  {context.metadata?.documentUrl && (
                    <a
                      href={context.metadata.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center text-xs gap-1"
                    >
                      <span>View source</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                
                <p className="text-sm whitespace-pre-line">{context.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}