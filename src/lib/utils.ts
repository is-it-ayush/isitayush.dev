import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function getRecentlyPlayed() {
    const {access_token} = await getAccessToken();

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

    if (!client_id || !client_secret || !refresh_token) {
        console.error(
            "Spotify/Error: The environment variables, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN, are not set."
        );
        throw new DOMException("Spotify/Error: I really had a nice playlist but something went wrong.");
    }

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

// unused, but I'll keep it here for now
export function fetchNamesWithLongerArrangedAtLast<T extends {name: string}>(arr: T[], length: number) {
    const longer = arr.filter(item => item.name.length > length);
    const shorter = arr.filter(item => item.name.length <= length);

    return [...shorter, ...longer];
}

export const stack = {
    trpc: {
        name: "tRPC",
        url: "https://trpc.io/",
    },
    nextjs: {
        name: "Next.js",
        url: "https://nextjs.org/",
    },
    typescript: {
        name: "TypeScript",
        url: "https://www.typescriptlang.org/",
    },
    tailwind: {
        name: "Tailwind CSS",
        url: "https://tailwindcss.com/",
    },
    mongodb: {
        name: "MongoDB",
        url: "https://www.mongodb.com/",
    },
    express: {
        name: "Express",
        url: "https://expressjs.com/",
    },
    react: {
        name: "React",
        url: "https://reactjs.org/",
    },
    prisma: {
        name: "Prisma",
        url: "https://www.prisma.io/",
    },
    threejs: {
        name: "Three.js",
        url: "https://threejs.org/",
    },
    django: {
        name: "Django",
        url: "https://www.djangoproject.com/",
    },
    python: {
        name: "Python",
        url: "https://www.python.org/",
    },
    javascript: {
        name: "JavaScript",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    glsl: {
        name: "GLSL",
        url: "https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)",
    },
};

export type Technologies = typeof stack;

export const pageAnim = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
    transition: {
        duration: 0.3,
    },
};
