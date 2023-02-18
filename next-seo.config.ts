import type {DefaultSeoProps} from "next-seo";

export const url =
    process.env.NODE_ENV === "production" ? `https://${process.env.NEXT_PUBLIC_URL}` : "http://localhost:3000";

const seo: DefaultSeoProps = {
    titleTemplate: "%s | Ayush Gupta",
    defaultTitle: "Ayush Gupta",
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
        siteName: "Ayush Gupta",
        images: [
            {
                url: `${url}/api/og`,
                width: 1200,
                height: 630,
                alt: "This is me. I mean it's not me but I could'nt find a better logo.",
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
