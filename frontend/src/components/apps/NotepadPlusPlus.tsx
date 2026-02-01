import React, { useEffect, useMemo, useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { useFileSystem } from '@/contexts/FileSystemContext';

interface NotepadPlusPlusProps {
  windowId: string;
  props?: Record<string, unknown>;
}
interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  path?: string;
}
const defaultTabs: Tab[] = [
  {
    id: 'decrypt',
    name: 'decrypt.sh',
    content: `#!/bin/bash
# Decryption Script v1.2
# Author: J.Smith
DATE=$(date +%m/%d/%Y)
if [ "$DATE" = "03/15/2005" ]; then
    echo "Access granted..."
    echo "Decrypting files..."
    # TODO: Add decryption command here
    cat /secret/data.enc | base64 -d
else
    echo "ERROR: Invalid system date"
    echo "Hint: Check the incident report"
fi`,
    language: 'bash',
  },
  {
    id: 'fix-me',
    name: 'verify_access.sh',
    content: `#!/bin/bash
# Security Verification Script
# FIX THE ERRORS IN THIS SCRIPT
USER=$1
PASS=$2
# Error on line below - missing quotes
if [ $USER == admin_backup ]; then
    # Error - wrong operator
    if [ $PASS = "March2005" ]
        echo "Access granted"
        # Missing 'then' keyword above
        ./run_backup.sh
    fi
fi
# Hint: There are 3 syntax errors
# Fix them to reveal the secret`,
    language: 'bash',
  },
];

const STORAGE_KEY = "notepadpp-tabs";

