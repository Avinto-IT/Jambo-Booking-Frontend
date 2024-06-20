import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function setHotelHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Invalid Request Method" });
  }
  const {
    name,
    address,

    amenities,
    description,
    houseRules,
    imageLinks,
    primaryImageLink,
    isRunning,
  } = req.body;

  if (
    !name ||
    !address ||
    !amenities ||
    !description ||
    !houseRules ||
    !imageLinks ||
    !primaryImageLink ||
    !isRunning
  ) {
    res.status(401).json({ error: "Missing fields data" });
  }
  try {
    const hotel = await prisma.hotel.create({
      data: {
        name,
        address,
        locationID,
        amenities,
        description,
        houseRules,
        imageLinks,
        primaryImageLink,
        isRunning,
      },
    });
    res.status(201).json({ message: "Hotel Added Successfully", hotel: hotel });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
