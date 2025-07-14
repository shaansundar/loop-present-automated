import { forceHttpForLocalIPs } from "@/utils/api-utils";
import { apiUrl } from "@/env";
import type { GetAttendanceStatusRequest, GetAttendanceStatusResponse } from "@/types/attendance-type";

export async function getAttendance(request: GetAttendanceStatusRequest, authToken: string): Promise<GetAttendanceStatusResponse | null> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/attendance`, {
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
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data as GetAttendanceStatusResponse;

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        console.error('An unknown error occurred');
        return null;
    }
}