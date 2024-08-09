import { NextApiResponse, NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";
import { isWithinInterval } from "date-fns";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    let priceModifier = 1.0; // Default modifier is 1.0, meaning no discount

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (!SECRET_KEY) {
        return res
          .status(500)
          .json({ error: "Internal server error: SECRET_KEY is not set" });
      }
      try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userID: string };
        const user = await prisma.user.findUnique({
          where: { userID: decoded.userID },
          include: { grade: true },
        });

        if (user) {
          priceModifier = user.grade?.priceModifier
            ? 1 - parseFloat(user.grade.priceModifier) / 100
            : 1.0; // Calculate the modifier based on user's grade
        }
      } catch (error) {
        console.log("Error verifying token:", error);
        // Proceed with base price if token verification fails
      }
    }
    const hotels = await prisma.hotel.findMany({
      include: {
        user: true,
      },
    });
    const today = new Date();
    const hotelsWithConditionalDiscount = hotels.map((hotel) => {
      let hotelData = { ...hotel };

      // Check if discount object exists and today's date is within the discount range
      if (hotel.discount) {
        const { startDate, endDate } = hotel.discount as {
          startDate: string;
          endDate: string;
        };

        const isInDiscountPeriod = isWithinInterval(today, {
          start: new Date(startDate),
          end: new Date(endDate),
        });

        // Include discount only if today is within the range
        if (!isInDiscountPeriod) {
          hotelData = { ...hotelData, discount: null };
        }
      }

      const rooms = hotelData.rooms as Array<{
        type: string;
        price: number;
      }>;
      hotelData.rooms = rooms.map((room) => ({
        ...room,
        price: room.price * priceModifier,
      }));

      return hotelData;
    });
    res.status(200).json({ hotels: hotelsWithConditionalDiscount });
  } catch (error) {
    console.log("Error fetching hotels", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
