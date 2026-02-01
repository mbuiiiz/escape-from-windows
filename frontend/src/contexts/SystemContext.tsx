import React, { createContext, useContext, useState, ReactNode } from 'react';
interface SystemContextType {
  systemTime: Date;
  setSystemTime: (date: Date) => void;
  isStartMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  showPopup: (popup: PopupConfig) => void;
  closePopup: (id: string) => void;
  popups: PopupConfig[];
}
export interface PopupConfig {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  buttons?: { label: string; onClick?: () => void }[];
}
const SystemContext = createContext<SystemContextType | undefined>(undefined);
export function SystemProvider({ children }: { children: ReactNode }) {
  const [systemTime, setSystemTime] = useState(new Date());
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [popups, setPopups] = useState<PopupConfig[]>([]);
  const showPopup = (popup: PopupConfig) => {
    setPopups(prev => [...prev, popup]);
  };
  const closePopup = (id: string) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };
  return (
    <SystemContext.Provider value={{
      systemTime,
      setSystemTime,
      isStartMenuOpen,
      setStartMenuOpen,
      showPopup,
      closePopup,
      popups,
    }}>
      {children}
    </SystemContext.Provider>
  );
}
export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}