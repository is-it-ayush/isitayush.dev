import { allEntries } from "@contentlayer/generated";
import { url } from "@src/../next-seo.config";
import { Image } from "@src/components/ui/Image";
import { Tag } from "@src/components/ui/Tag";
import { Text } from "@src/components/ui/Text";
import { pageAnim, slugViewAnim } from "@src/lib/utils";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticProps } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import { NextSeo } from "next-seo";
import { InferGetStaticPropsType } from "next/types";
import readingTime from "reading-time";
import useSwr from "swr";

const mdxcomponents = {
  Image,
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getStaticPaths = async () => {
  const paths = allEntries.map((entry) => ({
    params: {
      slug: entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, "-"),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export async function getStaticProps({
  params,
}: GetStaticProps & { params: { slug: string } }) {
  const entry = allEntries.find(
    (entry) =>
      entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, "-") ===
      params.slug
  );

  return {
    props: {
      data: {
        entry: entry,
        revalidate: 60 * 60,
      },
    },
  };
}

export default function Entry({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Body = useMDXComponent(data?.entry?.body.code ?? "");

  const {
    data: extra,
    error,
    isLoading,
  } = useSwr<{
    views: number;
    id: string;
  }>(
    `/api/views/${data.entry?._raw.flattenedPath
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <motion.article
      initial={pageAnim.initial}
      animate={pageAnim.animate}
      exit={pageAnim.initial}
      transition={pageAnim.transition}
      className="prose min-w-[300px] mt-10 lg:max-w-[500px] space-y-4">
      <NextSeo
        title={data?.entry?.title}
        description={data?.entry?.summary}
        openGraph={{
          title: data?.entry?.title,
          description: data?.entry?.summary,
          url: new URL(
            `${url}/blog/${data?.entry?._raw.flattenedPath
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          ).href,
          images: [
            {
              url: new URL(
                `${url}/api/og?title=${data?.entry?.title}&date=${
                  data?.entry?.publishedAt
                    ? format(parseISO(data?.entry?.publishedAt), "LLLL d, yyyy")
                    : "Sometime ago..."
                }`
              ).href,
              width: 1200,
              height: 630,
              alt: data?.entry?.title,
            },
          ],
          type: "article",
          article: {
            publishedTime: data?.entry?.publishedAt,
            tags: data?.entry?.tags,
            authors: [`${url}`],
          },
        }}
      />
      <Text heading={true} headingSize="h1" weight="medium" size="4xl">
        {data?.entry?.title}
      </Text>
      {data?.entry?.tags && (
        <div className="flex flex-row space-x-2">
          {data?.entry?.tags.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </div>
      )}
      {data?.entry?.publishedAt && (
        <Text weight="light" size="sm">
          {format(parseISO(data?.entry?.publishedAt), "LLLL d, yyyy")}
        </Text>
      )}
      <div className="flex flex-row gap-2 items-center justify-between">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading_views"
              initial={slugViewAnim.initial}
              animate={slugViewAnim.animate}
              exit={slugViewAnim.initial}
              transition={slugViewAnim.transition}
              className="animate-pulse rounded-[20px] h-[20px] w-[50px] bg-gray-200 dark:bg-white/10"></motion.div>
          ) : (
            extra?.views && (
              <motion.div
                key="views"
                initial={slugViewAnim.initial}
                animate={slugViewAnim.animate}
                exit={slugViewAnim.initial}
                transition={slugViewAnim.transition}>
                <Text weight="light" size="sm" className="my-0" ratio={1}>
                  {Intl.NumberFormat("en-IN").format(extra.views)} views
                </Text>
              </motion.div>
            )
          )}
          {data?.entry?.body.code && (
            <motion.div
              key="reading_time"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}>
              <Text weight="light" size="sm" className="my-0" ratio={1}>
                {readingTime(data.entry.body.code).text}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Body components={mdxcomponents} />
    </motion.article>
  );
}
