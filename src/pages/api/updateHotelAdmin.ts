import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
async function UpdateBookingStatusHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let {
    hotelID,
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

  if (!hotelID) {
    return res.status(400).json({ error: "Missing hotel id" });
  }
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
    // Validate admin email
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "You are not authorized to perform this action" });
    }

    const token = authHeader.split(" ")[1];
    if (!SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Internal server error: SECRET_KEY is not set" });
    }
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string };

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    const updatedBooking = await prisma.hotel.update({
      where: { hotelID },
      data: {
        name: name,
        address: address,
        locationID: locationID,
        facilities: facilities,
        description: description,
        houseRules: houseRules,
        imageLinks: imageLinks,
        primaryImageLink: primaryImageLink,
        isRunning: isRunning,
        rooms: rooms,
        discount: discount,
        contactDetails: contactDetails,
      },
    });

    return res
      .status(200)
      .json({ message: "Booking status updated successfully", updatedBooking });
  } catch (error) {
    console.error("Error updating Hotel:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

export default UpdateBookingStatusHandler;
