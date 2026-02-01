import { create } from "zustand";

interface SessionState {
    sessionId: string | null;
    playerName: string | null;
    isLoggedIn: boolean;
    setSession: (sessionId: string, playerName?: string) => void;
    clearSession: () => void;
}

// TODO: Install zustand or use alternative state management
export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,
    playerName: null,
    isLoggedIn: false,
    setSession: (sessionId: string, playerName?: string) =>
        set({ sessionId, playerName, isLoggedIn: true }),
    clearSession: () =>
        set({ sessionId: null, playerName: null, isLoggedIn: false }),
}));
