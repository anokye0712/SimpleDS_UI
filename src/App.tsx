import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toast';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useSettingsStore } from '@/store/settingsStore';
import { useChatStore } from '@/store/chatStore';
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme } = useSettingsStore();
  const { conversations, createConversation } = useChatStore();
  
  // Generate a stable user ID for the session
  const [userId] = useState(() => {
    const storedId = localStorage.getItem('rag_user_id');
    if (storedId) return storedId;
    
    const newId = `user-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('rag_user_id', newId);
    return newId;
  });
  
  // Create a conversation on first load if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, [conversations.length, createConversation]);
  
  // Effect to handle theme class on document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  // Effect to handle sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="flex h-screen bg-background text-foreground">
          <div className={`md:static fixed inset-y-0 left-0 z-20 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <Sidebar isOpen={sidebarOpen} />
          </div>
          
          <div className="flex-1 flex flex-col min-w-0">
            <Header 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen} 
              openSettings={openSettings} 
            />
            <main className="flex-1 overflow-hidden">
              <ChatInterface userId={userId} />
            </main>
          </div>
          
          <SettingsDialog isOpen={settingsOpen} onClose={closeSettings} />
          <Toaster />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;