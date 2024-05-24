import { getServerAuthSession } from '@src/server/auth';
import { db } from '@src/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import type { ApiError } from '@src/pages/api/post/[slug]';
import { ReplyCreateSchema } from '@src/components/fragments/Comment';

async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<ApiError<boolean>>,
) {
  // validate auth
  const session = await getServerAuthSession({ req: req, res: res });
  if (!session)
    return res
      .status(401)
      .send({ error: "You're not authorized to perform the action." });

  // validate body
  const parsedBodyResult = ReplyCreateSchema.safeParse(req.body);
  if (!parsedBodyResult.success) {
    return res.status(400).send({ error: 'The request body is invalid.' });
  }
  const body = parsedBodyResult.data;

  // validate request
  const isValid = await validateReplyRequest(
    session,
    body.text,
    body.commentId,
  );
  if (!isValid)
    return res
      .status(403)
      .send({ error: 'The request is forbidden due to unmet precondition.' });

  // create comment
  const createRes = await db.reply.create({
    data: {
      text: body.text,
      userId: session.user.id,
      commentId: body.commentId,
    },
  });
  if (!createRes)
    return res.status(500).send({
      error: 'An error occurred while creating a reply to the comment.',
    });

  return res.status(200).send({ data: true });
}

// preconditions
export async function validateReplyRequest(
  session: Session,
  text: string,
  commentId: string,
): Promise<boolean> {
  if (text.length > 4000) return false; // comment too long
  if (text.length < 1) return false; // comment too short
  const comment = await db.comment.findUnique({ where: { id: commentId } }); // comment exists
  if (!comment) return false;
  const user = await db.user.findUnique({ where: { id: session.user.id } }); // user exists and isn't blacklisted
  if (!user || user.blacklisted) return false;
  return true;
}

export default handleRequest;
