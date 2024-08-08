import { NextApiResponse, NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getHotelByIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Id not provided in the url" });
  }
  const idFromQuery = Array.isArray(id) ? id[0] : id;

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        bookingID: idFromQuery,
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
    res.status(200).json({ booking });
  } catch (error) {
    console.log("Error fetching hotels", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
