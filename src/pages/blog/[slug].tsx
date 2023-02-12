import {allEntries} from "@contentlayer/generated";
import {Tag} from "@src/components/fragments/Tag";
import {Text} from "@src/components/ui/Text";
import {pageAnim} from "@src/lib/utils";
import {format, parseISO} from "date-fns";
import {motion} from "framer-motion";
import {InferGetStaticPropsType, GetStaticProps} from "next";
import {useMDXComponent} from "next-contentlayer/hooks";
import {NextSeo} from "next-seo";
import {url} from "@src/../next-seo.config";

const mdxcomponents = {};

export async function getStaticPaths() {
    const paths = allEntries.map(entry => entry.slug);
    console.log(`paths: ${paths}`);
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({params}: GetStaticProps & {params: {slug: string}}) {
    const entry = allEntries.find(entry => entry._raw.flattenedPath.toLowerCase().replace(" ", "-") === params.slug);
    return {
        props: {
            data: entry,
        },
    };
}

export default function Entry({data}: InferGetStaticPropsType<typeof getStaticProps>) {
    const Body = useMDXComponent(data?.body.code ?? "");
    return (
        <motion.article
            initial={pageAnim.initial}
            animate={pageAnim.animate}
            exit={pageAnim.initial}
            transition={pageAnim.transition}
            className="prose min-w-[300px] mt-10 lg:max-w-[500px] space-y-4">
            <NextSeo
                title={data?.title}
                description={data?.summary}
                openGraph={{
                    title: data?.title,
                    description: data?.summary,
                    images: [
                        {
                            url: new URL(
                                `${url}/api/og?title=${data?.title}&date=${
                                    data?.publishedAt
                                        ? format(parseISO(data?.publishedAt), "LLLL d, yyyy")
                                        : "Sometime ago..."
                                }`
                            ).href,
                            width: 1200,
                            height: 630,
                            alt: data?.title,
                        },
                    ],
                }}
            />
            <Text heading={true} headingSize="h1" weight="medium" size="4xl">
                {data?.title}
            </Text>
            {data?.tags && (
                <div className="flex flex-row space-x-2">
                    {data?.tags.map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
                    ))}
                </div>
            )}
            {data?.publishedAt && (
                <Text weight="light" size="sm">
                    {format(parseISO(data?.publishedAt), "LLLL d, yyyy")}
                </Text>
            )}
            <Body components={mdxcomponents} />
        </motion.article>
    );
}
