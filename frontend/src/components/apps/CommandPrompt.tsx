import React, { useState, useRef, useEffect } from 'react';
import { useSystem } from '@/contexts/SystemContext';
interface CommandPromptProps {
  windowId: string;
  props?: Record<string, unknown>;
}
interface HistoryEntry {
  command: string;
  output: string;
}
export function CommandPrompt({ windowId, props }: CommandPromptProps) {
  const { systemTime, showPopup } = useSystem();
  const [history, setHistory] = useState<HistoryEntry[]>([
    { command: '', output: 'Microsoft Windows XP [Version 5.1.2600]\n(C) Copyright 1985-2001 Microsoft Corp.\n' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);
  const executeCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let output = '';
    if (command === 'help') {
      output = `Available commands:
  DIR          - List directory contents
  CD           - Change directory
  DATE         - Display or set the date
  TIME         - Display the current time
  CLS          - Clear the screen
  HELP         - Display this help message
  E:           - Switch to USB drive
  RUN <file>   - Execute a script file`;
    } else if (command === 'dir') {
      output = ` Volume in drive C has no label.
 Volume Serial Number is 1234-5678
 Directory of C:\\
03/14/2005  09:00 AM    <DIR>          Documents and Settings
03/10/2005  10:30 AM    <DIR>          Program Files
03/01/2005  08:00 AM    <DIR>          Windows
               0 File(s)              0 bytes
               3 Dir(s)  10,485,760 bytes free`;
    } else if (command === 'e:' || command === 'cd e:') {
      output = `E:\\>
 Directory of E:\\
03/12/2005  10:23 AM           156 README.txt
03/14/2005  09:22 PM           312 decrypt.sh
03/14/2005  08:15 PM           489 personal_notes.txt
03/12/2005  11:45 PM    <DIR>          evidence
               3 File(s)            957 bytes
               1 Dir(s)   2,097,152 bytes free`;
    } else if (command === 'date') {
      const dateStr = systemTime.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      output = `The current date is: ${dateStr}`;
    } else if (command === 'time') {
      output = `The current time is: ${systemTime.toLocaleTimeString()}`;
    } else if (command === 'cls') {
      setHistory([]);
      setCurrentInput('');
      return;
    } else if (command.startsWith('run decrypt.sh') || command === './decrypt.sh') {
      const targetDate = new Date('2005-03-15');
      const currentDate = new Date(systemTime.toDateString());
      if (currentDate.getTime() === targetDate.getTime()) {
        output = `Access granted...
Decrypting files...
=================================
DECRYPTED DATA:
=================================
Server Access Credentials:
Username: admin_backup
Password: March2005
Incident Report:
Date: 03/12/2005
Perpetrator: Unknown (used backup credentials)
Files accessed: /secret/data.enc
Evidence location: E:\\evidence\\
*** CASE SOLVED ***
=================================`;
        setTimeout(() => {
          showPopup({
            id: 'solved',
            type: 'info',
            title: 'Congratulations!',
            message: 'You have successfully decrypted the files and solved the mystery! The password was "March2005" and the incident occurred on March 12, 2005.',
          });
        }, 1000);
      } else {
        output = `ERROR: Invalid system date
Hint: Check the incident report
Current date: ${systemTime.toLocaleDateString()}
Required date: 03/15/2005
Use Date & Time settings to change the system date.`;
      }
    } else if (command.startsWith('cd')) {
      output = `The system cannot find the path specified.`;
    } else if (command === 'exit') {
      output = 'Goodbye.';
    } else if (command !== '') {
      output = `'${cmd}' is not recognized as an internal or external command,
operable program or batch file.`;
    }
    setHistory((prev) => [...prev, { command: cmd, output }]);
    setCurrentInput('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };
  return (
    <div
      ref={containerRef}
      className="xp-terminal h-full cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, i) => (
        <div key={i}>
          {entry.command && (
            <div>
              <span>C:\&gt;</span>
              {entry.command}
            </div>
          )}
          <pre className="whitespace-pre-wrap">{entry.output}</pre>
        </div>
      ))}
      <div className="flex">
        <span>C:\&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="xp-terminal-input flex-1"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}