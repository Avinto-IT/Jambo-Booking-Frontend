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
    guests,
    bookingInfo,
    specialRequest,
  } = req.body;

  if (!userID) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!hotelID) {
    return res.status(400).json({ error: "Hotel ID is required" });
  }
  if (!bookingStartDate) {
    return res.status(400).json({ error: "Booking start date is required" });
  }
  if (!bookingEndDate) {
    return res.status(400).json({ error: "Booking end date is required" });
  }
  if (guests === undefined || guests === null) {
    return res.status(400).json({ error: "Number of guests is required" });
  }
  if (!Array.isArray(bookingInfo) || bookingInfo.length === 0) {
    return res
      .status(400)
      .json({ error: "Booking information is required and must be an array" });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { userID },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "agent") {
      return res.status(403).json({ error: "Only agents can book rooms" });
    }

    // Check if the hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { hotelID },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const rooms = hotel.rooms as unknown as Array<{
      type: string;
      price: number;
      capacity: string;
      beds: Array<{
        bedType: string;
        numberOfBeds: string;
      }>;
    }>;

    const updatedBookingInfo = bookingInfo.map((info) => {
      const room = rooms?.find((room) => room.type === info.roomType);
      if (!room) {
        throw new Error(`Cannot find room type: ${info.roomType}`);
      }
      const beds = room.beds;
      // console.log(room);
      const roomCapacity = room.capacity;
      const totalPrice = room.price * info.rooms;
      const roomPrice = room.price;
      return {
        ...info,
        totalPrice,
        beds,
        roomCapacity,
        roomPrice,
      };
    });

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userID,
        hotelID,
        bookingStartDate: new Date(bookingStartDate),
        requestedDate: new Date(),
        bookingEndDate: new Date(bookingEndDate),
        status: "requested",
        guests,
        bookingInfo: updatedBookingInfo,
        specialRequest,
      },
    });

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
    return res
      .status(500)
      .json({ error: "Booking failed/Internal Server Error" });
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
