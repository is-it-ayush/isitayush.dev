import { Poppins } from "next/font/google";
import seo from "@src/../next-seo.config";
import { ThemeButton } from "@src/components/fragments/ThemeButton";
import { Text } from "@src/components/ui/Text";
import "@src/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useRef } from "react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const previousRoute = usePreviousRoute();

  return (
    <ThemeProvider defaultTheme="light">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
      <SpeedInsights />
      <main
        className={`relative flex min-h-screen ${font.className} w-full justify-center p-10 bg-[#E8E8E8] dark:bg-black`}>
        <div className="fixed left-[50%] top-5 z-[5] flex w-[90%] -translate-x-[50%] flex-row items-center justify-between bg-[#E8E8E8] drop-shadow-lg backdrop-blur-[5px] dark:bg-black/5 bg-opacity-20">
          <div className="flex flex-row space-x-2">
            <div className="border-2 border-black dark:border-white"></div>
            <Link href="/" className="text-sm font-light">
              ayush.
            </Link>
          </div>
          {router.pathname !== "/" && previousRoute && (
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
        <div className="fixed left-[50%] bottom-5 z-[5] flex w-[90%] -translate-x-[50%] flex-row items-center justify-between bg-[#E8E8E8] drop-shadow-lg backdrop-blur-[5px] dark:bg-black/5 bg-opacity-20">
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row gap-2">
              <div className="border-2 border-black dark:border-white"></div>
              <Link href="/about" className="underline text-sm font-light">
                /about
              </Link>
              <Link href="/projects" className="underline text-sm font-light">
                /projects
              </Link>
              <Link href="/blog" className="underline text-sm font-light">
                /blog
              </Link>
            </div>
            <div className="flex flex-row gap-2 w-fit">
              <Text size="sm" weight="light">
                09DWLPG6152H1Z9
              </Text>
              <Text size="sm" weight="semibold" className="hidden md:flex">
                Tax ID
              </Text>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

// https://github.com/vercel/next.js/discussions/36723#discussioncomment-2698954
export const usePreviousRoute = () => {
  const router = useRouter();

  const ref = useRef<string | null>(null);

  router.events?.on("routeChangeStart", () => {
    ref.current = router.asPath;
  });

  return ref.current;
};
