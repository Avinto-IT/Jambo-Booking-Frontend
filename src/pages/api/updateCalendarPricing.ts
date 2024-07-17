import { NextApiRequest, NextApiResponse } from "next";
import { Prisma, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Room } from "@/utils/types";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export default async function updateCalendarPricingHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { hotelID, roomType, calendarPrice } = req.body;
  if (!hotelID) {
    return res.status(400).json({ error: "Hotel id was not provided" });
  }
  if (!roomType) {
    return res.status(400).json({ error: "RoomType was not provided" });
  }
  if (!calendarPrice) {
    return res.status(400).json({ error: "Calendar Price was not provided" });
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization failed" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string };
    if (decoded.role !== "admin") {
      return res
        .status(401)
        .json({ error: "You are not authorized to perform this action" });
    }

    // Find the hotel
    const hotel = await prisma.hotel.findUnique({
      where: { hotelID },
    });
    // console.log(roomType);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    // Parse the existing rooms JSON
    let rooms: Room[] =
      typeof hotel.rooms === "string" ? JSON.parse(hotel.rooms) : hotel.rooms;
    // console.log(rooms, "rooms");
    // Find the room to update
    const roomIndex = rooms?.findIndex((room) => room.type === roomType);
    // console.log(roomIndex, "index");
    if (roomIndex === -1) {
      return res
        .status(404)
        .json({ error: "Room type not found in the hotel" });
    }

    rooms[roomIndex].calendarPrices = rooms[roomIndex].calendarPrices || []; // Ensure that the calendarPrice is aslways an array.
    const newCalendarPrice = {
      id: uuidv4(), // Generate a unique ID for the calendar price
      ...calendarPrice,
    };

    rooms[roomIndex].calendarPrices.push(newCalendarPrice);

    // Update the hotel with the new rooms JSON
    await prisma.hotel.update({
      where: { hotelID },
      data: {
        rooms: rooms as unknown as Prisma.JsonObject, // Ensuring the type matches Prisma.JsonObject
      },
    });

    return res.status(200).json({
      message: `The calendar price has been updated for ${hotel.name}`,
    });
  } catch (error) {
    console.error("Error updating calendar price:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
