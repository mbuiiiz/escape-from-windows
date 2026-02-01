import React, { useState } from "react";
import { useWindows } from "@/contexts/WindowContext";
import { useSystem } from "@/contexts/SystemContext";
import { useFileSystem, FileItem } from "@/contexts/FileSystemContext";
import { DesktopIcon } from "@/components/xp/DesktopIcon";
import { ContextMenu } from "@/components/xp/ContextMenu";

import myComputerIcon from "@/assets/my-computer-icon.webp";
import recycleBinIcon from "@/assets/bin-icon.webp";
import ieIcon from "@/assets/explorer-icon.png";
import notepadIcon from "@/assets/notepad-icon.webp";
import notepadppIcon from "@/assets/node++-icon.png";
import cmdIcon from "@/assets/command-prompt-icon.png";
import systemRestoreIcon from "@/assets/system-restore-icon.jpeg";
import txtIcon from "@/assets/txt-icon.jpg";
import controlPanelIcon from "@/assets/control-panel-icon.webp";
import xpBackground from "@/assets/xp-background.webp";
import { instructionsFileName, instructionsText } from "@/story/instructionsText";

type DesktopIconConfig = {
    id: string;
    name: string;
    icon: string;
    component: string;
    windowId?: string;
    windowProps?: Record<string, unknown>;
    windowTitle?: string;
};

const desktopIcons: DesktopIconConfig[] = [
    {
        id: "my-computer",
        name: "My Computer",
        icon: myComputerIcon,
        component: "MyComputer",
    },
    {
        id: "recycle-bin",
        name: "Recycle Bin",
        icon: recycleBinIcon,
        component: "RecycleBin",
    },
    {
        id: "ie",
        name: "Internet Explorer",
        icon: ieIcon,
        component: "InternetExplorer",
    },
    { id: "notepad", name: "Notepad", icon: notepadIcon, component: "Notepad" },
    {
        id: "notepadpp",
        name: "Notepad++",
        icon: notepadppIcon,
        component: "NotepadPlusPlus",
    },
    {
        id: "cmd",
        name: "Command Prompt",
        icon: cmdIcon,
        component: "CommandPrompt",
    },
    {
        id: "system-restore",
        name: "System Restore",
        icon: systemRestoreIcon,
        component: "SystemRestore",
    },
    {
        id: "anti-virus",
        name: "Anti-Virus",
        icon: controlPanelIcon,
        component: "AntiVirus",
    },
    {
        id: "instructions",
        name: instructionsFileName,
        icon: txtIcon,
        component: "Notepad",
        windowId: "instructions-notepad",
        windowTitle: `${instructionsFileName} - Notepad`,
        windowProps: {
            fileName: instructionsFileName,
            content: instructionsText,
            readOnly: true,
        },
    },
];
export function Desktop() {
    const { openWindow } = useWindows();
    const { setStartMenuOpen } = useSystem();
    const { getFileById } = useFileSystem();
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        iconId?: string;
    } | null>(null);
    const handleIconDoubleClick = (icon: DesktopIconConfig) => {
        const windowConfigs: Record<string, { width: number; height: number }> =
            {
                MyComputer: { width: 700, height: 500 },
                RecycleBin: { width: 600, height: 400 },
                InternetExplorer: { width: 900, height: 600 },
                Notepad: { width: 600, height: 400 },
                NotepadPlusPlus: { width: 800, height: 500 },
                CommandPrompt: { width: 680, height: 400 },
                SystemRestore: { width: 600, height: 450 },
            };

        const config = windowConfigs[icon.component] || {
            width: 600,
            height: 400,
        };
        openWindow({
            id: icon.windowId || `${icon.id}-${Date.now()}`,
            title: icon.windowTitle || icon.name,
            icon: icon.icon,
            component: icon.component,
            x: 100 + Math.random() * 100,
            y: 50 + Math.random() * 50,
            ...config,
            props: icon.windowProps,
        });
    };
    const handleDesktopClick = () => {
        setSelectedIcon(null);
        setStartMenuOpen(false);
        setContextMenu(null);
    };
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const getDesktopFile = (icon: DesktopIconConfig): FileItem => {
        if (icon.id === "my-computer") {
            const file = getFileById("my-computer");
            if (file) return file;
        }
        if (icon.id === "recycle-bin") {
            return {
                id: "recycle-bin",
                name: "Recycle Bin",
                type: "folder",
                icon: recycleBinIcon,
                path: "/recycle-bin",
                parentPath: "/",
                metadata: {
                    created: "03/12/2005 12:00 AM",
                    modified: "03/12/2005 12:00 AM",
                    size: "0 bytes",
                },
            };
        }
        if (icon.id === "instructions") {
            const file = getFileById("c-owner-desktop-instructions");
            if (file) return file;
        }
        return {
            id: `desktop-${icon.id}`,
            name: icon.name,
            type: "file",
            icon: icon.icon,
            path: `/desktop/${icon.name}`,
            parentPath: "/desktop",
            metadata: {
                created: "03/12/2005 12:00 AM",
                modified: "03/12/2005 12:00 AM",
                size: "1 KB",
            },
        };
    };

    const openProperties = (icon: DesktopIconConfig) => {
        const file = getDesktopFile(icon);
        openWindow({
            id: `properties-${icon.id}-${Date.now()}`,
            title: `${file.name} Properties`,
            icon: file.icon,
            component: "FileProperties",
            x: 220,
            y: 160,
            width: 420,
            height: 460,
            props: { file },
        });
    };
    return (
        <div
            className="relative h-full w-full overflow-hidden"
            onClick={handleDesktopClick}
            onContextMenu={handleContextMenu}
            style={{
                backgroundImage: `url(${xpBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Desktop Icons Grid */}
            <div className="grid grid-cols-1 gap-1 w-fit p-2">
                {desktopIcons.map((icon) => (
                    <DesktopIcon
                        key={icon.id}
                        name={icon.name}
                        icon={icon.icon}
                        isSelected={selectedIcon === icon.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIcon(icon.id);
                        }}
                        onDoubleClick={() => handleIconDoubleClick(icon)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedIcon(icon.id);
                            setContextMenu({
                                x: e.clientX,
                                y: e.clientY,
                                iconId: icon.id,
                            });
                        }}
                    />
                ))}
            </div>
            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    items={
                        contextMenu.iconId
                            ? [
                                  {
                                      label: "Open",
                                      onClick: () => {
                                          const icon = desktopIcons.find(
                                              (d) =>
                                                  d.id === contextMenu.iconId,
                                          );
                                          if (icon)
                                              handleIconDoubleClick(icon);
                                      },
                                  },
                                  { type: "separator" },
                                  {
                                      label: "Properties",
                                      onClick: () => {
                                          const icon = desktopIcons.find(
                                              (d) =>
                                                  d.id === contextMenu.iconId,
                                          );
                                          if (icon) openProperties(icon);
                                      },
                                  },
                              ]
                            : [
                        { label: "Refresh", onClick: () => {} },
                        { type: "separator" },
                        { label: "Paste", disabled: true },
                        { label: "Paste Shortcut", disabled: true },
                        { type: "separator" },
                        {
                            label: "New",
                            submenu: [
                                { label: "Folder" },
                                { label: "Shortcut" },
                                { label: "Text Document" },
                            ],
                        },
                        { type: "separator" },
                        { label: "Properties" },
                    ]}
                />
            )}
        </div>
    );
}
