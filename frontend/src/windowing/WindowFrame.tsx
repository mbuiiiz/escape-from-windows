import React from "react";
import type { WindowProps } from "./windowTypes";

export function WindowFrame({ title, children, onClose }: WindowProps) {
    return (
        <div className="window-frame">
            <div className="title-bar">
                <span className="title">{title}</span>
                <div className="window-controls">
                    <button onClick={onClose}>×</button>
                </div>
            </div>
            <div className="window-content">{children}</div>
            {/* TODO: Implement window frame styling and controls */}
        </div>
    );
}
