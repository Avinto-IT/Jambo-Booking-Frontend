import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { index, content } = req.body;

    const filePath = path.join(process.cwd(), "data", "blog.json");
    //process.cwd() to get current working directory
    const fileData = fs.readFileSync(filePath, "utf8");
    //utf8 to convert to suitable string from binary data
    const blogsData = JSON.parse(fileData);

    // Update the content
    blogsData.blogs[index].content = content;

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(blogsData, null, 2));

    res.status(200).json({ message: "Blog content updated successfully!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
