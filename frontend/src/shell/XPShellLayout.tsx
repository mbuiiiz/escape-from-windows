import React from "react";
import { Desktop } from "./Desktop";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "../windowing/WindowManager";

export function XPShellLayout() {
    return (
        <div className="xp-shell">
            <Desktop />
            <WindowManager />
            <Taskbar />
            {/* TODO: Implement complete XP shell layout */}
        </div>
    );
}
