import { getClientInfo } from "@src/lib/utils";
import { db } from "@src/server/db";
import { NextApiRequest, NextApiResponse } from "next";

type Views = number;
export type Comment = {
  id: string;
  user: {
    username: string | null;
    name: string | null;
    image: string | null;
  };
  post: {
    slug: string;
  };
  text: string;
  createdAt: Date;
  replies: {
    id: string;
    user: {
      username: string | null;
      name: string | null;
      image: string | null;
    };
    text: string;
    createdAt: Date;
  }[];
};
export type PostResponse = { views: Views; comments: Comment[] };
export type ApiError<T> = { error?: string; data?: T };

async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiError<PostResponse>>
) {
  // get request ip
  let userInfo = getClientInfo(req);
  if (!userInfo.ip)
    return res.status(400).send({ error: "No IP address found in request." });

  // get slug from query & return error if not found
  const slug = req.query.slug?.toString();
  if (!slug)
    return res.status(400).send({ error: "No post id found in the request." });

  // get views from db
  const post = await db.post.findUnique({
    where: { slug: slug },
    select: {
      comments: {
        select: {
          post: {
            select: {
              slug: true,
            },
          },
          id: true,
          user: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
          text: true,
          createdAt: true,
          replies: {
            select: {
              id: true,
              user: {
                select: {
                  username: true,
                  name: true,
                  image: true,
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
