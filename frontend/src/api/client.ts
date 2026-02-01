const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        let response: Response;
        try {
            response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Network error while calling API";
            throw new Error(`${msg} (${url})`);
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText} (${url})`);
        }

        return response.json();
    }
}

export const apiClient = new ApiClient();
