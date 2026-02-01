import React, { useState } from 'react';
interface NotepadPlusPlusProps {
  windowId: string;
  props?: Record<string, unknown>;
}
interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
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
export function NotepadPlusPlus({ windowId, props }: NotepadPlusPlusProps) {
  const initialContent = props?.content as string;
  const fileName = props?.fileName as string;
  const [tabs, setTabs] = useState<Tab[]>(() => {
    if (initialContent && fileName) {
      return [
        {
          id: 'custom',
          name: fileName,
          content: initialContent,
          language: fileName.endsWith('.sh') ? 'bash' : 'text',
        },
        ...defaultTabs,
      ];
    }
    return defaultTabs;
  });
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];
  const handleContentChange = (newContent: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTab ? { ...t, content: newContent } : t))
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
    <div className="flex flex-col h-full bg-white">
      {/* Menu Bar */}
      <div className="flex items-center gap-4 px-2 py-1 bg-gray-100 border-b border-gray-300 text-xs">
        <span className="cursor-pointer hover:underline">File</span>
        <span className="cursor-pointer hover:underline">Edit</span>
        <span className="cursor-pointer hover:underline">Search</span>
        <span className="cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Encoding</span>
        <span className="cursor-pointer hover:underline">Language</span>
        <span className="cursor-pointer hover:underline">Run</span>
        <span className="cursor-pointer hover:underline">Plugins</span>
      </div>
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
            className="absolute inset-0 w-full h-full p-1 font-mono text-xs leading-5 resize-none outline-none bg-transparent text-transparent caret-black"
            value={activeTabData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            spellCheck={false}
          />
          <pre
            className="absolute inset-0 w-full h-full p-1 font-mono text-xs leading-5 pointer-events-none overflow-auto"
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
    </div>
  );
}