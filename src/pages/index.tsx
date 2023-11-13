import Link from "next/link";
import { Text } from "@src/components/ui/Text";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { generateRobotsTxt, generateSitemap, pageAnim } from "@src/lib/utils";
import { allEntries } from "@contentlayer/generated";

export default function Landing() {
  useEffect(() => {
    const e = process.env.NEXT_PUBLIC_SOMETHING;
    const m = process.env.NEXT_PUBLIC_SOMETHING_ELSE;
    if (e === undefined || m === undefined) return;
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
          hi, I&apos;m
        </Text>
        <Text
          size={"5xl"}
          weight={"light"}
          className="border-2 border-transparent text-white bg-black px-3 py-3 dark:bg-white dark:text-black">
          a y u s h.
        </Text>
        <Text size={"sm"} weight={"light"}>
          i write code for a living.
        </Text>
      </div>
    </motion.div>
  );
}

export async function getStaticProps() {
  await generateSitemap(allEntries);
  await generateRobotsTxt();

  return {
    props: {
      revalidate: 60 * 60 * 6,
    },
  };
}
