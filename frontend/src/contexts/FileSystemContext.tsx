import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'drive';
  icon: string;
  path: string;
  parentPath: string;
  content?: string;
  metadata?: {
    created: string;
    modified: string;
    size: string;
    signature?: string;
    author?: string;
  };
  isDeleted?: boolean;
  children?: FileItem[];
}
interface FileSystemContextType {
  files: FileItem[];
  recycleBin: FileItem[];
  getFilesByPath: (path: string) => FileItem[];
  getFileById: (id: string) => FileItem | undefined;
  restoreFromRecycleBin: (id: string) => void;
  permanentlyDelete: (id: string) => void;
}
// Initial file system with puzzle content
const initialFiles: FileItem[] = [
  {
    id: 'my-computer',
    name: 'My Computer',
    type: 'folder',
    icon: '/xp-icons/my-computer.png',
    path: '/my-computer',
    parentPath: '/',
    children: [
      {
        id: 'local-disk-c',
        name: 'Local Disk (C:)',
        type: 'drive',
        icon: '/xp-icons/drive.png',
        path: '/my-computer/c',
        parentPath: '/my-computer',
      },
      {
        id: 'usb-drive-e',
        name: 'USB Drive (E:)',
        type: 'drive',
        icon: '/xp-icons/usb-drive.png',
        path: '/my-computer/e',
        parentPath: '/my-computer',
      },
    ],
  },
  // USB Drive contents
  {
    id: 'usb-readme',
    name: 'README.txt',
    type: 'file',
    icon: '/xp-icons/text-file.png',
    path: '/my-computer/e/README.txt',
    parentPath: '/my-computer/e',
    content: 'IMPORTANT: Run decrypt.sh after changing system date to 03/15/2005\n\nThe password is hidden in the draft emails.',
    metadata: {
      created: '03/12/2005 10:23 AM',
      modified: '03/14/2005 11:47 PM',
      size: '156 bytes',
      signature: 'A7F2B9C1',
    },
  },
  {
    id: 'usb-decrypt',
    name: 'decrypt.sh',
    type: 'file',
    icon: '/xp-icons/script-file.png',
    path: '/my-computer/e/decrypt.sh',
    parentPath: '/my-computer/e',
    content: '#!/bin/bash\n# Decryption Script v1.2\n# Author: J.Smith\n\nDATE=$(date +%m/%d/%Y)\n\nif [ "$DATE" = "03/15/2005" ]; then\n    echo "Access granted..."\n    echo "Decrypting files..."\n    # Missing line here - syntax error\n    cat /secret/data.enc | base64 -d\nelse\n    echo "ERROR: Invalid system date"\n    echo "Hint: Check the incident report"\nfi',
    metadata: {
      created: '03/10/2005 03:15 PM',
      modified: '03/14/2005 09:22 PM',
      size: '312 bytes',
      signature: 'B8E4D2A0',
    },
  },
  {
    id: 'usb-notes',
    name: 'personal_notes.txt',
    type: 'file',
    icon: '/xp-icons/text-file.png',
    path: '/my-computer/e/personal_notes.txt',
    parentPath: '/my-computer/e',
    content: 'Meeting Notes - March 2005\n\n- Server backup scheduled for 15th\n- New security protocols implemented\n- Password changed to: ******\n  (Check Yahoo drafts for reminder)\n\n- Suspicious activity detected on 03/12\n- Need to investigate user: admin_backup\n\nTODO:\n[ ] Check restore points\n[ ] Review browser history\n[ ] Verify file signatures',
    metadata: {
      created: '03/08/2005 02:30 PM',
      modified: '03/14/2005 08:15 PM',
      size: '489 bytes',
      author: 'jsmith',
    },
  },
  {
    id: 'usb-evidence',
    name: 'evidence',
    type: 'folder',
    icon: '/xp-icons/folder.png',
    path: '/my-computer/e/evidence',
    parentPath: '/my-computer/e',
  },
  {
    id: 'evidence-screenshot',
    name: 'screenshot_031205.bmp',
    type: 'file',
    icon: '/xp-icons/image-file.png',
    path: '/my-computer/e/evidence/screenshot_031205.bmp',
    parentPath: '/my-computer/e/evidence',
    metadata: {
      created: '03/12/2005 11:45 PM',
      modified: '03/12/2005 11:45 PM',
      size: '2.4 MB',
      signature: 'C9F3E1B7',
    },
  },
  // C: Drive contents
  {
    id: 'c-documents',
    name: 'My Documents',
    type: 'folder',
    icon: '/xp-icons/my-documents.png',
    path: '/my-computer/c/documents',
    parentPath: '/my-computer/c',
  },
  {
    id: 'c-program-files',
    name: 'Program Files',
    type: 'folder',
    icon: '/xp-icons/folder.png',
    path: '/my-computer/c/program-files',
    parentPath: '/my-computer/c',
  },
  {
    id: 'doc-todo',
    name: 'todo_list.txt',
    type: 'file',
    icon: '/xp-icons/text-file.png',
    path: '/my-computer/c/documents/todo_list.txt',
    parentPath: '/my-computer/c/documents',
    content: 'Weekly Tasks - Week of March 14\n\n[x] Update firewall rules\n[x] Backup database\n[ ] Change admin password\n[ ] Review access logs\n[ ] Meeting with IT security\n\nIMPORTANT: Check email from sarah@company.com\nabout the security breach.\n\nPassword hint: First pet name + birth year',
    metadata: {
      created: '03/14/2005 08:00 AM',
      modified: '03/14/2005 06:30 PM',
      size: '298 bytes',
    },
  },
];
const initialRecycleBin: FileItem[] = [
  {
    id: 'deleted-password',
    name: 'passwords_backup.txt',
    type: 'file',
    icon: '/xp-icons/text-file.png',
    path: '/recycle-bin/passwords_backup.txt',
    parentPath: '/recycle-bin',
    content: 'BACKUP PASSWORDS - DO NOT SHARE\n\nEmail: jsmith@company.com\nPass: M****2005\n\nServer Admin:\nUser: admin_backup  \nPass: [ENCRYPTED - use decrypt.sh]\n\nHint for main password:\n"The date everything changed"',
    metadata: {
      created: '03/01/2005 10:00 AM',
      modified: '03/12/2005 02:15 PM',
      size: '186 bytes',
    },
    isDeleted: true,
  },
  {
    id: 'deleted-log',
    name: 'access_log_031205.txt',
    type: 'file',
    icon: '/xp-icons/text-file.png',
    path: '/recycle-bin/access_log_031205.txt',
    parentPath: '/recycle-bin',
    content: 'ACCESS LOG - March 12, 2005\n\n22:15:03 - Login attempt: admin (FAILED)\n22:15:18 - Login attempt: admin (FAILED)\n22:15:45 - Login attempt: admin_backup (SUCCESS)\n22:16:02 - File accessed: /secret/data.enc\n22:17:33 - File copied to: E:\\evidence\\\n22:18:01 - Logout: admin_backup\n\n*** SUSPICIOUS ACTIVITY DETECTED ***\n*** IP: 192.168.1.105 ***',
    metadata: {
      created: '03/12/2005 11:59 PM',
      modified: '03/12/2005 11:59 PM',
      size: '421 bytes',
    },
    isDeleted: true,
  },
  {
    id: 'deleted-report',
    name: 'incident_report_draft.doc',
    type: 'file',
    icon: '/xp-icons/doc-file.png',
    path: '/recycle-bin/incident_report_draft.doc',
    parentPath: '/recycle-bin',
    content: 'INCIDENT REPORT - DRAFT\n\nDate of Incident: March 12, 2005\nReported by: John Smith\n\nSummary:\nUnauthorized access detected on company server.\nSuspect used backup admin credentials.\n\nEvidence collected:\n- Access logs (see attachment)\n- Screenshot of active session\n- USB drive with copied files\n\nNext Steps:\n1. Change system date to incident date\n2. Run forensic analysis\n3. Check restore points for file changes',
    metadata: {
      created: '03/13/2005 09:00 AM',
      modified: '03/14/2005 04:45 PM',
      size: '534 bytes',
    },
    isDeleted: true,
  },
];
const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);
export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [recycleBin, setRecycleBin] = useState<FileItem[]>(initialRecycleBin);
  const getFilesByPath = (path: string): FileItem[] => {
    if (path === '/recycle-bin') {
      return recycleBin;
    }
    return files.filter(f => f.parentPath === path);
  };
  const getFileById = (id: string): FileItem | undefined => {
    return files.find(f => f.id === id) || recycleBin.find(f => f.id === id);
  };
  const restoreFromRecycleBin = (id: string) => {
    const file = recycleBin.find(f => f.id === id);
    if (file) {
      setRecycleBin(prev => prev.filter(f => f.id !== id));
      setFiles(prev => [...prev, { ...file, isDeleted: false, path: `/my-computer/c/documents/${file.name}`, parentPath: '/my-computer/c/documents' }]);
    }
  };
  const permanentlyDelete = (id: string) => {
    setRecycleBin(prev => prev.filter(f => f.id !== id));
  };
  return (
    <FileSystemContext.Provider value={{
      files,
      recycleBin,
      getFilesByPath,
      getFileById,
      restoreFromRecycleBin,
      permanentlyDelete,
    }}>
      {children}
    </FileSystemContext.Provider>
  );
}
export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
}