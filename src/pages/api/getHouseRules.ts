import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function getLocationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Invalid request method" });
  }

  try {
    const houseRules = await prisma.houseRules.findMany();
    res.status(200).json(houseRules);
  } catch (error) {
    console.log("Error fetching house rules", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
