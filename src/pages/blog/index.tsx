import { allEntries } from '@contentlayer/generated';
import { EntryCard, variants } from '@src/components/fragments/EntryCard';
import { Input } from '@src/components/ui/Input';
import { compareDesc } from 'date-fns';
import type { InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '@src/components/ui/Separator';
import { generateRSSFeed } from '@src/lib/utils';
import { NextSeo } from 'next-seo';
import { Page } from '@src/components/ui/Page';

export default function BlogPage({
  entries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(entries);

  useEffect(() => {
    setFilteredEntries(
      entries
        .filter((entry) => {
          return (
            entry.title.toLowerCase().includes(search.toLowerCase()) ||
            entry.tags?.some((tag) =>
              search
                .toLowerCase()
                .split(' ')
                .some((s) => tag.toLowerCase().includes(s)),
            )
          );
        })
        .sort((a, b) => {
          return compareDesc(new Date(a.publishedAt), new Date(b.publishedAt));
        }),
    );
  }, [entries, search]);

  return (
    <Page className="flex flex-col gap-5 h-full mt-20">
      <NextSeo
        title="blog."
        description="I occasionally write about things I find interesting."
      />
      <div className="flex px-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {filteredEntries.length !== 0 ? (
            filteredEntries.map((entry, i) => {
              return (
                <EntryCard key={i} entry={entry} search={search}>
                  {i !== filteredEntries.length - 1 && <Separator />}
                </EntryCard>
              );
            })
          ) : (
            <motion.div
              className="flex flex-col justify-center items-center space-y-2 w-full min-w-[300px] lg:min-w-[400px] min-h-[150px]"
              initial={variants.hidden}
              animate={variants.visible}
              exit={variants.hidden}
              transition={variants.tranistion}
            >
              <div className="text-2xl font-semibold">No results found</div>
              <div className="text-gray-500">Try a different search term</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const entries = allEntries.sort((a, b) => {
    return compareDesc(new Date(a.publishedAt), new Date(b.publishedAt));
  });
  await generateRSSFeed(entries);
  return {
    props: {
      entries: entries,
    },
    revalidate: 60 * 60 * 3,
  };
}
