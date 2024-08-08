import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/middleware";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

async function addHotelHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gradeID, priceModifier } = req.body;

  if (!gradeID) {
    return res.status(400).json({ error: "Grade name is missing" });
  }
  if (!priceModifier) {
    return res.status(400).json({ error: "Price is missing" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "You are not authorized to perform this action" });
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
        .json({ error: "You do not have permission to perform this action" });
    }

    const grade = await prisma.grade.findUnique({
      where: { gradeID: gradeID },
    });

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    // Update the agent's grade
    const updatedGradePrice = await prisma.grade.update({
      where: { gradeID },
      data: { priceModifier: priceModifier },
    });

    res.status(200).json({
      message: "Agent Tier price updated succesfully",
      updatedGradePrice,
    });
  } catch (error) {
    console.error("Error updating agent's grade:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

export default function authenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => addHotelHandler(req, res));
}
