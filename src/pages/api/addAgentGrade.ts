import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addGrade = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { gradeName, priceModifier } = req.body;

  try {
    const grade = await prisma.grade.create({
      data: {
        gradeName,
        priceModifier,
      },
    });
    res.status(201).json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default addGrade;
