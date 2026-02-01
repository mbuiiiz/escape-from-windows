import React, { useState } from 'react';
import { useFileSystem, FileItem } from '@/contexts/FileSystemContext';
import { useWindows } from '@/contexts/WindowContext';
import { ChevronLeft, ChevronRight, ChevronUp, Search, Folder } from 'lucide-react';
interface MyComputerProps {
  windowId: string;
  props?: Record<string, unknown>;
}
export function MyComputer({ windowId, props }: MyComputerProps) {
  const { getFilesByPath, getFileById } = useFileSystem();
  const { openWindow } = useWindows();
  const [currentPath, setCurrentPath] = useState((props?.path as string) || '/my-computer');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const files = getFilesByPath(currentPath);
  const pathParts = currentPath.split('/').filter(Boolean);
  const navigateUp = () => {
    const parentPath = '/' + pathParts.slice(0, -1).join('/');
    if (parentPath !== '/') {
      setCurrentPath(parentPath);
    }
  };
  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };
  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder' || file.type === 'drive') {
      navigateTo(file.path);
    } else {
      // Open file in appropriate app
      if (file.name.endsWith('.txt') || file.name.endsWith('.doc')) {
        openWindow({
          id: `notepad-${file.id}`,
          title: `${file.name} - Notepad`,
          icon: '/xp-icons/notepad.png',
          component: 'Notepad',
          x: 150,
          y: 100,
          width: 600,
          height: 400,
          props: { content: file.content, fileName: file.name },
        });
      } else if (file.name.endsWith('.sh')) {
        openWindow({
          id: `notepadpp-${file.id}`,
          title: `${file.name} - Notepad++`,
          icon: '/xp-icons/notepadpp.png',
          component: 'NotepadPlusPlus',
          x: 150,
          y: 100,
          width: 800,
          height: 500,
          props: { content: file.content, fileName: file.name },
        });
      }
    }
  };
  const handleShowProperties = (file: FileItem) => {
    openWindow({
      id: `properties-${file.id}`,
      title: `${file.name} Properties`,
      icon: '/xp-icons/properties.png',
      component: 'FileProperties',
      x: 200,
      y: 150,
      width: 400,
      height: 450,
      props: { file },
    });
  };
  const getPathDisplay = () => {
    if (currentPath === '/my-computer') return 'My Computer';
    if (currentPath === '/my-computer/c') return 'Local Disk (C:)';
    if (currentPath === '/my-computer/e') return 'USB Drive (E:)';
    return pathParts[pathParts.length - 1];
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
      <div className="xp-explorer-toolbar">
        <button className="xp-explorer-toolbar-btn" onClick={navigateUp} disabled={currentPath === '/my-computer'}>
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <button className="xp-explorer-toolbar-btn disabled" disabled>
          <ChevronRight size={16} />
        </button>
        <button className="xp-explorer-toolbar-btn" onClick={navigateUp}>
          <ChevronUp size={16} />
        </button>
        <div className="flex-1" />
        <button className="xp-explorer-toolbar-btn">
          <Search size={16} />
          <span>Search</span>
        </button>
        <button className="xp-explorer-toolbar-btn">
          <Folder size={16} />
          <span>Folders</span>
        </button>
      </div>
      {/* Address Bar */}
      <div className="xp-explorer-address-bar">
        <span className="text-xs text-gray-600 mr-2">Address</span>
        <img src="/xp-icons/folder.png" alt="" className="w-4 h-4 mr-1" />
        <input type="text" value={getPathDisplay()} readOnly className="text-xs" />
      </div>
      {/* Content */}
      <div className="flex-1 xp-explorer-content xp-scrollbar overflow-auto">
        <div className="xp-file-list">
          {files.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-xs">This folder is empty</div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className={`xp-file-item ${selectedFile === file.id ? 'selected' : ''}`}
                onClick={() => setSelectedFile(file.id)}
                onDoubleClick={() => handleFileDoubleClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedFile(file.id);
                }}
              >
                <img src={file.icon} alt="" />
                <span>{file.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Status Bar */}
      <div className="xp-status-bar">
        <span>{files.length} object(s)</span>
        {selectedFile && (
          <button
            className="ml-auto text-xs underline cursor-pointer"
            onClick={() => {
              const file = getFileById(selectedFile);
              if (file) handleShowProperties(file);
            }}
          >
            Properties
          </button>
        )}
      </div>
    </div>
  );
}