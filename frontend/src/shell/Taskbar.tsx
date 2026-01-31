import React from "react";
import { StartMenu } from "./StartMenu";

export function Taskbar() {
    return (
        <div className="taskbar">
            <StartMenu />
            <div className="taskbar-buttons">
                {/* TODO: Implement running application buttons */}
            </div>
            <div className="system-tray">
                {/* TODO: Implement system tray */}
            </div>
        </div>
    );
}
