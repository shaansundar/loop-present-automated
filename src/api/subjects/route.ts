import { forceHttpForLocalIPs } from "@/utils/api-utils";
import { apiUrl } from "@/env";
import type { SubjectInfoRequest, SubjectInfoResponse } from "@/types/class-profile";

export async function getSubjects(request: SubjectInfoRequest, authToken: string): Promise<SubjectInfoResponse> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/subjects`, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${authToken}`
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as SubjectInfoResponse;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
}