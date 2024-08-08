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
    const agents = await prisma.user.findMany({
      where: { role: "agent" },
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
        grade: {
          select: {
            priceModifier: true,
          },
        },
      },
    });

    if (agents.length === 0) {
      return res.status(404).json({ message: "No agents found" });
    }

    return res.status(200).json({ agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
