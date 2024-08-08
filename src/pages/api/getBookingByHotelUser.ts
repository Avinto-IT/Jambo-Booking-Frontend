import { NextApiResponse, NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getBookingsByHotelUserIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { userID } = req.query;
  if (!userID) {
    return res.status(400).json({ error: "User ID not provided in the URL" });
  }
  console.log(userID, "asdasdasdasdasdasdasdas");

  const userIDFromQuery = Array.isArray(userID) ? userID[0] : userID;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        hotel: {
          userID: userIDFromQuery,
        },
      },
      include: {
        hotel: {
          select: {
            name: true,
            address: true,
            primaryImageLink: true,
            contactDetails: true,
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            contactNumber: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
