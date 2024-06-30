import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getBookingHistoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ error: "Missing or incorrect userID" });
  }
  if (typeof userID !== "string") {
    return res.status(400).json({ error: "User ID type isnt valid" });
  }
  try {
    const bookingHistory = await prisma.bookingHistory.findMany({
      where: { userID },
      include: {
        booking: true,
      },
    });

    if (bookingHistory.length === 0) {
      return res.status(404).json({ message: "No booking history found" });
    }

    return res.status(200).json({ bookingHistory });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
