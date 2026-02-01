import React, { useState } from "react";
import { useWindows } from "@/contexts/WindowContext";
import { useSystem } from "@/contexts/SystemContext";
import { DesktopIcon } from "@/components/xp/DesktopIcon";
import { ContextMenu } from "@/components/xp/ContextMenu";

import myComputerIcon from "@/assets/my-computer-icon.webp";
import recycleBinIcon from "@/assets/bin-icon.webp";
import ieIcon from "@/assets/explorer-icon.png";
import notepadIcon from "@/assets/notepad-icon.webp";
import notepadppIcon from "@/assets/node++-icon.png";
import cmdIcon from "@/assets/command-prompt-icon.png";
import systemRestoreIcon from "@/assets/system-restore-icon.jpeg";
import xpBackground from "@/assets/xp-background.webp";

const desktopIcons = [
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
];
export function Desktop() {
    const { openWindow } = useWindows();
    const { setStartMenuOpen } = useSystem();
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const handleIconDoubleClick = (icon: (typeof desktopIcons)[0]) => {
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
            id: `${icon.id}-${Date.now()}`,
            title: icon.name,
            icon: icon.icon,
            component: icon.component,
            x: 100 + Math.random() * 100,
            y: 50 + Math.random() * 50,
            ...config,
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
    return (
        <div
            className="flex-1 p-2 relative overflow-hidden"
            onClick={handleDesktopClick}
            onContextMenu={handleContextMenu}
            style={{
                backgroundImage: `url(${xpBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Desktop Icons Grid */}
            <div className="grid grid-cols-1 gap-1 w-fit">
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
                    />
                ))}
            </div>
            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    items={[
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
