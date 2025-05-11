import React from 'react';
import { MessageSquare, Trash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';
import { formatDate } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation, 
    deleteConversation 
  } = useChatStore();

  if (!isOpen) return null;

  const handleConversationClick = (id: string) => {
    setCurrentConversation(id);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-4rem)] border-r border-border bg-background overflow-hidden transition-all duration-300 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium">Conversations</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {conversations.length === 0 ? (
            <div className="text-sm text-muted-foreground p-3 text-center">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => {
              const firstMessage = conversation.messages[0]?.content || 'New Conversation';
              const truncatedTitle = firstMessage.length > 25 
                ? firstMessage.substring(0, 25) + '...' 
                : firstMessage;
              
              return (
                <div
                  key={conversation.id}
                  className={`group rounded-md p-2 cursor-pointer flex items-center justify-between hover:bg-muted transition-colors ${
                    currentConversationId === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MessageSquare size={16} className="shrink-0" />
                    <div className="truncate">
                      <div className="text-sm font-medium truncate">{truncatedTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(new Date(conversation.createdAt))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    aria-label="Delete conversation"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}