export function NotepadPlusPlus({ windowId, props }: NotepadPlusPlusProps) {

  const initialContent = props?.content as string;
  const fileName = props?.fileName as string;
  const filePath = props?.filePath as string | undefined;
  const readOnly = (props?.readOnly as boolean) || false;
  const initialTabs = useMemo<Tab[]>(() => {
    const incoming = initialContent && fileName ? {
      id: filePath || `tab-${fileName}`,
      name: fileName,
      content: initialContent,
      language: fileName.endsWith('.js') ? 'javascript' : fileName.endsWith('.sh') ? 'bash' : 'text',
      path: filePath,
    } : null;

    let stored: Tab[] | null = null;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        stored = JSON.parse(raw) as Tab[];
      } catch (e) {
        console.error('Failed to parse saved tabs:', e);
      }
    }
    if (incoming && stored?.length) {
      const filtered = stored.filter((t) => t.name !== incoming.name);
      return [incoming, ...filtered];
    }
    if (incoming) return [incoming, ...(stored ?? defaultTabs)];
    if (stored?.length) return stored;
    return defaultTabs;
  }, [fileName, filePath, initialContent]);

  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTab, setActiveTab] = useState(() => initialTabs[0]?.id ?? 'decrypt');
  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];
  const [showFileMenu, setShowFileMenu] = useState(false);
  const { showPopup } = useSystem();
  const { updateFileContent, setUsbUnlocked } = useFileSystem();
  const [runOutput, setRunOutput] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    console.log('saved tabs to sessionStorage');
  }, [tabs]);
  
  const handleContentChange = (newContent: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTab ? { ...t, content: newContent } : t)),
    );
  };
  const getLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return lines.map((_, i) => i + 1);
  };
  const highlightSyntax = (content: string, language: string) => {
    if (language !== 'bash') return content;
    // Simple syntax highlighting
    return content
      .split('\n')
      .map((line) => {
        // Comments
        if (line.trim().startsWith('#')) {
          return `<span class="text-green-600">${line}</span>`;
        }
        // Keywords
        let highlighted = line
          .replace(/\b(if|then|else|fi|echo|exit|cat|date|read)\b/g, '<span class="text-blue-600 font-bold">$1</span>')
          .replace(/\b(USER|PASS|DATE)\b/g, '<span class="text-purple-600">$1</span>')
          .replace(/"([^"]*)"/g, '<span class="text-orange-600">"$1"</span>')
          .replace(/\$\(([^)]+)\)/g, '<span class="text-teal-600">$($1)</span>')
          .replace(/\$\w+/g, '<span class="text-red-600">$&</span>');
        return highlighted;
      })
      .join('\n');
  };
  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-gray-100 border-b border-gray-300 text-xs">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setShowFileMenu((v) => !v)}
        >
          File
        </span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">Search</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Encoding</span>
        <span className="cursor-pointer hover:underline">Language</span>
        <span
          className="cursor-pointer hover:underline"
          onClick={() => {
            const ts = new Date().toLocaleTimeString();
            const contentRaw = activeTabData.content || '';
            const contentLower = contentRaw.toLowerCase();
            const currentPath = activeTabData.path || filePath;
            const hasCorrectOrder = () => {
              const tokens = ['01_clean', '02_decode', '03_extract', '04_build_key'];
              let pos = -1;
              for (const token of tokens) {
                const next = contentLower.indexOf(token, pos + 1);
                if (next === -1) return false;
                pos = next;
              }
              return true;
            };

            const isUsbCrackerFile =
              (currentPath && currentPath.includes('/Projects/usb_cracker/')) ||
              ['run.js', 'decrypt.js'].includes(activeTabData.name.toLowerCase());

            if (isUsbCrackerFile && hasCorrectOrder()) {
              setUsbUnlocked(true);
              setRunOutput(
                `> Running ${activeTabData.name}\nExecuted at ${ts}\n\nUSB unlocked via cracking.`
              );
              showPopup({
                id: `run-${Date.now()}`,
                type: 'info',
                title: 'Run',
                message: 'USB unlocked via cracking.',
                buttons: [{ label: 'OK' }],
              });
              return;
            }

            setRunOutput(
              `> Running ${activeTabData.name}\nExecuted at ${ts}\n\n(Output is simulated in this build.)`
            );
            showPopup({
              id: `run-${Date.now()}`,
              type: 'info',
              title: 'Run',
              message: `${activeTabData.name} executed.`,
              buttons: [{ label: 'OK' }],
            });
          }}
        >
          Run
        </span>
        <span className="cursor-pointer hover:underline">Plugins</span>
      </div>
      {showFileMenu && (
        <div className="absolute left-2 top-7 z-10 bg-white border border-gray-300 text-xs shadow-md">
          <div
            className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setShowFileMenu(false);
              const targetPath = activeTabData.path || filePath;
              if (!readOnly && targetPath) {
                updateFileContent(targetPath, activeTabData.content);
              }
              showPopup({
                id: `save-${Date.now()}`,
                type: 'info',
                title: 'Save',
                message: readOnly ? 'This file is read-only.' : `${activeTabData.name} saved.`,
                buttons: [{ label: 'OK' }],
              });
            }}
          >
            Save
          </div>
          <div
            className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setShowFileMenu(false);
              const targetPath = activeTabData.path || filePath;
              if (!readOnly && targetPath) {
                updateFileContent(targetPath, activeTabData.content);
              }
              showPopup({
                id: `saveas-${Date.now()}`,
                type: 'info',
                title: 'Save As',
                message: readOnly ? 'This file is read-only.' : `${activeTabData.name} saved.`,
                buttons: [{ label: 'OK' }],
              });
            }}
          >
            Save As...
          </div>
        </div>
      )}
      {/* Tabs */}
      <div className="xp-notepadpp-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`xp-notepadpp-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <img src="/xp-icons/script-file.png" alt="" className="w-4 h-4" />
            <span>{tab.name}</span>
          </div>
        ))}
      </div>
      {/* Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        <div className="xp-notepadpp-gutter xp-scrollbar overflow-auto">
          {getLineNumbers(activeTabData.content).map((num) => (
            <div key={num} className="leading-5 text-right">
              {num}
            </div>
          ))}
        </div>
        {/* Code Editor */}
        <div className="flex-1 relative">
          <textarea
            className="w-full h-full p-1 font-mono text-xs leading-5 resize-none outline-none bg-transparent caret-black"
            value={activeTabData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            spellCheck={false}
            style={{ caretColor: 'black' }}
          />
          <pre
            className="w-full h-full p-1 font-mono text-xs leading-5 pointer-events-none overflow-auto"
            dangerouslySetInnerHTML={{
              __html: highlightSyntax(activeTabData.content, activeTabData.language),
            }}
          />
        </div>
      </div>
      {/* Status Bar */}
      <div className="xp-status-bar flex justify-between">
        <span>
          Length: {activeTabData.content.length} | Lines:{' '}
          {activeTabData.content.split('\n').length}
        </span>
        <span>{activeTabData.language.toUpperCase()}</span>
      </div>
      {runOutput && (
        <div className="border-t border-gray-300 bg-white text-xs p-2 font-mono whitespace-pre-wrap">
          {runOutput}
        </div>
      )}
    </div>
  );
}
