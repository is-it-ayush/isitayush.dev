import { Entry } from "@contentlayer/generated";
import { ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import fs from "fs";
import { NextApiRequest } from "next";
import { url } from "next-seo.config";
import RSS from "rss";
import { twMerge } from "tailwind-merge";

// export async function getRecentlyPlayed() {
//   const { access_token } = await getAccessToken();
//
//   const response = await fetch(
//     "https://api.spotify.com/v1/me/player/recently-played",
//     {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     }
//   );
//
//   return response.json();
// }
//
// export async function getAccessToken() {
//   const client_id = process.env.SPOTIFY_CLIENT_ID;
//   const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
//   const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
//
//   if (!client_id || !client_secret || !refresh_token) {
//     console.error(
//       "Spotify/Error: The environment variables, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN, are not set."
//     );
//     throw new DOMException(
//       "Spotify/Error: I really had a nice playlist but something went wrong."
//     );
//   }
//
//   const response = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: `Basic ${Buffer.from(
//         `${client_id}:${client_secret}`
//       ).toString("base64")}`,
//     },
//     body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
//   });
//
//   return response.json();
// }
//
// // unused, but I'll keep it here for now
// export function fetchNamesWithLongerArrangedAtLast<T extends { name: string }>(
//   arr: T[],
//   length: number
// ) {
//   const longer = arr.filter((item) => item.name.length > length);
//   const shorter = arr.filter((item) => item.name.length <= length);
//
//   return [...shorter, ...longer];
// }

// helper to dedupe combined classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// technology name --> technology url map
// used in the projects section
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
  radix: {
    name: "Radix UI",
    url: "https://www.radix-ui.com/",
  },
  shadcn: {
    name: "UI Shadcn",
    url: "https://ui.shadcn.com/",
  },
  p5: {
    name: "p5.js",
    url: "https://p5js.org/",
  },
  rust: {
    name: "Rust",
    url: "https://www.rust-lang.org/",
  },
};
export type Technologies = typeof stack;

// nextjs "pages" router does not naturally support sitemap, rss feed & sitemap generation.
// to workaround, we call this function somewhere like getStaticProps with revalidation
// so it runs during build time
// generate rss feed
export async function generateRSSFeed(entries: Entry[]) {
  if (process.env.NODE_ENV !== "production")
    return console.log(
      "RSS/Info: Skipping RSS feed generation in development mode."
    );

  const feed = new RSS({
    title: "Entries | Ayush Gupta",
    description: "A collection of my entries on my blog.",
    feed_url: `${url}/feed.xml`,
    site_url: url,
    image_url: `${url}/favicon-96x96.png`,
    pubDate: new Date().toUTCString(),
    copyright: `© ${new Date().getFullYear()} Ayush Gupta`,
  });

  entries.forEach((entry) => {
    feed.item({
      title: entry.title,
      description: entry.summary,
      url: `${url}/blog/${entry._raw.flattenedPath
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      date: entry.publishedAt,
    });
  });

  try {
    fs.writeFileSync("./public/feed.xml", feed.xml({ indent: true }));
    console.log(
      `RSS/Success: Successfully generated RSS feed on ${format(
        new Date(),
        "dd/MM/yyyy HH:mm:ss"
      )}.`
    );
  } catch (e) {
    console.error("RSS/Error: Error while writing RSS feed to file: ", e);
  }
}
// generate sitemap
export async function generateSitemap(entries: Entry[]) {
  if (process.env.NODE_ENV !== "production")
    return console.log(
      "Sitemap/Info: Skipping sitemap generation in development mode."
    );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${url}</loc>
            <lastmod>${format(new Date(), "yyyy-MM-dd")}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${url}/about</loc>
            <lastmod>${format(new Date(), "yyyy-MM-dd")}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>${url}/projects</loc>
            <lastmod>${format(new Date(), "yyyy-MM-dd")}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>${url}/blog</loc>
            <lastmod>${format(new Date(), "yyyy-MM-dd")}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        ${entries
      .map(
        (entry) => `
            <url>
                <loc>${url}/blog/${entry._raw.flattenedPath
            .toLowerCase()
            .replace(/\s+/g, "-")}</loc>
                <lastmod>${format(
              new Date(entry.publishedAt),
              "yyyy-MM-dd"
            )}</lastmod>
                <changefreq>hourly</changefreq>
                <priority>0.8</priority>
            </url>
        `
      )
      .join("")}
    </urlset>`;

  try {
    fs.writeFileSync("./public/sitemap.xml", sitemap);
    console.log(
      `Sitemap/Success: Successfully generated sitemap on ${format(
        new Date(),
        "dd/MM/yyyy HH:mm:ss"
      )}.`
    );
  } catch (e) {
    console.error("Sitemap/Error: Error while writing sitemap to file: ", e);
  }
}
export async function generateRobotsTxt() {
  if (process.env.NODE_ENV !== "production")
    return console.log(
      "Robots.txt/Info: Skipping robots.txt generation in development mode."
    );

  const robotsTxt = `User-agent: *
    Allow: /
    Sitemap: ${url}/sitemap.xml
    `;

  try {
    fs.writeFileSync("./public/robots.txt", robotsTxt);
    console.log(
      `Robots.txt/Success: Successfully generated robots.txt on ${format(
        new Date(),
        "dd/MM/yyyy HH:mm:ss"
      )}.`
    );
  } catch (e) {
    console.error(
      "Robots.txt/Error: Error while writing robots.txt to file: ",
      e
    );
  }
}

export function k() {
  const e = process.env.NEXT_PUBLIC_SOMETHING;
  const m = process.env.NEXT_PUBLIC_SOMETHING_ELSE;
  if (e === undefined || m === undefined) return;
  const p = Math.random();
  if (p > 0.98) {
    console.log(e);
    console.log(m);
  }
}

/**
 * Extract Client IP from Headers.
 * @param {NextApiRequest} req - The request object
 */
type UserInfo = {
  ip: string | null;
  host: string | null;
};
export const getClientInfo = (req: NextApiRequest) => {
  let userInfo: UserInfo = { ip: null, host: null };
  if (req.headers["forwarded"]) {
    const header = req.headers.forwarded as string;
    userInfo = {
      ip: header.split(";")[0]?.split("=")[1] || null,
      host: header.split(";")[1]?.split("=")[1] || null,
    };
  } else if (req.headers["x-forwarded-for"]) {
    userInfo = {
      ip: (req.headers["x-forwarded-for"] as string).split(",")[0],
      host: req.headers["x-forwarded-host"] as string,
    };
  }

  return userInfo;
};


// generic functions to get and post data to api layer.
// used as fetchers for react-query
export const getData = <TResponse,>(url: string): Promise<TResponse> =>
  fetch(url).then((res) => res.json() as TResponse);
export const postData = <TData, TResponse>(
  url: string,
  data: TData
): Promise<TResponse> =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json() as TResponse);

export function getFormattedTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
