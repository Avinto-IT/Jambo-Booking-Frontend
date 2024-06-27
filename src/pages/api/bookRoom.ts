import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/middleware";

const prisma = new PrismaClient();

async function bookHotelRoomHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    userID,
    hotelID,
    bookingStartDate,
    bookingEndDate,
    status,
    guests,
    bookingInfo,
  } = req.body;

  if (!userID) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!hotelID) {
    return res.status(400).json({ error: "Hotel ID is required" });
  }
  if (!bookingStartDate) {
    return res.status(400).json({ error: "Booking date is required" });
  }
  if (!bookingEndDate) {
    return res.status(400).json({ error: "Booking date is required" });
  }
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  if (guests === undefined || guests === null) {
    return res.status(400).json({ error: "Number of guests is required" });
  }
  if (bookingInfo === undefined || bookingInfo === null) {
    return res.status(400).json({ error: "Number of rooms is required" });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { userID },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { hotelID },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userID,
        hotelID,
        bookingStartDate: new Date(bookingStartDate),
        bookingEndDate: new Date(bookingEndDate),
        status,
        guests,
        bookingInfo,
      },
    });

    // Optionally, you can create a booking history record
    await prisma.bookingHistory.create({
      data: {
        bookingID: booking.bookingID,
        count: 1,
        userID: booking.userID,
      },
    });

    return res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ error: "Booking failed" });
  } finally {
    await prisma.$disconnect();
  }
}

export default function authenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => bookHotelRoomHandler(req, res));
}
