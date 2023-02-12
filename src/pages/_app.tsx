import "@src/styles/globals.css";
import type {AppProps} from "next/app";
import {ThemeProvider} from "next-themes";
import {ThemeButton} from "@src/components/fragments/ThemeButton";
import {Text} from "@src/components/ui/Text";
import {Poppins} from "@next/font/google";
import {useRouter} from "next/router";

const font = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({Component, pageProps}: AppProps) {
    const router = useRouter();

    return (
        <ThemeProvider defaultTheme="light">
            <main
                className={`relative flex min-h-screen ${font.className} w-full justify-center items-center p-10 bg-[#E8E8E8] dark:bg-black`}>
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
                <Component {...pageProps} />
            </main>
        </ThemeProvider>
    );
}
