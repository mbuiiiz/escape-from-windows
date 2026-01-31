// Session types
export interface CreateSessionRequest {
    playerName?: string;
}

export interface CreateSessionResponse {
    sessionId: string;
    createdAt: string;
}

export interface GetSessionResponse {
    sessionId: string;
    progress: ProgressState;
    createdAt: string;
}

// Action types
export interface ActionRequest {
    sessionId: string;
    actionType: string;
    data: any;
}

export interface ActionResponse {
    success: boolean;
    message?: string;
    data?: any;
}

// Puzzle types
export interface PuzzleAttemptRequest {
    sessionId: string;
    puzzleId: string;
    answer: string;
}

export interface PuzzleAttemptResponse {
    correct: boolean;
    message?: string;
    flagUnlocked?: boolean;
}

// Progress types
export interface ProgressState {
    flags: string[];
    currentStep: number;
    completedPuzzles: string[];
}

// TODO: Add more types as needed
