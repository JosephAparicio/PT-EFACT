export interface LoginRequest {
    username: string;
    password: string;
    grant_type: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
}
