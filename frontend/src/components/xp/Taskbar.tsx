import React, { useEffect, useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { useSystem } from '@/contexts/SystemContext';
import { StartMenu } from '@/components/xp/StartMenu';
import xpIcon from '@/assets/XP-ICON.png';
import xpVolume from '@/assets/XP-VOLUME.png';
import xpWifi from '@/assets/XP-WIFI.jpg';
import explorerIcon from '@/assets/tinyExplorer.png'

export function Taskbar() {
  const { windows, focusWindow, activeWindowId } = useWindows();
  const { systemTime, isStartMenuOpen, setStartMenuOpen } = useSystem();
  const [currentTime, setCurrentTime] = useState(systemTime);
  useEffect(() => {
    const interval = setInterval(() => {
      // Update display time based on system time
      const now = new Date();
      const diff = now.getTime() - new Date().getTime();
      setCurrentTime(new Date(systemTime.getTime() + diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [systemTime]);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  return (
    <>
      {isStartMenuOpen && <StartMenu />}
      <div className="xp-taskbar">
        {/* Start Button */}
        <button
          className="xp-start-button"
          onClick={() => setStartMenuOpen(!isStartMenuOpen)}
        >
          <img src={xpIcon} alt="Start" />
          <span>start</span>
        </button>
        {/* Running Programs */}
        <div className="xp-taskbar-programs">
          {windows.map((win) => (
            <div
              key={win.id}
              className={`xp-taskbar-program ${activeWindowId === win.id && !win.isMinimized ? 'active' : ''}`}
              onClick={() => focusWindow(win.id)}
            >
              <img src={win.icon} alt="" />
              <span>{win.title}</span>
            </div>
          ))}
        </div>
        {/* System Tray */}
        <div className="xp-system-tray">
          <div className="xp-tray-icons">
            <img src={xpVolume} alt="Volume" className="xp-tray-icon" />
            <img src={xpWifi} alt="Network" className="xp-tray-icon" />
          </div>
          <div className="xp-clock">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </>
  );
}