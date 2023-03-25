import {allEntries} from "@contentlayer/generated";
import {url} from "@src/../next-seo.config";
import {Image} from "@src/components/ui/Image";
import {Tag} from "@src/components/ui/Tag";
import {Text} from "@src/components/ui/Text";
import {createPostOrUpdateViews, pageAnim} from "@src/lib/utils";
import {format, parseISO} from "date-fns";
import {motion} from "framer-motion";
import {GetStaticProps} from "next";
import {useMDXComponent} from "next-contentlayer/hooks";
import {NextSeo} from "next-seo";
import {InferGetServerSidePropsType} from "next/types";
import readingTime from "reading-time";

const mdxcomponents = {
  Image,
};

export async function getServerSideProps({
  params,
}: GetStaticProps & {params: {slug: string}}) {
  const entry = allEntries.find(
    entry =>
      entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, "-") ===
      params.slug
  );

  let information = await createPostOrUpdateViews(entry);

  return {
    props: {
      data: {
        entry: entry,
        extra: {...information},
      },
    },
  };
}

export default function Entry({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const Body = useMDXComponent(data?.entry?.body.code ?? "");
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
      {data?.extra?.views && (
        <div className="flex flex-row gap-2 items-center justify-between">
          <Text weight="light" size="sm" className="my-0" ratio={1}>
            {Intl.NumberFormat("en-IN").format(data.extra.views)} views
          </Text>
          {data?.entry?.body.code && (
            <Text weight="light" size="sm" className="my-0" ratio={1}>
              {readingTime(data.entry.body.code).text}
            </Text>
          )}
        </div>
      )}
      <Body components={mdxcomponents} />
    </motion.article>
  );
}
