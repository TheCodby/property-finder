import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token !== process.env.PRIVATE_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
  try {
    const { path }: any = req.query;
    await res.revalidate(path);
    console.log(`[Next.js] Revalidating ${path}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
