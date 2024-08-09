import { NextApiResponse, NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";
import { isWithinInterval } from "date-fns";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
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
