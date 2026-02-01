import React, { useEffect } from 'react';
import { WindowProvider, useWindows } from '@/contexts/WindowContext';
import { SystemProvider } from '@/contexts/SystemContext';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { Desktop } from '@/components/xp/Desktop';
import { Taskbar } from '@/components/xp/Taskbar';
import { WindowManager } from '@/components/xp/WindowManager';
import { SystemPopup } from '@/components/xp/SystemPopup';
import '@/styles/xp-theme.css';
import ieIcon from '@/assets/explorer-icon.png';

function StartupWindows() {
  const { openWindow } = useWindows();

  useEffect(() => {
    openWindow({
      id: 'startup-ie',
      title: 'Internet Explorer',
      icon: ieIcon,
      component: 'InternetExplorer',
      x: 80,
      y: 50,
      width: 900,
      height: 600,
      props: {
        initialUrl: 'http://escape-from-windows.local',
        tabTitle: 'Escape From Windows',
      },
    });
  }, [openWindow]);

  return null;
}

const Index = () => {
  return (
    <SystemProvider>
      <WindowProvider>
        <FileSystemProvider>
          <StartupWindows />
          <div className="xp-os fixed inset-0 flex flex-col overflow-hidden select-none">
            {/* Desktop takes all remaining space */}
            <div className="flex-1 overflow-hidden relative">
              <Desktop />
              <WindowManager />  {/* windows float over desktop */}
            </div>

            {/* Taskbar stays at bottom, fixed height */}
            <Taskbar />

            {/* Popups can overlay everything */}
            <SystemPopup />
          </div>
        </FileSystemProvider>
      </WindowProvider>
    </SystemProvider>
  );
};

export default Index;
