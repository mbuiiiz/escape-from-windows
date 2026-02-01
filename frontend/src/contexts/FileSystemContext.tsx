import React, { createContext, useContext, useState, ReactNode } from 'react';
import { instructionsFileName, instructionsText } from '@/story/instructionsText';
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
  usbUnlocked: boolean;
  setUsbUnlocked: (unlocked: boolean) => void;
  antivirusEnabled: boolean;
  setAntivirusEnabled: (enabled: boolean) => void;
  getFilesByPath: (path: string) => FileItem[];
  getFileById: (id: string) => FileItem | undefined;
  restoreFromRecycleBin: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  applyGeneratedFiles: (generated: { path: string; content: string; metadata?: FileItem['metadata'] }[]) => void;
  corruptHint: () => void;
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
  },
  {
    id: 'local-disk-c',
    name: 'Local Disk (C:)',
    type: 'drive',
    icon: '/xp-icons/localdiskc.png',
    path: '/my-computer/c',
    parentPath: '/my-computer',
  },
  {
    id: 'usb-drive-e',
    name: 'USB Drive (E:)',
    type: 'drive',
    icon: '/xp-icons/usbc.png',
    path: '/my-computer/e',
    parentPath: '/my-computer',
  },
  {
    id: 'control-panel',
    name: 'Control Panel',
    type: 'folder',
    icon: '/xp-icons/controlpanelc.png',
    path: '/my-computer/control-panel',
    parentPath: '/my-computer',
  },

  // USB Drive (E:) (based on plot.md; file contents intentionally empty for now)
  {
    id: 'e-unlock',
    name: 'unlock.exe',
    type: 'file',
    icon: '/xp-icons/unlock.png',
    path: '/my-computer/e/unlock.exe',
    parentPath: '/my-computer/e',
    content: '',
  },
  {
    id: 'e-readme',
    name: 'README.txt',
    type: 'file',
    icon: '/xp-icons/readme.png',
    path: '/my-computer/e/README.txt',
    parentPath: '/my-computer/e',
    content: '',
  },
  {
    id: 'e-security-dat',
    name: 'security.dat',
    type: 'file',
    icon: '/xp-icons/prot.webp',
    path: '/my-computer/e/security.dat',
    parentPath: '/my-computer/e',
    content: '',
  },
  {
    id: 'e-backup',
    name: 'backup',
    type: 'folder',
    icon: '/xp-icons/backup.png',
    path: '/my-computer/e/backup',
    parentPath: '/my-computer/e',
  },
  {
    id: 'e-unlock-old',
    name: 'unlock_old.exe',
    type: 'file',
    icon: '/xp-icons/unlock.png',
    path: '/my-computer/e/backup/unlock_old.exe',
    parentPath: '/my-computer/e/backup',
    content: '',
  },

  // Local Disk (C:) (based on plot.md / puzzles.md; file contents intentionally empty for now)
  {
    id: 'c-owner',
    name: 'Owner',
    type: 'folder',
    icon: '/xp-icons/admin.png',
    path: '/my-computer/c/Owner',
    parentPath: '/my-computer/c',
  },
  {
    id: 'c-owner-desktop',
    name: 'Desktop',
    type: 'folder',
    icon: '/xp-icons/my-computer-icon.webp',
    path: '/my-computer/c/Owner/Desktop',
    parentPath: '/my-computer/c/Owner',
  },
  {
    id: 'c-owner-desktop-instructions',
    name: instructionsFileName,
    type: 'file',
    icon: '/xp-icons/text.png',
    path: `/my-computer/c/Owner/Desktop/${instructionsFileName}`,
    parentPath: '/my-computer/c/Owner/Desktop',
    content: instructionsText,
  },
  {
    id: 'c-owner-my-documents',
    name: 'My Documents',
    type: 'folder',
    icon: '/xp-icons/mydocs.ico',
    path: '/my-computer/c/Owner/My Documents',
    parentPath: '/my-computer/c/Owner',
  },
  {
    id: 'c-owner-downloads',
    name: 'Downloads',
    type: 'folder',
    icon: '/xp-icons/downloads.png',
    path: '/my-computer/c/Owner/Downloads',
    parentPath: '/my-computer/c/Owner',
  },
  {
    id: 'c-owner-downloads-do-not-click',
    name: 'do_not_click',
    type: 'file',
    icon: '/xp-icons/prot.webp',
    path: '/my-computer/c/Owner/Downloads/do_not_click',
    parentPath: '/my-computer/c/Owner/Downloads',
    content: 'This file looks suspicious.',
  },
  {
    id: 'c-owner-favourites',
    name: 'Favourites',
    type: 'folder',
    icon: '/xp-icons/favourites.ico',
    path: '/my-computer/c/Owner/Favourites',
    parentPath: '/my-computer/c/Owner',
  },
  {
    id: 'c-owner-notes',
    name: 'Notes',
    type: 'folder',
    icon: '/xp-icons/notes.png',
    path: '/my-computer/c/Owner/My Documents/Notes',
    parentPath: '/my-computer/c/Owner/My Documents',
  },
  {
    id: 'c-click-me-password',
    name: 'click_me_for_password',
    type: 'file',
    icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/click_me_for_password',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: 'Totally not a trap.',
  },
  {
    id: 'c-todo',
    name: 'todo.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/todo.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: '',
  },
  {
    id: 'c-notes',
    name: 'notes.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/notes.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: '',
  },
  {
    id: 'c-syntax-help',
    name: 'syntax_help.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/syntax_help.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: '',
  },
  {
    id: 'c-passwords-draft',
    name: 'passwords_draft.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/passwords_draft.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: '',
  },
  {
    id: 'c-random-thoughts',
    name: 'random_thoughts.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/random_thoughts.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: '',
  },
  {
    id: 'c-shopping-list',
    name: 'shopping_list.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Notes/shopping_list.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Notes',
    content: '',
  },
  {
    id: 'c-owner-projects',
    name: 'Projects',
    type: 'folder',
    icon: '/xp-icons/projects.png',
    path: '/my-computer/c/Owner/My Documents/Projects',
    parentPath: '/my-computer/c/Owner/My Documents',
  },
  {
    id: 'c-usb-cracker',
    name: 'usb_cracker',
    type: 'folder',
      icon: '/xp-icons/usbc.png',
    path: '/my-computer/c/Owner/My Documents/Projects/usb_cracker',
    parentPath: '/my-computer/c/Owner/My Documents/Projects',
  },
  {
    id: 'c-decrypt-js',
    name: 'decrypt.js',
    type: 'file',
      icon: '/xp-icons/speed.png',
    path: '/my-computer/c/Owner/My Documents/Projects/usb_cracker/decrypt.js',
    parentPath: '/my-computer/c/Owner/My Documents/Projects/usb_cracker',
    content: '',
  },
  {
    id: 'c-usb-cracker-readme',
    name: 'README.md',
    type: 'file',
      icon: '/xp-icons/speed.png',
    path: '/my-computer/c/Owner/My Documents/Projects/usb_cracker/README.md',
    parentPath: '/my-computer/c/Owner/My Documents/Projects/usb_cracker',
    content: '',
  },
  {
    id: 'c-old-scripts',
    name: 'old_scripts',
    type: 'folder',
      icon: '/xp-icons/notes.png',
    path: '/my-computer/c/Owner/My Documents/Projects/old_scripts',
    parentPath: '/my-computer/c/Owner/My Documents/Projects',
  },
  {
    id: 'c-decrypt-backup-js',
    name: 'decrypt_backup.js',
    type: 'file',
      icon: '/xp-icons/unlock.png',
    path: '/my-computer/c/Owner/My Documents/Projects/old_scripts/decrypt_backup.js',
    parentPath: '/my-computer/c/Owner/My Documents/Projects/old_scripts',
    content: '',
  },
  {
    id: 'c-old-notes',
    name: 'old_notes.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/my-computer/c/Owner/My Documents/Projects/old_scripts/old_notes.txt',
    parentPath: '/my-computer/c/Owner/My Documents/Projects/old_scripts',
    content: '',
  },
  {
    id: 'c-experiments',
    name: 'experiments',
    type: 'folder',
      icon: '/xp-icons/experiments.webp',
    path: '/my-computer/c/Owner/My Documents/Projects/experiments',
    parentPath: '/my-computer/c/Owner/My Documents/Projects',
  },
  {
    id: 'c-temp-js',
    name: 'temp.js',
    type: 'file',
      icon: '/xp-icons/java.png',
    path: '/my-computer/c/Owner/My Documents/Projects/experiments/temp.js',
    parentPath: '/my-computer/c/Owner/My Documents/Projects/experiments',
    content: '',
  },
  {
    id: 'c-hello-world-js',
    name: 'hello_world.js',
    type: 'file',
      icon: '/xp-icons/java.png',
    path: '/my-computer/c/Owner/My Documents/Projects/experiments/hello_world.js',
    parentPath: '/my-computer/c/Owner/My Documents/Projects/experiments',
    content: '',
  },
  {
    id: 'c-owner-images',
    name: 'Images',
    type: 'folder',
      icon: '/xp-icons/images.webp',
    path: '/my-computer/c/Owner/My Documents/Images',
    parentPath: '/my-computer/c/Owner/My Documents',
  },
  {
    id: 'c-desktop-jpg',
    name: 'desktop.jpg',
    type: 'file',
      icon: '/xp-icons/my-computer-icon.webp',
    path: '/my-computer/c/Owner/My Documents/Images/desktop.jpg',
    parentPath: '/my-computer/c/Owner/My Documents/Images',
    content: '',
  },
  {
    id: 'c-owner-audio',
    name: 'Audio',
    type: 'folder',
      icon: '/xp-icons/audio.jpeg',
    path: '/my-computer/c/Owner/My Documents/Audio',
    parentPath: '/my-computer/c/Owner/My Documents',
  },
];
const initialRecycleBin: FileItem[] = [
  {
    id: 'deleted-password',
    name: 'passwords_backup.txt',
    type: 'file',
      icon: '/xp-icons/text.png',
    path: '/recycle-bin/passwords_backup.txt',
    parentPath: '/recycle-bin',
    content: '',
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
      icon: '/xp-icons/text.png',
    path: '/recycle-bin/access_log_031205.txt',
    parentPath: '/recycle-bin',
    content: '',
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
    icon: '/xp-icons/mydocs.ico',
    path: '/recycle-bin/incident_report_draft.doc',
    parentPath: '/recycle-bin',
    content: '',
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
  const [usbUnlocked, setUsbUnlocked] = useState(false);
  const [antivirusEnabled, setAntivirusEnabled] = useState(false);
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

  const corruptHint = () => {
    const hintPaths = [
      '/my-computer/c/Owner/My Documents/Notes/notes.txt',
      '/my-computer/c/Owner/My Documents/Notes/syntax_help.txt',
      '/my-computer/c/Owner/My Documents/Notes/passwords_draft.txt',
      '/my-computer/c/Owner/My Documents/Notes/random_thoughts.txt',
    ];

    setFiles(prev => {
      let corrupted = false;
      const next = prev.map((file) => {
        if (corrupted) return file;
        if (hintPaths.includes(file.path) && (file.content ?? '') !== '') {
          corrupted = true;
          return { ...file, content: '' };
        }
        return file;
      });
      return next;
    });
  };

  const applyGeneratedFiles = (generated: { path: string; content: string; metadata?: FileItem['metadata'] }[]) => {
    const recycleEntries: Array<{ name: string; content: string; metadata?: FileItem['metadata'] }> = [];
    const normalEntries: Array<{ path: string; content: string; metadata?: FileItem['metadata'] }> = [];

    for (const f of generated) {
      if (!f?.path) continue;
      if (f.path.startsWith("C:/Recycle Bin/")) {
        const name = f.path.split("/").pop() || "unknown.txt";
        recycleEntries.push({ name, content: f.content ?? "", metadata: f.metadata });
        continue;
      }
      if (f.path.startsWith("C:/")) {
        const normalized = `/my-computer/c/Owner/${f.path.slice("C:/".length)}`;
        normalEntries.push({ path: normalized, content: f.content ?? "", metadata: f.metadata });
        continue;
      }
    }

    setFiles(prev => {
      const byPath = new Map(prev.map(item => [item.path, item]));
      for (const entry of normalEntries) {
        const existing = byPath.get(entry.path);
        if (existing) {
          byPath.set(entry.path, {
            ...existing,
            content: entry.content,
            metadata: entry.metadata || existing.metadata,
          });
          continue;
        }

        const pathParts = entry.path.split("/").filter(Boolean);
        const name = pathParts[pathParts.length - 1] || "unknown.txt";
        const parentPath = "/" + pathParts.slice(0, -1).join("/");

        const newItem: FileItem = {
          id: `gen-${entry.path}`,
          name,
          type: "file",
          icon: "/xp-icons/text.png",
          path: entry.path,
          parentPath,
          content: entry.content,
          metadata: entry.metadata,
        };
        byPath.set(entry.path, newItem);
      }
      return Array.from(byPath.values());
    });

    if (recycleEntries.length > 0) {
      setRecycleBin(recycleEntries.map((entry) => ({
        id: `gen-recycle-${entry.name}`,
        name: entry.name,
        type: "file",
        icon: "/xp-icons/text.png",
        path: `/recycle-bin/${entry.name}`,
        parentPath: "/recycle-bin",
        content: entry.content,
        metadata: entry.metadata,
        isDeleted: true,
      })));
    }
  };

  return (
    <FileSystemContext.Provider value={{
      files,
      recycleBin,
      usbUnlocked,
      setUsbUnlocked,
      antivirusEnabled,
      setAntivirusEnabled,
      getFilesByPath,
      getFileById,
      restoreFromRecycleBin,
      permanentlyDelete,
      applyGeneratedFiles,
      corruptHint,
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
