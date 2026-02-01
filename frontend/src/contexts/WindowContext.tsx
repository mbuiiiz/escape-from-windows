import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  props?: Record<string, unknown>;
}
interface WindowContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (window: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isMaximized'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}
const WindowContext = createContext<WindowContextType | undefined>(undefined);
let nextZIndex = 100;
export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const openWindow = useCallback((windowConfig: Omit<WindowState, 'zIndex' | 'isMinimized' | 'isMaximized'>) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.id === windowConfig.id);
      if (existingWindow) {
        return prev.map(w =>
          w.id === windowConfig.id
            ? { ...w, isMinimized: false, zIndex: ++nextZIndex }
            : w
        );
      }
      const newWindow: WindowState = {
        ...windowConfig,
        isMinimized: false,
        isMaximized: false,
        zIndex: ++nextZIndex,
      };
      return [...prev, newWindow];
    });
    setActiveWindowId(windowConfig.id);
  }, []);
  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);
  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);
  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: true, zIndex: ++nextZIndex } : w
    ));
    setActiveWindowId(id);
  }, []);
  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: false, isMinimized: false, zIndex: ++nextZIndex } : w
    ));
    setActiveWindowId(id);
  }, []);
  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: ++nextZIndex, isMinimized: false } : w
    ));
    setActiveWindowId(id);
  }, []);
  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);
  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, width, height } : w
    ));
  }, []);
  return (
    <WindowContext.Provider value={{
      windows,
      activeWindowId,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowContext.Provider>
  );
}
export function useWindows() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within a WindowProvider');
  }
  return context;
}
