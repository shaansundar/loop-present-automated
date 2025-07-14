import type { PostAttendanceRequest, PostAttendanceResponse } from "@/types/attendance-type";
import { apiUrl } from "@/env";
import { forceHttpForLocalIPs } from "@/utils/api-utils";

export async function saveAttendance(request: PostAttendanceRequest, authToken: string): Promise<PostAttendanceResponse> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/saveAttendance`, {
            method: 'POST',
            body: JSON.stringify(request),
            referrerPolicy: "unsafe-url",
            cache: 'no-store',
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
        return data as PostAttendanceResponse;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
}