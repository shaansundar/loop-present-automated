import { forceHttpForLocalIPs } from "@/utils/api-utils";
import type { TermsResponse } from "@/types/class-profile";
import { apiUrl } from "@/env";

export async function getTerms(authToken: string): Promise<TermsResponse> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/terms`, {
            referrerPolicy: "unsafe-url",
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as TermsResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
}