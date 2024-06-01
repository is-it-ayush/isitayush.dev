import { allEntries } from '@contentlayer/generated';
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/Avatar';
import { url } from '@src/../next-seo.config';
import { SplitParagraphIntoLines } from '@src/components/blogs/SplitParagraphIntoLines';
import { Image } from '@src/components/ui/Image';
import { Page } from '@src/components/ui/Page';
import { Tag } from '@src/components/ui/Tag';
import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { NextSeo } from 'next-seo';
import type { InferGetStaticPropsType } from 'next/types';
import readingTime from 'reading-time';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useHotkeys } from 'react-hotkeys-hook';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@src/components/ui/Form';
import { useToast } from '@src/lib/useToast';
import type { ApiError, PostResponse } from '@src/pages/api/post/[slug]';
import { getData, postData } from '@src/lib/utils';
import { Comment } from '@src/components/fragments/Comment';
import { Button } from '@src/components/ui/Button';
import { ArrowDown01, ArrowUp10 } from 'lucide-react';

// view animation
const slugViewAnim = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.2,
  },
};

const commentListAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// mdx component used as a part of the blog.
const mdxcomponents = {
  Image,
  SplitParagraphIntoLines,
};

export const CreateCommentSchema = z.object({
  comment: z.string().min(2, 'Comment should be atleast 2 characters long.'),
  slug: z.string().min(1, 'Slug should be atleast 1 character long.'),
});
type CreateCommentSchema = z.infer<typeof CreateCommentSchema>;

