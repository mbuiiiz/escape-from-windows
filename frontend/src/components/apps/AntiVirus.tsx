import React, { useEffect } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSystem } from '@/contexts/SystemContext';
import { useWindows } from '@/contexts/WindowContext';

interface AntiVirusProps {
  windowId: string;
  props?: Record<string, unknown>;
}

export function AntiVirus({ windowId }: AntiVirusProps) {
  const { antivirusEnabled, setAntivirusEnabled } = useFileSystem();
  const { showPopup } = useSystem();
  const { closeWindow } = useWindows();

  useEffect(() => {
    if (antivirusEnabled) {
      showPopup({
        id: `av-already-${Date.now()}`,
        type: 'info',
        title: 'Anti-Virus',
        message: 'You are already protected.',
        buttons: [{ label: 'OK' }],
      });
      closeWindow(windowId);
      return;
    }

    setAntivirusEnabled(true);
    showPopup({
      id: `av-enabled-${Date.now()}`,
      type: 'info',
      title: 'Anti-Virus',
      message: 'You are now protected.',
      buttons: [{ label: 'OK' }],
    });
    closeWindow(windowId);
  }, [antivirusEnabled, closeWindow, setAntivirusEnabled, showPopup, windowId]);

  return null;
}

