import { forceHttpForLocalIPs } from "@/utils/api-utils";
import { apiUrl } from "@/env";
import type { SectionInfoRequest, SectionInfoResponse } from "@/types/class-profile";

export async function getSections(request: SectionInfoRequest, authToken: string): Promise<SectionInfoResponse> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/sections`, {
            method: 'POST',
            body: JSON.stringify(request),
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
        return data as SectionInfoResponse;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
}