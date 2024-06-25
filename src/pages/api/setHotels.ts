import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
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
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: facilities" });
  }
  if (
    !Array.isArray(houseRules) ||
    !houseRules.every((item) => typeof item === "string")
  ) {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: houseRules" });
  }
  if (
    !Array.isArray(rooms) ||
    !rooms.every((room) => typeof room === "object")
  ) {
    return res.status(400).json({ error: "Missing or incorrect field: rooms" });
  }
  if (typeof discount !== "number") {
    return res
      .status(400)
      .json({ error: "Missing or incorrect field: discount" });
  }

  try {
    const hotel = await prisma.hotel.create({
      data: {
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
