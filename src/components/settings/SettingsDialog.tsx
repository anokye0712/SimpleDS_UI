import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { 
    theme, 
    toggleTheme, 
    showContext, 
    setShowContext, 
    responseMode, 
    setResponseMode 
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark mode</div>
                <div className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Chat Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Show Context</div>
                <div className="text-sm text-muted-foreground">
                  Display sources used for generating responses
                </div>
              </div>
              <Switch
                checked={showContext}
                onCheckedChange={setShowContext}
                aria-label="Show context"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Response Mode</div>
                <div className="text-sm text-muted-foreground">
                  Stream responses or receive them all at once
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={responseMode === 'blocking' ? 'font-medium' : 'text-muted-foreground'}>
                  Block
                </span>
                <Switch
                  checked={responseMode === 'streaming'}
                  onCheckedChange={(checked) => setResponseMode(checked ? 'streaming' : 'blocking')}
                  aria-label="Toggle response mode"
                />
                <span className={responseMode === 'streaming' ? 'font-medium' : 'text-muted-foreground'}>
                  Stream
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 border-t flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}