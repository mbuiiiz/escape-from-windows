import React, { useMemo, useState } from 'react';
import { FileItem } from '@/contexts/FileSystemContext';
interface FilePropertiesProps {
  windowId: string;
  props?: Record<string, unknown>;
}
export function FileProperties({ windowId, props }: FilePropertiesProps) {
  const file = props?.file as FileItem | undefined;
  const [activeTab, setActiveTab] = useState<'general' | 'details'>('general');
  if (!file) {
    return <div className="p-4">No file selected</div>;
  }
  const getFileTypeDescription = (name: string) => {
    if (name.endsWith('.txt')) return 'Text Document';
    if (name.endsWith('.doc')) return 'Microsoft Word Document';
    if (name.endsWith('.sh')) return 'Shell Script';
    if (name.endsWith('.bmp')) return 'Bitmap Image';
    if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'JPEG Image';
    if (name.endsWith('.png')) return 'PNG Image';
    return 'File';
  };
  const sizeLabel = useMemo(() => {
    if (file.metadata?.size) return file.metadata.size;
    if (file.content) return `${new Blob([file.content]).size} bytes`;
    return '0 bytes';
  }, [file.content, file.metadata?.size]);
  return (
    <div className="flex flex-col h-full bg-[hsl(210_20%_93%)]">
      {/* Tabs */}
      <div className="xp-properties-tabs">
        <div
          className={`xp-properties-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </div>
        <div
          className={`xp-properties-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        {activeTab === 'general' && (
          <>
            {/* File Icon and Name */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-400 mb-4">
              <img src={file.icon} alt="" className="w-12 h-12" />
              <div>
                <input
                  type="text"
                  value={file.name}
                  readOnly
                  className="xp-input w-64 font-bold"
                />
              </div>
            </div>
            {/* File Properties */}
            <div className="space-y-2 text-xs">
              <div className="xp-properties-row">
                <span className="xp-properties-label">Type of file:</span>
                <span className="xp-properties-value">{getFileTypeDescription(file.name)}</span>
              </div>
              <div className="xp-properties-row">
                <span className="xp-properties-label">Location:</span>
                <span className="xp-properties-value">{file.parentPath}</span>
              </div>
              <div className="xp-properties-row">
                <span className="xp-properties-label">Size:</span>
                <span className="xp-properties-value">{sizeLabel}</span>
              </div>
              <div className="border-t border-gray-400 my-3" />
              {file.metadata?.created && (
                <div className="xp-properties-row">
                  <span className="xp-properties-label">Created:</span>
                  <span className="xp-properties-value">{file.metadata.created}</span>
                </div>
              )}
              {file.metadata?.modified && (
                <div className="xp-properties-row">
                  <span className="xp-properties-label">Modified:</span>
                  <span className="xp-properties-value">{file.metadata.modified}</span>
                </div>
              )}
              {file.metadata?.signature && (
                <>
                  <div className="border-t border-gray-400 my-3" />
                  <div className="xp-properties-row">
                    <span className="xp-properties-label">File Signature:</span>
                    <span className="xp-properties-value font-mono bg-gray-100 px-2 py-1 rounded">
                      {file.metadata.signature}
                    </span>
                  </div>
                </>
              )}
              {file.metadata?.author && (
                <div className="xp-properties-row">
                  <span className="xp-properties-label">Author:</span>
                  <span className="xp-properties-value">{file.metadata.author}</span>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === 'details' && (
          <div className="space-y-2 text-xs">
            <div className="xp-properties-row">
              <span className="xp-properties-label">Name:</span>
              <span className="xp-properties-value">{file.name}</span>
            </div>
            <div className="xp-properties-row">
              <span className="xp-properties-label">Type:</span>
              <span className="xp-properties-value">{getFileTypeDescription(file.name)}</span>
            </div>
            <div className="xp-properties-row">
              <span className="xp-properties-label">Location:</span>
              <span className="xp-properties-value">{file.parentPath}</span>
            </div>
            <div className="xp-properties-row">
              <span className="xp-properties-label">Full Path:</span>
              <span className="xp-properties-value">{file.path}</span>
            </div>
            <div className="xp-properties-row">
              <span className="xp-properties-label">Size:</span>
              <span className="xp-properties-value">{sizeLabel}</span>
            </div>
            {file.metadata?.created && (
              <div className="xp-properties-row">
                <span className="xp-properties-label">Created:</span>
                <span className="xp-properties-value">{file.metadata.created}</span>
              </div>
            )}
            {file.metadata?.modified && (
              <div className="xp-properties-row">
                <span className="xp-properties-label">Modified:</span>
                <span className="xp-properties-value">{file.metadata.modified}</span>
              </div>
            )}
            {file.metadata?.author && (
              <div className="xp-properties-row">
                <span className="xp-properties-label">Author:</span>
                <span className="xp-properties-value">{file.metadata.author}</span>
              </div>
            )}
            {file.metadata?.signature && (
              <div className="xp-properties-row">
                <span className="xp-properties-label">Signature:</span>
                <span className="xp-properties-value font-mono bg-gray-100 px-2 py-1 rounded">
                  {file.metadata.signature}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Buttons */}
      <div className="p-4 border-t flex justify-end gap-2">
        <button className="xp-button">OK</button>
        <button className="xp-button">Cancel</button>
        <button className="xp-button">Apply</button>
      </div>
    </div>
  );
}
