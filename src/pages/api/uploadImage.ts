import { put } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method" });
  }

  const { searchParams } = new URL(
    req.url as string,
    `http://${req.headers.host}`
  );
  const filename = searchParams.get("filename") || "";

  if (filename) {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const blob = await put(filename, buffer, {
        access: "public",
      });
      res.status(200).json(blob);
    });
  } else {
    res.status(400).json({ message: "No file name provided." });
  }
}
