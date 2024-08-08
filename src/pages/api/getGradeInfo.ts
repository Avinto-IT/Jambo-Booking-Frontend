import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
export default async function getAllBookingHistoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "You are not logged in to perform this action" });
    }
    const token = authHeader.split(" ")[1];
    if (!SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Internal server error: SECRET_KEY is not set" });
    }
    const decoded = jwt.verify(token, SECRET_KEY) as { role: "admin" };
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action" });
    }

    const grade = await prisma.grade.findMany({});

    if (grade.length === 0) {
      return res.status(404).json({ message: "No grade found" });
    }

    return res.status(200).json({ grade });
  } catch (error) {
    console.error("Error fetching grade information:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
