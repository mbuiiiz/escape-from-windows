import React from 'react';
import { WindowProvider } from '@/contexts/WindowContext';
import { SystemProvider } from '@/contexts/SystemContext';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { Desktop } from '@/components/xp/Desktop';
import { Taskbar } from '@/components/xp/Taskbar';
import { WindowManager } from '@/components/xp/WindowManager';
import { SystemPopup } from '@/components/xp/SystemPopup';
import '@/styles/xp-theme.css';

const Index = () => {
  return (
    <SystemProvider>
      <WindowProvider>
        <FileSystemProvider>
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
