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
  console.log(idFromQuery);
  try {
    const user = await prisma.user.findUnique({
      where: {
        userID: idFromQuery,
      },
      select: {
        userID: true,
        agencyName: true,
        firstName: true,
        lastName: true,
        email: true,
        contactNumber: true,
        role: true,
        dateOfBirth: true,
        address: true,
        toursCompleted: true,
        hasMultipleHotel: true,
        gradeName: true,
        bookings: {
          include: {
            hotel: {
              select: {
                name: true,
                address: true,
                primaryImageLink: true,
              },
            },
          },
        },
        grade: {
          select: {
            priceModifier: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error fetching agent", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
