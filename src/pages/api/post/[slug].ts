import { getADMAcc, getClientInfo } from '@src/lib/utils';
import { getServerAuthSession } from '@src/server/auth';
import { db } from '@src/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Views = number;
export type Comment = {
  id: string;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    blacklisted: boolean | null;
  };
  post: {
    slug: string;
  };
  visible: boolean | null;
  text: string;
  createdAt: Date;
  replies: {
    id: string;
    user: {
      id: string;
      username: string | null;
      name: string | null;
      image: string | null;
      blacklisted: boolean | null;
    };
    text: string;
    createdAt: Date;
    visible: boolean | null;
  }[];
};
export type PostResponse = { views: Views; comments: Comment[] };
export type ApiError<T> = { error?: string; data?: T };

async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiError<PostResponse>>,
) {
  // get request ip
  const userInfo = getClientInfo(req);
  if (!userInfo.ip)
    return res.status(400).send({ error: 'No IP address found in request.' });

  const session = await getServerAuthSession({ req: req, res: res });
  const adm = getADMAcc();

  // get slug from query & return error if not found
  const slug = req.query.slug?.toString();
  if (!slug)
    return res.status(400).send({ error: 'No post id found in the request.' });

  // get views from db
  // i hate object mod (...(<condition> ? a : b) pattern) but i have to do it...literally feel like i'm in a cage...this is so wrong...there must be a better way...
  // i'm sorry for this...i really am...i'm so sorry...i can't even look at this...i'm so sorry...i think i'm gonna cry...i'm so sorry...
  const post = await db.post.findUnique({
    where: { slug: slug },
    select: {
      comments: {
        where: {
          // if a session exists and the user is an admin, return all comments, else return only non-blacklisted comments.
          ...(session && adm.includes(session.user.id)
            ? {}
            : { user: { blacklisted: false }, visible: true }),
        },
        select: {
          post: {
            select: {
              slug: true,
            },
          },
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              ...(session && adm.includes(session.user.id)
                ? { blacklisted: true }
                : {}),
            },
          },
          text: true,
          createdAt: true,
          ...(session && adm.includes(session.user.id)
            ? { visible: true }
            : {}),
          replies: {
            where: {
              // if a session exists and the user is an admin, return all replies, else return only non-blacklisted replies.
              ...(session && adm.includes(session.user.id)
                ? {}
                : { user: { blacklisted: false }, visible: true }),
            },
            select: {
              id: true,
              ...(session && adm.includes(session.user.id)
                ? { visible: true }
                : {}),
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                  ...(session && adm.includes(session.user.id)
                    ? {}
                    : { blacklisted: true }),
                },
              },
              text: true,
              createdAt: true,
            },
          },
        },
      },
      views: true,
    },
  });

  let views = post?.views.length || 0;
  if (post) {
    // if post exists, check for an ip in the views array and create a view with the ip is not found.
    if (
      !post.views.find((view) => {
        return view.ip === userInfo.ip;
      })
    ) {
      await db.view.create({
        data: {
          postId: slug,
          ip: userInfo.ip,
        },
      });
      views = post.views.length + 1;
    }
  } else {
    // if post does not exist, create post with 1 view.
    await db.post.create({
      data: {
        slug: slug,
        views: {
          create: {
            ip: userInfo.ip,
          },
        },
      },
    });
    views = 1;
  }

  return res
    .status(200)
    .send({ data: { views: views, comments: post?.comments || [] } });
}

export default handleRequest;
