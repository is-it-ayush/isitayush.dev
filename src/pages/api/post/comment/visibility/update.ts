import { getServerAuthSession } from '@src/server/auth';
import { db } from '@src/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiError } from '@src/pages/api/post/[slug]';
import { GenericIDSchema } from '@src/components/fragments/Comment';
import { getADMAcc } from '@src/lib/utils';

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
  const parsedBodyResult = GenericIDSchema.safeParse(req.body);
  if (!parsedBodyResult.success) {
    return res.status(400).send({ error: 'The request body is invalid.' });
  }
  const body = parsedBodyResult.data;

  // validate request
  const adms = getADMAcc();
  const comment = await db.comment.findUnique({ where: { id: body.id } });
  if (
    !comment ||
    comment.userId === session.user.id ||
    !adms.includes(session.user.id)
  ) {
    return res
      .status(403)
      .send({ error: 'The request is forbidden due to unmet precondition.' });
  }

  // flip visibility
  const flipRes = await db.comment.update({
    where: { id: body.id },
    data: { visible: { set: !comment.visible } },
  });
  if (!flipRes) {
    return res.status(500).send({
      error: 'An error occurred while flipping the comment visibility.',
    });
  }

  return res.status(200).send({ data: true });
}

export default handleRequest;
