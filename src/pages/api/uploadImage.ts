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
  try {
    if (req.method !== "POST") {
      return res.status(400).json({ error: "Invalid request method" });
    }

    const { searchParams } = new URL(
      req.url as string,
      `http://${req.headers.host}`
    );
    const filename = searchParams.get("filename");

    if (!filename) {
      return res.status(400).json({ message: "No file name provided." });
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const blob = await put(filename, buffer, {
          access: "public",
        });

        return res.status(200).json(blob);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        return res.status(500).json({ error: "Error uploading file" });
      }
    });

    req.on("error", (err) => {
      console.error("Request error:", err);
      return res.status(500).json({ error: "Error processing request" });
    });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
