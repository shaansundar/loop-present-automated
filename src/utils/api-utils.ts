// Utility function to ensure HTTP protocol for specific IP addresses
export const ensureHttpProtocol = (apiUrl: string): string => {
    // Force HTTP for the specific IP address
    if (apiUrl.includes('10.10.1.35')) {
        return apiUrl.replace(/^https:/, 'http:');
    }
    return apiUrl;
};

// Alternative more general approach
export const forceHttpForLocalIPs = (apiUrl: string): string => {
    // Check if it's a local IP address (10.x.x.x, 192.168.x.x, 172.16.x.x-172.31.x.x)
    const localIPRegex = /(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})/;
    
    if (localIPRegex.test(apiUrl)) {
        return apiUrl.replace(/^https:/, 'http:');
    }
    return apiUrl;
}; 