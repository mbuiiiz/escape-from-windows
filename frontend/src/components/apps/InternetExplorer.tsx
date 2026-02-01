import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Home, History } from 'lucide-react';
import { YahooMail } from './YahooMail.tsx';
import { useWindows } from '@/contexts/WindowContext';
import { EscapeFromWindowsLanding } from './EscapeFromWindowsLanding';
import txtIcon from '@/assets/txt-icon.jpg';
import { instructionsFileName, instructionsText } from '@/story/instructionsText';
import { apiClient } from '@/api/client';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSystem } from '@/contexts/SystemContext';
interface InternetExplorerProps {
  windowId: string;
  props?: Record<string, unknown>;
}
const browsingHistory = [
  { url: 'http://www.google.com', title: 'Google', date: '03/14/2005 09:15 AM' },
  { url: 'http://mail.yahoo.com', title: 'Yahoo! Mail', date: '03/14/2005 10:30 AM' },
  { url: 'http://www.company-intranet.local', title: 'Company Intranet', date: '03/12/2005 11:45 PM' },
  { url: 'http://192.168.1.105/admin', title: 'Admin Panel', date: '03/12/2005 10:15 PM' },
  { url: 'http://www.security-updates.com/patches', title: 'Security Patches', date: '03/11/2005 02:30 PM' },
];
export function InternetExplorer({ windowId, props }: InternetExplorerProps) {
  const { closeWindow, openWindow } = useWindows();
  const { applyGeneratedFiles } = useFileSystem();
  const { showPopup } = useSystem();
  const homeUrl = 'http://escape-from-windows.local';
  const initialUrl = (props?.initialUrl as string) || homeUrl;
  const tabTitle = (props?.tabTitle as string) || 'Internet Explorer';

  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [showHistory, setShowHistory] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [hasGame, setHasGame] = useState(false);

  const openInstructions = () => {
    openWindow({
      id: 'instructions-notepad',
      title: `${instructionsFileName} - Notepad`,
      icon: txtIcon,
      component: 'Notepad',
      x: 140,
      y: 90,
      width: 640,
      height: 440,
      props: {
        fileName: instructionsFileName,
        content: instructionsText,
        readOnly: true,
      },
    });
  };

  const handleStart = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const res = await apiClient.request<{
        sessionId: string;
        game?: { files?: Array<{ path: string; content: string; metadata?: { created: string; modified: string; size: string; signature?: string; author?: string } }> };
      }>('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ playerName: 'Player' }),
      });

      if (res?.sessionId) {
        localStorage.setItem('xpgame.sessionId', res.sessionId);
      }

      const files = res?.game?.files;
      if (Array.isArray(files)) {
        applyGeneratedFiles(files);
      }

      setHasGame(true);
      closeWindow(windowId);
      openInstructions();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      showPopup({
        id: `start-error-${Date.now()}`,
        type: 'error',
        title: 'Could not start game',
        message:
          message.includes('Failed to fetch') || message.includes('Network error')
            ? 'Backend not reachable. Start the backend on http://localhost:8080 and try again.'
            : message,
        buttons: [{ label: 'OK' }],
      });
      setIsStarting(false);
    }
  };

  const handleContinue = () => {
    closeWindow(windowId);
    openInstructions();
  };

  const handleNewGame = async () => {
    localStorage.removeItem('xpgame.sessionId');
    setHasGame(false);
    await handleStart();
  };

  useEffect(() => {
    const sessionId = localStorage.getItem('xpgame.sessionId');
    if (!sessionId) {
      setHasGame(false);
      return;
    }
    let cancelled = false;
    const loadGame = async () => {
      setIsStarting(true);
      try {
        const res = await apiClient.request<{
          sessionId: string;
          game?: { files?: Array<{ path: string; content: string; metadata?: { created: string; modified: string; size: string; signature?: string; author?: string } }> };
        }>(`/api/sessions/${sessionId}/game`);
        const files = res?.game?.files;
        if (!cancelled && Array.isArray(files)) {
          applyGeneratedFiles(files);
          setHasGame(true);
        } else if (!cancelled) {
          setHasGame(false);
        }
      } catch {
        if (!cancelled) setHasGame(false);
      } finally {
        if (!cancelled) setIsStarting(false);
      }
    };
    loadGame();
    return () => {
      cancelled = true;
    };
  }, [applyGeneratedFiles]);

  const renderPage = () => {
    if (currentUrl.includes('escape-from-windows')) {
      return (
        <EscapeFromWindowsLanding
          onStart={handleStart}
          onContinue={handleContinue}
          onNewGame={handleNewGame}
          hasGame={hasGame}
          isStarting={isStarting}
        />
      );
    }
    if (currentUrl.includes('yahoo')) {
      return <YahooMail />;
    }
    if (currentUrl.includes('google')) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-white">
          <div className="text-6xl font-serif mb-4">
            <span className="text-blue-600">G</span>
            <span className="text-red-600">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-600">g</span>
            <span className="text-green-600">l</span>
            <span className="text-red-600">e</span>
          </div>
          <div className="flex gap-2">
            <input type="text" className="xp-input w-80" placeholder="Search the web..." />
            <button className="xp-button">Google Search</button>
          </div>
          <p className="text-xs text-gray-600 mt-4">© 2005 Google</p>
        </div>
      );
    }
    if (currentUrl.includes('192.168.1.105')) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
          <div className="bg-white p-8 rounded shadow-lg border">
            <h2 className="text-lg font-bold mb-4 text-red-600">⚠ Admin Panel</h2>
            <p className="text-sm mb-4">Access restricted. Authentication required.</p>
            <div className="space-y-2">
              <div>
                <label className="text-xs block mb-1">Username:</label>
                <input type="text" className="xp-input w-full" />
              </div>
              <div>
                <label className="text-xs block mb-1">Password:</label>
                <input type="password" className="xp-input w-full" />
              </div>
            </div>
            <button className="xp-button mt-4 w-full">Login</button>
            <p className="text-xs text-gray-500 mt-2">Last login: 03/12/2005 10:15 PM from admin_backup</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h2 className="text-lg">The page cannot be displayed</h2>
          <p className="text-sm text-gray-600 mt-2">
            The page you are looking for is currently unavailable.
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-white border-b border-gray-300 text-xs">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Favorites</span>
        <span className="cursor-pointer hover:underline">Tools</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>
      {/* Toolbar */}
      <div className="xp-ie-toolbar">
        <button className="xp-ie-nav-btn disabled">
          <ChevronLeft size={16} />
        </button>
        <button className="xp-ie-nav-btn disabled">
          <ChevronRight size={16} />
        </button>
        <button className="xp-ie-nav-btn">
          <RotateCw size={14} />
        </button>
        <button className="xp-ie-nav-btn" onClick={() => setCurrentUrl(homeUrl)}>
          <Home size={14} />
        </button>
        <div className="xp-ie-address">
          <img src="/xp-icons/ie.png" alt="" className="w-4 h-4 mr-1" />
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentUrl(currentUrl)}
          />
        </div>
        <button className="xp-ie-nav-btn" onClick={() => setShowHistory(!showHistory)}>
          <History size={14} />
        </button>
      </div>
      {/* Tabs */}
      <div className="flex items-end bg-[hsl(210_15%_92%)] border-b border-gray-300 px-2 h-7">
        <div className="px-3 py-1 bg-white border border-b-0 border-gray-300 text-xs rounded-t">
          {tabTitle}
        </div>
        <div className="ml-2 text-[10px] text-gray-600 self-center truncate">
          {currentUrl}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        {showHistory && (
          <div className="xp-ie-sidebar">
            <div className="p-2 bg-blue-100 border-b border-blue-200 font-bold text-xs">
              History
            </div>
            <div className="p-2">
              <div className="text-xs font-bold mb-2">Today</div>
              {browsingHistory.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-1 text-xs cursor-pointer hover:bg-blue-50"
                  onClick={() => {
                    setCurrentUrl(item.url);
                  }}
                >
                  <img src="/xp-icons/ie-small.png" alt="" className="w-4 h-4" />
                  <div>
                    <div className="truncate w-36">{item.title}</div>
                    <div className="text-gray-500 text-[10px]">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Page Content */}
        <div className="xp-ie-content flex-1">
          {renderPage()}
        </div>
      </div>
      {/* Status Bar */}
      <div className="xp-status-bar">
        <span>Done</span>
        <span className="ml-auto">Internet</span>
      </div>
    </div>
  );
}
