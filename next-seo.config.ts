import type {DefaultSeoProps} from "next-seo";

export const url =
    process.env.NODE_ENV === "production" ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000";

const seo: DefaultSeoProps = {
    titleTemplate: "%s | Ayush Gupta",
    defaultTitle: "isitayush",
    description: "A small corner on the internet which I call mine.",
    canonical: "https://isitayush.dev",
    additionalMetaTags: [
        {
            name: "keywords",
            content: "ayush, ayush gupta, isitayush, blogs, projects, isitayush.dev",
        },
    ],
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: url,
        siteName: "isitayush",
        images: [
            {
                url: `${url}/api/og`,
                width: 1200,
                height: 630,
                alt: "isitayush",
            },
        ],
    },
    twitter: {
        handle: "@is_it_ayush",
        site: "@is_it_ayush",
        cardType: "summary_large_image",
    },
};

export default seo;
