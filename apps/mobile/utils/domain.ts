export function domainFromUrl(url: string) {
    try {
        const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
        return u.hostname.replace(/^www\./i, "");
    } catch {
        return url;
    }
}