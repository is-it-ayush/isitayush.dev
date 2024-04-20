import type { ApiError } from "@src/pages/api/post/[slug]";
import { getServerAuthSession } from "@src/server/auth";
import { db } from "@src/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { CommentUpdateSchema } from "@src/components/fragments/Comment";
import { validateCommentRequest } from "@src/pages/api/comment/create";

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
  const parsedBodyResult = CommentUpdateSchema.safeParse(req.body);
  if (!parsedBodyResult.success) {
    return res.status(400).send({ error: "The request body is invalid." });
  }
  const body = parsedBodyResult.data;

  // validate request
  const isValid = await validateCommentRequest(
    session,
    body.id,
    body.slug
  );
  if (!isValid)
    return res
      .status(403)
      .send({ error: "The request is forbidden due to unmet precondition." });

  // update comment
  const updateRes = await db.comment.update({
    where: { id: body.id },
    data: { text: body.text },
  });
  if (!updateRes)
    return res
      .status(500)
      .send({ error: "An error occurred while updating the comment." });

  return res.status(200).send({ data: true });
}

export default handleRequest;
