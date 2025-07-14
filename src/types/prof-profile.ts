export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string;
        role: string;
        created_at: string;
        updated_at: string;
    }
}

export interface ProfProfile {
    id: number;
    name: string;
    email: string;
    password: string;
    accessToken?: string;
}