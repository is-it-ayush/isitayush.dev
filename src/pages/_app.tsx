import "@src/styles/globals.css";
import type {AppProps} from "next/app";
import {ThemeProvider} from "next-themes";
import {ThemeButton} from "@src/components/fragments/ThemeButton";
import {Text} from "@src/components/ui/Text";
import {Poppins} from "@next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function App({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider defaultTheme="light">
            <main
                className={`relative flex min-h-screen ${font.className} w-full justify-center items-center p-10 bg-[#E8E8E8] dark:bg-black`}>
                <div className="fixed left-[50%] top-5 z-[5] flex w-full px-10 -translate-x-[50%] flex-row items-center justify-between">
                    <div className="flex flex-row space-x-2">
                        <div className="border-2 border-black dark:border-white"></div>
                        <Text size={"sm"} weight={"light"}>
                            ayush.
                        </Text>
                    </div>
                    <ThemeButton />
                </div>
                <Component {...pageProps} />
            </main>
        </ThemeProvider>
    );
}
