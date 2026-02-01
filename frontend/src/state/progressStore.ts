import { create } from "zustand";
import type { ProgressState } from "../api/types";

interface GameProgressState extends ProgressState {
    updateProgress: (progress: Partial<ProgressState>) => void;
    addFlag: (flag: string) => void;
    addCompletedPuzzle: (puzzleId: string) => void;
    setCurrentStep: (step: number) => void;
    reset: () => void;
}

const initialState: ProgressState = {
    flags: [],
    currentStep: 0,
    completedPuzzles: [],
};

// TODO: Install zustand or use alternative state management
export const useProgressStore = create<GameProgressState>((set) => ({
    ...initialState,
    updateProgress: (progress: Partial<ProgressState>) =>
        set((state) => ({ ...state, ...progress })),
    addFlag: (flag: string) =>
        set((state) => ({ flags: [...state.flags, flag] })),
    addCompletedPuzzle: (puzzleId: string) =>
        set((state) => ({
            completedPuzzles: [...state.completedPuzzles, puzzleId],
        })),
    setCurrentStep: (step: number) => set({ currentStep: step }),
    reset: () => set(initialState),
}));
