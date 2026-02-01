import React, { useState } from 'react';
import { useFileSystem, FileItem } from '@/contexts/FileSystemContext';
import { useWindows } from '@/contexts/WindowContext';
import { Trash2 } from 'lucide-react';
interface RecycleBinProps {
  windowId: string;
  props?: Record<string, unknown>;
}
export function RecycleBin({ windowId, props }: RecycleBinProps) {
  const { recycleBin, restoreFromRecycleBin, permanentlyDelete } = useFileSystem();
  const { openWindow } = useWindows();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const handleFileDoubleClick = (file: FileItem) => {
    if (file.name.endsWith('.js') || file.name.endsWith('.sh')) {
      openWindow({
        id: `notepadpp-${file.id}`,
        title: `${file.name} - Notepad++`,
        icon: '/xp-icons/notepadpp.png',
        component: 'NotepadPlusPlus',
        x: 150,
        y: 100,
        width: 800,
        height: 500,
        props: { content: file.content, fileName: file.name, filePath: file.path, readOnly: true },
      });
      return;
    }

    // Open other files in Notepad to view
    openWindow({
      id: `notepad-${file.id}`,
      title: `${file.name} - Notepad`,
      icon: '/xp-icons/notepad.png',
      component: 'Notepad',
      x: 150,
      y: 100,
      width: 600,
      height: 400,
      props: { content: file.content, fileName: file.name, filePath: file.path, readOnly: true },
    });
  };
  const handleRestore = () => {
    if (selectedFile) {
      restoreFromRecycleBin(selectedFile);
      setSelectedFile(null);
    }
  };
  const handleDelete = () => {
    if (selectedFile) {
      permanentlyDelete(selectedFile);
      setSelectedFile(null);
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-white border-b border-gray-300 text-xs">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>
      {/* Toolbar */}
      <div className="xp-explorer-toolbar">
        <button
          className="xp-explorer-toolbar-btn"
          onClick={handleRestore}
          disabled={!selectedFile}
        >
          Restore this item
        </button>
        <button
          className="xp-explorer-toolbar-btn"
          onClick={handleDelete}
          disabled={!selectedFile}
        >
          Delete
        </button>
        <div className="flex-1" />
        <button className="xp-explorer-toolbar-btn" onClick={() => {
          recycleBin.forEach(f => permanentlyDelete(f.id));
        }}>
          Empty Recycle Bin
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 xp-explorer-content xp-scrollbar overflow-auto">
        {recycleBin.length === 0 ? (
          <div className="xp-recycle-empty">
            <Trash2 size={48} className="mb-4 opacity-50" />
            <p className="text-sm">Recycle Bin is empty</p>
          </div>
        ) : (
          <div className="xp-file-list">
            {recycleBin.map((file) => (
              <div
                key={file.id}
                className={`xp-file-item ${selectedFile === file.id ? 'selected' : ''}`}
                onClick={() => setSelectedFile(file.id)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >
                <img src={file.icon} alt="" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Status Bar */}
      <div className="xp-status-bar">
        <span>{recycleBin.length} object(s)</span>
      </div>
    </div>
  );
}
