// Get domain from Url
export function domainFromUrl(url: string) {
    try {
        const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
        return u.hostname.replace(/^www\./i, "");
    } catch {
        return url;
    }
}


// Get metadata from Url
export type UrlMetaData = {
    title?: string
    description?: string
    image?: string
}

export async function metaDataFromUrl(url: string): Promise<UrlMetaData | null> {
    try {
        const response = await fetch(url)
        const html = await response.text()

        const getMeta = (property: string) => {
            const regex = new RegExp(
                `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
                "i"
            )
            return html.match(regex)?.[1]
        }

        const getTitle = () => {
            const match = html.match(/<title>([^<]+)<\/title>/i)
            return match?.[1]
        }

        return {
            title: getMeta("og:title") || getTitle(),
            description:
                getMeta("og:description") || getMeta("description"),
            image: getMeta("og:image"),
        }
    } catch (error) {
        console.log("Oh no", error)
        return null
    }
}
