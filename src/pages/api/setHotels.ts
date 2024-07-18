import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/middleware";

const prisma = new PrismaClient();

async function addHotelHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let {
    name,
    address,
    locationID,
    facilities,
    description,
    houseRules,
    imageLinks,
    primaryImageLink,
    isRunning,
    rooms,
    discount,
    contactDetails,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing or incorrect field: name" });
  }
  if (!address) {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: address" });
  }
  if (!locationID) {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: locationID" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: description" });
  }
  if (!Array.isArray(imageLinks)) {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: imageLinks" });
  }
  if (!primaryImageLink) {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: primaryImageLink" });
  }
  if (typeof isRunning !== "boolean") {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: isRunning" });
  }
  if (
    !Array.isArray(facilities) ||
    !facilities.every((item) => typeof item === "object")
  ) {
    return res.status(400).json({ error: "Incorrect field: facilities" });
  }
  if (facilities.length < 1) {
    return res
      .status(400)
      .json({ error: "Atleast one value for facility should be included" });
  }
  if (
    !Array.isArray(houseRules) ||
    !houseRules.every((item) => typeof item === "object")
  ) {
    return res.status(400).json({ error: "Incorrect field: houseRules" });
  }
  if (houseRules.length < 1) {
    return res
      .status(400)
      .json({ error: "Atleast one house rule should be included" });
  }
  if (
    !Array.isArray(rooms) ||
    !rooms.every((room) => typeof room === "object")
  ) {
    return res.status(400).json({ error: "Incorrect field: rooms" });
  }
  if (rooms.length < 1) {
    return res
      .status(400)
      .json({ error: "Atleast one room type should be included." });
  }
  if (!discount) {
    discount = 0.0;
  }

  try {
    const hotel = await prisma.hotel.create({
      data: {
        name,
        address,
        location: {
          connect: { locationID: locationID },
        },
        // locationID,
        facilities,
        description,
        houseRules,
        imageLinks,
        primaryImageLink,
        isRunning,
        rooms,
        discount,
        contactDetails,
      },
    });
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Error creating hotel:", error);
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
