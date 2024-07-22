import { verifyToken } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function updateHouseRuleHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method" });
  }

  const { houseRuleName } = req.body;

  if (!houseRuleName) {
    return res.status(400).json({ error: "House Rule is not provided" });
  }

  try {
    const houseRule = await prisma.houseRules.create({
      data: { houseRule: houseRuleName },
    });

    res
      .status(200)
      .json({ message: "House Rule created successfully", houseRule });
  } catch (error) {
    console.error("Error updating house rule", error);
    res.status(500).json({ error: "Internal Server error" });
  } finally {
    prisma.$disconnect();
  }
}

export default function updateHouseRuleAuthenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => updateHouseRuleHandler(req, res));
}
