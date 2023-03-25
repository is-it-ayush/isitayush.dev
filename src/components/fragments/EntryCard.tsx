import type {Entry} from "@contentlayer/generated";
import {Container} from "@src/components/ui/Container";
import {Tag} from "@src/components/ui/Tag";
import {Text} from "@src/components/ui/Text";
import {format, parseISO} from "date-fns";
import {motion} from "framer-motion";
import Link from "next/link";
import {ReactNode} from "react";
import Highlighter from "react-highlight-words";
import readingTime from "reading-time";

export const variants = {
  hidden: {opacity: 0, y: 10},
  visible: {opacity: 1, y: 0},
  tranistion: {duration: 0.2},
};

export function EntryCard({
  entry,
  search,
  children,
}: {
  entry: Entry;
  search: string;
  children?: ReactNode;
}) {
  const searchTerms = search.toLowerCase().split(" ");
  return (
    <>
      <motion.div
        className="max-w-[300px] lg:max-w-[400px]"
        initial={variants.hidden}
        animate={variants.visible}
        exit={variants.hidden}
        transition={variants.tranistion}>
        <Link href={entry.slug} prefetch={true}>
          <Container className="space-y-2">
            <div className="flex flex-col justify-between space-y-2">
              <Text size="lg" weight="semibold" ratio={1}>
                <Highlighter
                  highlightClassName="bg-black text-white dark:bg-white dark:text-black"
                  searchWords={searchTerms}
                  autoEscape={true}
                  textToHighlight={entry.title}
                />
              </Text>
              <Text
                size="sm"
                weight="light"
                className="text-gray-500"
                ratio={1}>
                {format(parseISO(entry.publishedAt), "LLLL d, yyyy")}
              </Text>
              {entry.body.code && (
                <Text weight="light" size="sm" className="my-0" ratio={1}>
                  {readingTime(entry.body.code).text}
                </Text>
              )}
            </div>
            <div className="flex flex-row space-x-2">
              {entry.tags &&
                entry.tags.map((tag, i) => (
                  <Tag key={i}>
                    <Highlighter
                      highlightClassName="bg-black text-white dark:bg-white dark:text-black"
                      searchWords={searchTerms}
                      autoEscape={true}
                      textToHighlight={tag}
                    />
                  </Tag>
                ))}
            </div>
            <div>
              <Text size="sm" weight="light">
                {entry.summary.length > 100
                  ? entry.summary.slice(0, 100) + "..."
                  : entry.summary}
              </Text>
            </div>
          </Container>
        </Link>
      </motion.div>
      {children}
    </>
  );
}
