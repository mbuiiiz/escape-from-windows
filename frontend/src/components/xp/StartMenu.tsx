import React from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { useSystem } from '@/contexts/SystemContext';
const leftMenuItems = [
  { name: 'Internet Explorer', icon: '/xp-icons/ie.png', component: 'InternetExplorer', bold: true },
  { name: 'Outlook Express', icon: '/xp-icons/outlook.png', component: 'Notepad', bold: true },
  { type: 'separator' },
  { name: 'Notepad', icon: '/xp-icons/notepad.png', component: 'Notepad' },
  { name: 'Notepad++', icon: '/xp-icons/notepadpp.png', component: 'NotepadPlusPlus' },
  { name: 'Command Prompt', icon: '/xp-icons/cmd.png', component: 'CommandPrompt' },
  { type: 'separator' },
  { name: 'All Programs', icon: '/xp-icons/programs.png', hasArrow: true },
];
const rightMenuItems = [
  { name: 'My Documents', icon: '/xp-icons/my-documents.png' },
  { name: 'My Pictures', icon: '/xp-icons/my-pictures.png' },
  { name: 'My Music', icon: '/xp-icons/my-music.png' },
  { name: 'My Computer', icon: '/xp-icons/my-computer.png', component: 'MyComputer' },
  { type: 'separator' },
  { name: 'Control Panel', icon: '/xp-icons/control-panel.png' },
  { name: 'Set Program Access', icon: '/xp-icons/programs.png' },
  { type: 'separator' },
  { name: 'Help and Support', icon: '/xp-icons/help.png' },
  { name: 'Search', icon: '/xp-icons/search.png' },
  { name: 'Run...', icon: '/xp-icons/run.png' },
];
export function StartMenu() {
  const { openWindow } = useWindows();
  const { setStartMenuOpen } = useSystem();
  const handleItemClick = (item: typeof leftMenuItems[0]) => {
    if ('component' in item && item.component) {
      const windowConfigs: Record<string, { width: number; height: number }> = {
        'MyComputer': { width: 700, height: 500 },
        'InternetExplorer': { width: 900, height: 600 },
        'Notepad': { width: 600, height: 400 },
        'NotepadPlusPlus': { width: 800, height: 500 },
        'CommandPrompt': { width: 680, height: 400 },
      };
      const config = windowConfigs[item.component] || { width: 600, height: 400 };
      openWindow({
        id: `${item.component.toLowerCase()}-${Date.now()}`,
        title: item.name,
        icon: item.icon!,
        component: item.component,
        x: 100 + Math.random() * 100,
        y: 50 + Math.random() * 50,
        ...config,
      });
    }
    setStartMenuOpen(false);
  };
  return (
    <div className="xp-start-menu" onClick={(e) => e.stopPropagation()}>
      {/* Header with user */}
      <div className="xp-start-menu-header">
        <div className="xp-start-menu-avatar">
          <img src="/xp-icons/user.png" alt="User" className="w-full h-full" />
        </div>
        <span className="xp-start-menu-username">User</span>
      </div>
      {/* Content */}
      <div className="xp-start-menu-content">
        {/* Left Column */}
        <div className="xp-start-menu-left">
          {leftMenuItems.map((item, i) => (
            item.type === 'separator' ? (
              <div key={i} className="h-px bg-gray-200 my-2 mx-2" />
            ) : (
              <div
                key={i}
                className="xp-start-menu-item"
                onClick={() => handleItemClick(item)}
              >
                <img src={item.icon} alt="" />
                <span className={item.bold ? 'font-bold' : ''}>{item.name}</span>
              </div>
            )
          ))}
        </div>
        {/* Right Column */}
        <div className="xp-start-menu-right">
          {rightMenuItems.map((item, i) => (
            item.type === 'separator' ? (
              <div key={i} className="h-px bg-blue-200 my-2 mx-2" />
            ) : (
              <div
                key={i}
                className="xp-start-menu-item"
                onClick={() => handleItemClick(item as typeof leftMenuItems[0])}
              >
                <img src={item.icon} alt="" className="w-6 h-6" />
                <span>{item.name}</span>
              </div>
            )
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="xp-start-menu-footer">
        <div className="xp-start-menu-footer-btn">
          <img src="/xp-icons/shutdown.png" alt="" className="w-5 h-5" />
          <span>Turn Off Computer</span>
        </div>
      </div>
    </div>
  );
}