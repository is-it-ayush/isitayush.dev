import Link from "next/link";
import {Text} from "@src/components/ui/Text";
import {useEffect} from "react";
import {motion} from "framer-motion";
import {pageAnim} from "@src/lib/utils";

export default function Landing() {
    useEffect(() => {
        const e = process.env.NEXT_PUBLIC_SOMETHING;
        const m = process.env.NEXT_PUBLIC_SOMETHING_ELSE;
        const p = Math.random();
        if (p > 0.98) {
            console.log(e);
            console.log(m);
        }
    }, []);

    return (
        <motion.div
            initial={pageAnim.initial}
            animate={pageAnim.animate}
            exit={pageAnim.initial}
            transition={pageAnim.transition}
            className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-start lg:items-center justify-center">
            <div className="flex flex-col space-y-2">
                <Text size={"sm"} weight={"light"}>
                    Hi, I&apos;m
                </Text>
                <Text
                    size={"5xl"}
                    weight={"light"}
                    className="border-2 border-transparent text-white bg-black px-3 py-3 dark:bg-white dark:text-black">
                    a y u s h.
                </Text>
                <Text size={"sm"} weight={"light"}>
                    I write code for a living.
                </Text>
            </div>
            <div className="flex flex-col justify-center">
                <ul className="flex flex-col space-y-2">
                    <li>
                        <Text size={"base"} weight={"light"} ratio={1}>
                            <Link href="/about" className="underline italic">
                                /about
                            </Link>
                        </Text>
                    </li>
                    <li>
                        <Text size={"base"} weight={"light"} ratio={1}>
                            <Link href="/projects" className="underline italic">
                                /projects
                            </Link>
                        </Text>
                    </li>
                    <li>
                        <Text size={"base"} weight={"light"} ratio={1}>
                            <Link href="/blog" className="underline italic">
                                /blog
                            </Link>
                        </Text>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
}
