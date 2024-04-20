import { getServerAuthSession } from "@src/server/auth";
import { db } from "@src/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "@src/pages/api/post/[slug]";
import { GenericIDSchema } from "@src/components/fragments/Comment";
import { getADMAcc } from "@src/lib/utils";

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
    return res.status(400).send({ error: "The request body is invalid." });
  }
  const body = parsedBodyResult.data;

  // validate request
  const adms = getADMAcc();
  const user = await db.user.findUnique({ where: { id: body.id } });

  if (!user || session.user.id === body.id || !adms.includes(session.user.id)) {
    return res
      .status(403)
      .send({ error: "The request is forbidden due to unmet precondition." });
  }

  // flip user blacklist status
  const blacklistRes = await db.user.update({
    where: { id: body.id },
    data: {
      blacklisted: !user.blacklisted,
    },
  });
  if (!blacklistRes)
    return res
      .status(500)
      .send({ error: "An error occurred while flipping the user blacklist status." });

  return res.status(200).send({ data: true });
}

export default handleRequest;