export default function Entry({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const Body = useMDXComponent(data?.entry?.body.code ?? '');
  const [slug, setSlug] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // handle slug
  useEffect(() => {
    (async () => {
      if (!data.entry) {
        await router.replace(
          `/500?error=${encodeURIComponent(
            'It seems like there was an error while getting the post entry.',
          )}`,
        );
      } else {
        setSlug(
          data.entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, '-'),
        );
        commentCreateForm.setValue(
          'slug',
          data.entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, '-'),
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on mount.
  }, []);

  // GET | post query | /api/post/<slug> | { views: number, comments: Comment[] }
  const postsQuery = useQuery<ApiError<PostResponse>>({
    queryKey: [`/api/post/${slug}`],
    queryFn: () => getData(`/api/post/${slug}`),
    enabled: !!slug,
  });
  // POST | comment mutation | /api/post/comment/create | { comment: string, slug: string }
  const postCommentMutation = useMutation({
    mutationFn: (data: CreateCommentSchema): Promise<ApiError<boolean>> =>
      postData(`/api/post/comment/create`, data),
  });

  // create comment form
  const commentCreateForm = useForm<CreateCommentSchema>({
    resolver: zodResolver(CreateCommentSchema),
  });
  async function onCreateComment(values: CreateCommentSchema) {
    const res = await postCommentMutation.mutateAsync(values);
    if ('error' in res) {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Comment created successfully.' });
    }
    commentCreateForm.setValue('comment', '');
    postsQuery.refetch();
  }

  // ctrl + enter should submit comment.
  useHotkeys(
    'ctrl+enter',
    async () => {
      await commentCreateForm.handleSubmit(onCreateComment)();
    },
    {
      enableOnFormTags: true,
    },
  );

  return (
    <Page>
      <article className="flex flex-col min-w-[300px] mt-10 lg:max-w-[500px] gap-6">
        <NextSeo
          title={data?.entry?.title}
          description={data?.entry?.summary}
          openGraph={{
            title: data?.entry?.title,
            description: data?.entry?.summary,
            url: new URL(
              `${url}/blog/${data?.entry?._raw.flattenedPath
                .toLowerCase()
                .replace(/\s+/g, '-')}`,
            ).href,
            images: [
              {
                url: new URL(
                  `${url}/api/og?title=${data?.entry?.title}&date=${
                    data?.entry?.publishedAt
                      ? format(
                          parseISO(data?.entry?.publishedAt),
                          'LLLL d, yyyy',
                        )
                      : 'Sometime ago...'
                  }`,
                ).href,
                width: 1200,
                height: 630,
                alt: data?.entry?.title,
              },
            ],
            type: 'article',
            article: {
              publishedTime: data?.entry?.publishedAt,
              tags: data?.entry?.tags,
              authors: [`${url}`],
            },
          }}
        />
        <span className="my-4 text-4xl font-medium">{data?.entry?.title}</span>
        <div className="flex flex-col gap-2">
          {data?.entry?.tags && (
            <div className="flex flex-row gap-2">
              {data?.entry?.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
            </div>
          )}
          {data?.entry?.publishedAt && (
            <span className="text-sm font-light">
              {format(parseISO(data?.entry?.publishedAt), 'LLLL d, yyyy')}
            </span>
          )}
          <div className="flex flex-row gap-2 items-center justify-between">
            <AnimatePresence mode="popLayout">
              {postsQuery.isLoading ? (
                <motion.div
                  key="loading_views"
                  initial={slugViewAnim.initial}
                  animate={slugViewAnim.animate}
                  exit={slugViewAnim.initial}
                  transition={slugViewAnim.transition}
                  className="animate-pulse rounded-[20px] h-[20px] w-[50px] bg-gray-200 dark:bg-white/10"
                ></motion.div>
              ) : (
                postsQuery.data?.data?.views && (
                  <motion.div
                    key="views"
                    initial={slugViewAnim.initial}
                    animate={slugViewAnim.animate}
                    exit={slugViewAnim.initial}
                    transition={slugViewAnim.transition}
                  >
                    <span className="text-sm font-light my-0">
                      {Intl.NumberFormat('en-IN').format(
                        postsQuery.data.data.views,
                      )}{' '}
                      views
                    </span>
                  </motion.div>
                )
              )}
              {data?.entry?.body.code && (
                <motion.div
                  key="reading_time"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <span className="font-light text-sm my-0">
                    {readingTime(data.entry.body.code).text}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* hotpatch production: debug more, this should work without w-[90vw] */}
        <div className="flex flex-col w-[90vw] md:w-auto gap-0 prose">
          <Body components={mdxcomponents} />
        </div>
        <span className="flex h-1 w-full rounded-lg bg-white dark:bg-white/5" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between">
            <span className="text-4xl font-semibold">
              {postsQuery.data?.data?.comments.length} comments.
            </span>
            <Button
              tooltip={`sort comments by ${
                sortOrder === 'asc' ? 'oldest' : 'newest'
              } first.`}
              className="font-light p-2"
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              {sortOrder === 'asc' ? (
                <ArrowDown01 className="w-4 h-4" />
              ) : (
                <ArrowUp10 className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-row gap-2">
            {session.status !== 'unauthenticated' ? (
              <Form {...commentCreateForm}>
                <form
                  onSubmit={commentCreateForm.handleSubmit(onCreateComment)}
                  className="w-full"
                >
                  <div className="flex flex-row gap-4 items-center w-full">
                    <Avatar>
                      {session.data?.user.image ? (
                        <AvatarImage
                          src={session.data?.user.image}
                          alt={`${session.data?.user.username}'s photo`}
                        />
                      ) : null}
                      <AvatarFallback>
                        {session.data?.user.username}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3 w-full text-sm">
                      <div className="flex flex-row gap-4 justify-between items-center">
                        <span className="">@{session.data?.user.username}</span>
                        <div className="flex flex-row gap-2">
                          <Button
                            type="submit"
                            className="font-light"
                            tooltip="post comment."
                          >
                            comment.
                          </Button>
                        </div>
                      </div>
                      <FormField
                        control={commentCreateForm.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                className="w-full bg-[#e8e8e8] dark:bg-black/95 border-b-2 border-white dark:border-white/5 p-2 text-black dark:text-white"
                                placeholder="write a comment...be nice :3"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            ) : (
              <span className="text-sm font-light">
                <Link
                  href={`/auth/signin?callbackUrl=${encodeURIComponent(
                    router.asPath,
                  )}`}
                >
                  sign in
                </Link>{' '}
                to comment.
              </span>
            )}
          </div>
          <motion.ul
            variants={commentListAnimation}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4 w-full text-sm list-none p-0 m-0"
          >
            {postsQuery.data?.data?.comments
              ?.sort((a, b) => {
                // sort by descending order of createdAt: latest last
                switch (sortOrder) {
                  case 'asc':
                    return a.createdAt > b.createdAt ? 1 : -1;
                  case 'desc':
                    return a.createdAt < b.createdAt ? 1 : -1;
                  default:
                    return 0;
                }
              })
              .map((comment, _) => (
                <Comment key={comment.id} comment={comment} slug={slug} />
              ))}
          </motion.ul>
        </div>
      </article>
    </Page>
  );
}

export const getStaticPaths = async () => {
  const paths = allEntries.map((entry) => ({
    params: {
      slug: entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, '-'),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
export async function getStaticProps({
  params,
}: GetStaticProps & { params: { slug: string } }) {
  const entry = allEntries.find(
    (entry) =>
      entry._raw.flattenedPath.toLowerCase().replace(/\s+/g, '-') ===
      params.slug,
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
