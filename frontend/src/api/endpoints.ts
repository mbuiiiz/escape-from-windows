export const endpoints = {
    // Session endpoints
    createSession: "/api/sessions",
    getSession: (id: string) => `/api/sessions/${id}`,

    // Action endpoints
    submitAction: "/api/actions",

    // Puzzle endpoints
    attemptPuzzle: "/api/puzzles/attempt",

    // TODO: Add more endpoints as needed
} as const;
