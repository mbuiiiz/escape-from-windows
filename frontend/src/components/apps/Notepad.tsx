import React, { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { useFileSystem } from '@/contexts/FileSystemContext';
interface NotepadProps {
  windowId: string;
  props?: Record<string, unknown>;
}
export function Notepad({ windowId, props }: NotepadProps) {
  const initialContent = (props?.content as string) || '';
  const fileName = (props?.fileName as string) || 'Untitled';
  const filePath = props?.filePath as string | undefined;
  const readOnly = (props?.readOnly as boolean) || false;
  const [content, setContent] = useState(initialContent);
  const [wordWrap, setWordWrap] = useState(true);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const { showPopup } = useSystem();
  const { updateFileContent } = useFileSystem();

  const handleSave = () => {
    if (readOnly) {
      showPopup({
        id: `save-${Date.now()}`,
        type: 'info',
        title: 'Save',
        message: 'This file is read-only.',
        buttons: [{ label: 'OK' }],
      });
      return;
    }
    if (filePath) {
      updateFileContent(filePath, content);
    }
    showPopup({
      id: `save-${Date.now()}`,
      type: 'info',
      title: 'Save',
      message: `${fileName} saved.`,
      buttons: [{ label: 'OK' }],
    });
  };
  return (
    <div className="flex flex-col h-full relative">
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-white border-b border-gray-300 text-xs">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setShowFileMenu((v) => !v)}
        >
          File
        </span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setWordWrap(!wordWrap)}
        >
          Format
        </span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>
      {showFileMenu && (
        <div className="absolute left-2 top-7 z-10 bg-white border border-gray-300 text-xs shadow-md">
          <div
            className={`px-3 py-1 hover:bg-blue-100 cursor-pointer ${readOnly ? 'text-gray-400' : ''}`}
            onClick={() => {
              setShowFileMenu(false);
              handleSave();
            }}
          >
            Save
          </div>
          <div
            className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setShowFileMenu(false);
              handleSave();
            }}
          >
            Save As...
          </div>
        </div>
      )}
      {/* Content */}
      <div className="flex-1 xp-notepad-content">
        <textarea
          className="xp-notepad-textarea"
          value={content}
          onChange={(e) => !readOnly && setContent(e.target.value)}
          readOnly={readOnly}
          style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
          spellCheck={false}
        />
      </div>
      {/* Status Bar */}
      <div className="xp-status-bar">
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
}
