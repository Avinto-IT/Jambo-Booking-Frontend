import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function addFacilityHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid Request Method" });
  }

  const { facilityId, subFacilities } = req.body;

  if (!facilityId) {
    return res.status(400).json({ message: "Facility Id is missing." });
  }

  if (!Array.isArray(subFacilities)) {
    return res
      .status(400)
      .json({ message: "Sub Facilities should be an array." });
  }

  try {
    // Check if the facility with the given ID exists
    const existingFacility = await prisma.facilities.findUnique({
      where: { facilityId },
    });

    if (existingFacility) {
      // Ensure existing subFacilities is parsed as a JSON array
      let existingSubFacilities: string[] = [];
      if (
        existingFacility.subFacilities &&
        Array.isArray(existingFacility.subFacilities)
      ) {
        existingSubFacilities = existingFacility.subFacilities as string[];
      }

      // Merge the existing subFacilities with the new ones and remove duplicates
      const updatedSubFacilities = Array.from(
        new Set([...existingSubFacilities, ...subFacilities])
      );

      // Update the existing facility
      const updatedFacility = await prisma.facilities.update({
        where: { facilityId },
        data: { subFacilities: updatedSubFacilities as Prisma.JsonArray },
      });
      return res.status(200).json({
        message: "Facility updated successfully",
        facility: updatedFacility,
      });
    } else {
      return res.status(404).json({ message: "Facility cannot be found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
}

export default addFacilityHandler;
