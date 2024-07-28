import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getFacilitiesHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Invalid Request Method" });
  }

  try {
    // Fetch all facilities from the database
    const facilities = await prisma.facilities.findMany();

    return res.status(200).json(facilities);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the facilities" });
  }
}

export default getFacilitiesHandler;
