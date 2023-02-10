import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function getRecentlyPlayed() {
    const {access_token} = await getAccessToken();
    if (!access_token) {
        throw new DOMException("Hmmm, So we can't even get my songs anymore. :<");
    }
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return response.json();
}

export async function getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
        },
        body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
    });

    return response.json();
}

export function fetchNamesWithLongerArrangedAtLast<T extends {name: string}>(arr: T[], length: number) {
    const longer = arr.filter(item => item.name.length > length);
    const shorter = arr.filter(item => item.name.length <= length);

    return [...shorter, ...longer];
}
