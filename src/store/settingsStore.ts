import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, Theme } from '@/types';

interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setShowContext: (show: boolean) => void;
  setResponseMode: (mode: 'streaming' | 'blocking') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      showContext: true,
      responseMode: 'streaming',
      
      setTheme: (theme) => set({ theme }),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setShowContext: (showContext) => set({ showContext }),
      
      setResponseMode: (responseMode) => set({ responseMode }),
    }),
    {
      name: 'settings-storage',
    }
  )
);