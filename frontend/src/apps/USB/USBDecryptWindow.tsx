import React, { useState } from "react";
import { Window } from "../../windowing/Window";

export function USBDecryptWindow() {
    const [password, setPassword] = useState("");

    return (
        <Window title="USB Drive Decryption">
            <div className="usb-decrypt">
                <p>Enter password to decrypt USB drive:</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button>Decrypt</button>
                {/* TODO: Implement USB decryption logic */}
            </div>
        </Window>
    );
}
