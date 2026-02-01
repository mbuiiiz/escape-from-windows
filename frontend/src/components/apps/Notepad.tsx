import React, { useState } from 'react';
interface NotepadProps {
  windowId: string;
  props?: Record<string, unknown>;
}
export function Notepad({ windowId, props }: NotepadProps) {
  const initialContent = (props?.content as string) || '';
  const fileName = (props?.fileName as string) || 'Untitled';
  const readOnly = (props?.readOnly as boolean) || false;
  const [content, setContent] = useState(initialContent);
  const [wordWrap, setWordWrap] = useState(true);
  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-white border-b border-gray-300 text-xs">
        <span className="cursor-pointer hover:underline">File</span>
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