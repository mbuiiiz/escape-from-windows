import React from "react";
import { useWindowManager } from "./useWindowManager";

export function WindowManager() {
    const { windows } = useWindowManager();

    return (
        <div className="window-manager">
            {windows.map((window) => (
                <div key={window.id} className="window-container">
                    {window.component}
                </div>
            ))}
            {/* TODO: Implement window management */}
        </div>
    );
}
