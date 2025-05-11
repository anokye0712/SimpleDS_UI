import React from 'react';
import { Plus, Trash2, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  openSettings: () => void;
}

export function Header({ sidebarOpen, setSidebarOpen, openSettings }: HeaderProps) {
  const { theme } = useTheme();
  const { createConversation, clearAllConversations } = useChatStore();

  const handleNewChat = () => {
    createConversation();
  };

  const handleClearConversations = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This cannot be undone.')) {
      clearAllConversations();
    }
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <h1 className="text-xl font-semibold ml-2">Afrakoma<sup>TM</sup></h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNewChat}
                  aria-label="New chat"
                >
                  <Plus size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Chat</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearConversations}
                  aria-label="Clear all chats"
                >
                  <Trash2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear All Conversations</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openSettings}
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}