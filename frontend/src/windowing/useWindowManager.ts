import { useState } from "react";
import type { WindowState } from "./windowTypes";

export function useWindowManager() {
    const [windows, setWindows] = useState<WindowState[]>([]);

    const openWindow = (window: WindowState) => {
        // TODO: Implement window opening logic
        setWindows((prev) => [...prev, window]);
    };

    const closeWindow = (id: string) => {
        // TODO: Implement window closing logic
        setWindows((prev) => prev.filter((w) => w.id !== id));
    };

    const minimizeWindow = (id: string) => {
        // TODO: Implement window minimizing logic
    };

    const maximizeWindow = (id: string) => {
        // TODO: Implement window maximizing logic
    };

    return {
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
    };
}
