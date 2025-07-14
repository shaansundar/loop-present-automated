import { forceHttpForLocalIPs } from "@/utils/api-utils";
import type { LoginRequest, LoginResponse } from "@/types/prof-profile";
import { apiUrl } from "@/env";

export async function login(request: LoginRequest): Promise<LoginResponse | false> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            referrerPolicy: 'unsafe-url',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            }
        });

        if (!response.ok) {
            console.log("WARNING ~ login ~ response failed for:", request.email, request.password);
            return false;
        }

        const data = await response.json();
        return data as LoginResponse;

    } catch (error) {
        if (error instanceof Error) {
            console.log("ERROR ~ login ~ error:", error.message);
            return false;
        }
        console.log("ERROR ~ login ~ error:", error);
        return false;
    }
}