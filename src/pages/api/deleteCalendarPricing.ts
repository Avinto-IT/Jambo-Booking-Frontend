import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { Room } from "@/utils/types";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
export default async function deleteCalendarPricing(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(400).json({ error: "Invalid request method" });
  }
  const { calendarPriceID, hotelID, roomType } = req.body;
  if (!calendarPriceID) {
    return res
      .status(400)
      .json({ error: "Calendar price ID was not provided" });
  }
  if (!hotelID) {
    return res.status(400).json({ error: "Hotel ID was not provided" });
  }
  if (!roomType) {
    return res.status(400).json({ error: "Room type was not provided" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization failed" });
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
        .status(401)
        .json({ error: "You are not authorized to perform this action" });
    }
    const hotel = await prisma.hotel.findUnique({
      where: { hotelID },
    });
    if (!hotel) {
      return res.status(404).json({ error: "The hotel couldnt be found" });
    }

    let rooms: Room[] =
      typeof hotel.rooms === "string" ? JSON.parse(hotel.rooms) : hotel.rooms;
    const roomIndex = rooms.findIndex((room) => room.type === roomType);
    if (roomIndex === -1) {
      return res.status(404).json({ error: "The room type couldnt be found" });
    }
    const calendarPriceIndex = rooms[roomIndex].calendarPrices?.findIndex(
      (calendarPrice) => calendarPrice.id === calendarPriceID
    );
    if (calendarPriceIndex === -1 || calendarPriceIndex === undefined) {
      return res
        .status(404)
        .json({ error: "The calendar price could not be found" });
    }
    rooms[roomIndex].calendarPrices?.splice(calendarPriceIndex, 1);
    await prisma.hotel.update({
      where: { hotelID },
      data: {
        rooms: rooms as unknown as Prisma.JsonObject,
      },
    });
    return res.status(200).json({
      message: `The calendar price for ${hotel.name} for ${roomType} with id ${calendarPriceID} has been deleted succesfully.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
