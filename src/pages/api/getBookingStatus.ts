import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getBookingStatusHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingID } = req.query;

  if (!bookingID || typeof bookingID !== "string") {
    return res.status(400).json({ error: "Missing or incorrect bookingID" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingID },
      select: { status: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json({ status: booking.status });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
