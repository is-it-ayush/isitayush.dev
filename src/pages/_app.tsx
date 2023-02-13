import "@src/styles/globals.css";
import type {AppProps} from "next/app";
import {ThemeProvider} from "next-themes";
import {ThemeButton} from "@src/components/fragments/ThemeButton";
import {Text} from "@src/components/ui/Text";
import {Poppins} from "@next/font/google";
import {useRouter} from "next/router";
import Head from "next/head";
import {AnimatePresence} from "framer-motion";
import {DefaultSeo} from "next-seo";
import seo from "@src/../next-seo.config";
import Script from "next/script";

const font = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();

    return (
        <ThemeProvider defaultTheme="light">
            <Head>
                <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
                <meta name="theme-color" content="#000000" />
            </Head>
            {process.env.NODE_ENV === "production" && (
                <Script
                    src="https://analytics.umami.is/script.js"
                    data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
                    async
                    defer
                />
            )}
            <DefaultSeo {...seo} />
            <main
                className={`relative flex min-h-screen ${font.className} w-full justify-center p-10 bg-[#E8E8E8] dark:bg-black`}>
                <div className="fixed left-[50%] top-5 z-[5] flex w-[90%] -translate-x-[50%] flex-row items-center justify-between bg-[#E8E8E8] drop-shadow-lg backdrop-blur-[5px] dark:bg-black/5 bg-opacity-20">
                    <div className="flex flex-row space-x-2">
                        <div className="border-2 border-black dark:border-white"></div>
                        <Text size={"sm"} weight={"light"}>
                            ayush.
                        </Text>
                    </div>
                    {router.pathname !== "/" && (
                        <button
                            className="flex flex-row"
                            onClick={() => {
                                router.back();
                            }}>
                            <Text size={"sm"} weight={"light"}>
                                back.
                            </Text>
                        </button>
                    )}
                    <ThemeButton />
                </div>
                <AnimatePresence>
                    <Component {...pageProps} />
                </AnimatePresence>
            </main>
        </ThemeProvider>
    );
}
