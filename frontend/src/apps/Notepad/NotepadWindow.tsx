import React, { useState } from "react";
import { Window } from "../../windowing/Window";

export function NotepadWindow() {
    const [content, setContent] = useState("");

    return (
        <Window title="Notepad">
            <div className="notepad-content">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your notes here..."
                />
            </div>
            {/* TODO: Implement Notepad functionality */}
        </Window>
    );
}
