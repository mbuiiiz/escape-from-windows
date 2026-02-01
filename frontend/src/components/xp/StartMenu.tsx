import React from "react";
import { useWindows } from "@/contexts/WindowContext";
import { useSystem } from "@/contexts/SystemContext";

import ieIcon from "@/assets/explorer-icon.png";
import outlookIcon from "@/assets/outlook-icon.png";
import notepadIcon from "@/assets/notepad-icon.webp";
import notepadppIcon from "@/assets/node++-icon.png";
import cmdIcon from "@/assets/command-prompt-icon.png";
import allProgramsIcon from "@/assets/all-program-icon.png";
import folderIcon from "@/assets/folder-icon.jpg";
import myComputerIcon from "@/assets/my-computer-icon.webp";
import controlPanelIcon from "@/assets/control-panel-icon.webp";
import startIcon from "@/assets/start-icon.png";

const leftMenuItems = [
    {
        name: "Internet Explorer",
        icon: ieIcon,
        component: "InternetExplorer",
        bold: true,
    },
    {
        name: "Outlook Express",
        icon: outlookIcon,
        component: "Notepad",
        bold: true,
    },
    { type: "separator" },
    { name: "Notepad", icon: notepadIcon, component: "Notepad" },
    { name: "Notepad++", icon: notepadppIcon, component: "NotepadPlusPlus" },
    { name: "Command Prompt", icon: cmdIcon, component: "CommandPrompt" },
    { name: "Anti-Virus", icon: controlPanelIcon, component: "AntiVirus" },
    { type: "separator" },
    { name: "All Programs", icon: allProgramsIcon, hasArrow: true },
];
const rightMenuItems = [
    { name: "My Documents", icon: folderIcon },
    { name: "My Pictures", icon: folderIcon },
    { name: "My Music", icon: folderIcon },
    { name: "My Computer", icon: myComputerIcon, component: "MyComputer" },
    { type: "separator" },
    { name: "Control Panel", icon: controlPanelIcon },
    { name: "Set Program Access", icon: allProgramsIcon },
    { type: "separator" },
    { name: "Help and Support", icon: folderIcon },
    { name: "Search", icon: folderIcon },
];
export function StartMenu() {
    const { openWindow } = useWindows();
    const { setStartMenuOpen } = useSystem();
    const handleItemClick = (item: (typeof leftMenuItems)[0]) => {
        if ("component" in item && item.component) {
            const windowConfigs: Record<
                string,
                { width: number; height: number }
            > = {
                MyComputer: { width: 700, height: 500 },
                InternetExplorer: { width: 900, height: 600 },
                Notepad: { width: 600, height: 400 },
                NotepadPlusPlus: { width: 800, height: 500 },
                CommandPrompt: { width: 680, height: 400 },
                AntiVirus: { width: 320, height: 120 },
            };
            const config = windowConfigs[item.component] || {
                width: 600,
                height: 400,
            };
            openWindow({
                id: `${item.component.toLowerCase()}-${Date.now()}`,
                title: item.name,
                icon: item.icon!,
                component: item.component,
                x: 100 + Math.random() * 100,
                y: 50 + Math.random() * 50,
                ...config,
            });
        }
        setStartMenuOpen(false);
    };
    return (
        <div className="xp-start-menu" onClick={(e) => e.stopPropagation()}>
            {/* Header with user */}
            <div className="xp-start-menu-header">
                <div className="xp-start-menu-avatar">
                    <img
                        src={folderIcon}
                        alt="User"
                        className="w-full h-full"
                    />
                </div>
                <span className="xp-start-menu-username">User</span>
            </div>
            {/* Content */}
            <div className="xp-start-menu-content">
                {/* Left Column */}
                <div className="xp-start-menu-left">
                    {leftMenuItems.map((item, i) =>
                        item.type === "separator" ? (
                            <div
                                key={i}
                                className="h-px bg-gray-200 my-2 mx-2"
                            />
                        ) : (
                            <div
                                key={i}
                                className="xp-start-menu-item"
                                onClick={() => handleItemClick(item)}
                            >
                                <img src={item.icon} alt="" />
                                <span className={item.bold ? "font-bold" : ""}>
                                    {item.name}
                                </span>
                            </div>
                        ),
                    )}
                </div>
                {/* Right Column */}
                <div className="xp-start-menu-right">
                    {rightMenuItems.map((item, i) =>
                        item.type === "separator" ? (
                            <div
                                key={i}
                                className="h-px bg-blue-200 my-2 mx-2"
                            />
                        ) : (
                            <div
                                key={i}
                                className="xp-start-menu-item"
                                onClick={() =>
                                    handleItemClick(
                                        item as (typeof leftMenuItems)[0],
                                    )
                                }
                            >
                                <img
                                    src={item.icon}
                                    alt=""
                                    className="w-6 h-6"
                                />
                                <span>{item.name}</span>
                            </div>
                        ),
                    )}
                </div>
            </div>
            {/* Footer */}
            <div className="xp-start-menu-footer">
                <div className="xp-start-menu-footer-btn">
                    <img src={startIcon} alt="" className="w-5 h-5" />
                    <span>Turn Off Computer</span>
                </div>
            </div>
        </div>
    );
}
