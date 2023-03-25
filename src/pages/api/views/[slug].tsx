import {createPostOrUpdateViews} from "@src/lib/utils";
import {NextApiRequest, NextApiResponse} from "next";

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug?.toString();
  if (!slug) {
    return res.status(400).send({
      error: "I couldn't find a slug! Did you forget to add one?",
    });
  }
  const views = await createPostOrUpdateViews(slug);
  return res.status(200).send({...views});
}

export default handleRequest;
