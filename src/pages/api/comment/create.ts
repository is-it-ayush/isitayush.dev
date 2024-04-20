import { CreateCommentSchema } from "@src/pages/blog/[slug]";
import { getServerAuthSession } from "@src/server/auth";
import { db } from "@src/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { ApiError } from "@src/pages/api/post/[slug]";

async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiError<boolean>>
) {
  // validate auth
  const session = await getServerAuthSession({ req: req, res: res });
  if (!session)
    return res
      .status(401)
      .send({ error: "You're not authorized to perform the action." });

  // validate body
  const parsedBodyResult = CreateCommentSchema.safeParse(req.body);
  if (!parsedBodyResult.success) {
    return res.status(400).send({ error: "The request body is invalid." });
  }
  const body = parsedBodyResult.data;

  // validate request
  const isValid = await validateCommentRequest(
    session,
    body.comment,
    body.slug
  );
  if (!isValid)
    return res
      .status(403)
      .send({ error: "The request is forbidden due to unmet precondition." });

  // create comment
  const createRes = await db.comment.create({
    data: {
      text: body.comment,
      userId: session.user.id,
      postId: body.slug,
    },
  });
  if (!createRes)
    return res
      .status(500)
      .send({ error: "An error occurred while creating the comment." });

  return res.status(200).send({ data: true });
}

// preconditions
export async function validateCommentRequest(
  session: Session,
  comment: string,
  slug: string
): Promise<boolean> {
  if (comment.length > 4000) return false; // comment too long
  if (comment.length < 1) return false; // comment too short
  const post = await db.post.findUnique({ where: { slug: slug } }); // post exists
  if (!post) return false;
  const user = await db.user.findUnique({ where: { id: session.user.id } }); // user exists and isn't blacklisted
  if (!user || user.blacklisted) return false;
  return true;
}

export default handleRequest;
