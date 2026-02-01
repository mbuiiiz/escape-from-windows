import React, { useState } from "react";

export function StartMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="start-menu">
            <button className="start-button" onClick={() => setIsOpen(!isOpen)}>
                Start
            </button>
            {isOpen && (
                <div className="start-menu-popup">
                    {/* TODO: Implement start menu items */}
                </div>
            )}
        </div>
    );
}
