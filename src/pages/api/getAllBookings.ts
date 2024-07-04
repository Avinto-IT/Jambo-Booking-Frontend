import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAllBookingHistoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        hotel: true,
        user: true,
      },
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
