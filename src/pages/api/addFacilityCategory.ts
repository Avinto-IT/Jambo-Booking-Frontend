import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addFacilityCategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid Request Method" });
  }

  const { facilityCategory } = req.body;

  if (!facilityCategory) {
    return res.status(400).json({ message: "Facility Category is missing." });
  }

  try {
    // Create a new facility category
    const newFacility = await prisma.facilities.create({
      data: { facilityCategory, subFacilities: {} },
    });
    return res.status(201).json({
      message: "Facility category created successfully",
      facility: newFacility,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
}

export default addFacilityCategoryHandler;
