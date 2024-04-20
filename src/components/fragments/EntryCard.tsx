import type { Entry } from '@contentlayer/generated';
import { Container } from '@src/components/ui/Container';
import { Tag } from '@src/components/ui/Tag';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Highlighter from 'react-highlight-words';
import readingTime from 'reading-time';

export const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  tranistion: { duration: 0.2 },
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
  const searchTerms = search.toLowerCase().split(' ');
  return (
    <>
      <motion.div
        className="w-[360px] lg:w-[400px]"
        initial={variants.hidden}
        animate={variants.visible}
        exit={variants.hidden}
        transition={variants.tranistion}
      >
        <Link href={entry.slug}>
          <Container className="space-y-2">
            <div className="flex flex-col justify-between space-y-2">
              <span className="text-lg font-semibold">
                <Highlighter
                  highlightClassName="bg-black text-white dark:bg-white dark:text-black"
                  searchWords={searchTerms}
                  autoEscape={true}
                  textToHighlight={entry.title}
                />
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(parseISO(entry.publishedAt), 'LLLL d, yyyy')}
              </span>
              {entry.body.code && (
                <span className="font-light text-sm my-0">
                  {readingTime(entry.body.code).text}
                </span>
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
              <span className="text-sm font-light">
                {entry.summary.length > 100
                  ? entry.summary.slice(0, 100) + '...'
                  : entry.summary}
              </span>
            </div>
          </Container>
        </Link>
      </motion.div>
      {children}
    </>
  );
}
