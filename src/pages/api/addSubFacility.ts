import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Predefined facility categories
const predefinedFacilityCategories = [
  "Amenities",
  "Dining",
  "Recreation",
  "Business Services",
  "Transportation",
  "Guest Services",
  "Housekeeping",
  "Luggage",
  "Accessibility",
  "Security",
  "Emergency Services",
  "Recreational Activities",
  "Wellness and Spa",
  "Entertainment",
  "Children's Services",
  "Pet Services",
  "Technology",
];

async function addFacilityHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid Request Method" });
  }

  const { facilityId, subFacilities } = req.body;

  if (!facilityId) {
    return res.status(400).json({ message: "Facility Id is missing." });
  }

  try {
    // Check if the facility with the given ID exists
    const existingFacility = await prisma.facilities.findUnique({
      where: { facilityId },
    });

    if (existingFacility) {
      // Validate the facility category
      if (
        !predefinedFacilityCategories.includes(
          existingFacility.facilityCategory
        )
      ) {
        return res.status(400).json({ message: "Invalid Facility Category." });
      }

      // Update the existing facility
      const updatedFacility = await prisma.facilities.update({
        where: { facilityId },
        data: { subFacilities },
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
