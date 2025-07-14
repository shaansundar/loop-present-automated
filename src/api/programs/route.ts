import { forceHttpForLocalIPs } from "@/utils/api-utils";
import { apiUrl } from "@/env";
import type { ProgramInfoResponse } from "@/types/class-profile";

export async function getPrograms(authToken: string): Promise<ProgramInfoResponse> {
    try {
        const url = forceHttpForLocalIPs(apiUrl);
        const response = await fetch(`${url}/programs`, {
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
        return data as ProgramInfoResponse;

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
}

// const response = await fetch(`${env.apiUrl}/programs`,{
//     referrerPolicy: "unsafe-url",
// });
// if (isHealthCheck) {
//     if (response.status > 400) {
//         return false;
//     } else {
//         return true;
//     }
// }
// const data = await response.json();
// return data;