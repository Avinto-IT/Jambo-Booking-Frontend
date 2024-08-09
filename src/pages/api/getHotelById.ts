import { NextApiResponse, NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";
import { isWithinInterval } from "date-fns";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

export default async function getHotelByIdHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Id not provided in the params" });
  }
  const idFromQuery = Array.isArray(id) ? id[0] : id;

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
    const hotel = await prisma.hotel.findUnique({
      where: {
        hotelID: idFromQuery,
      },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const today = new Date();

    if (hotel.discount) {
      const { startDate, endDate } = hotel.discount as {
        startDate: string;
        endDate: string;
      };

      const isInDiscountPeriod = isWithinInterval(today, {
        start: new Date(startDate),
        end: new Date(endDate),
      });

      // Exclude the discount if today is not within the range
      if (!isInDiscountPeriod) {
        hotel.discount = {
          startDate: null,
          endDate: null,
          discountPercentage: 0,
        };
      }
    }
    const rooms = hotel.rooms as Array<{
      type: string;
      price: number;
    }>;

    hotel.rooms = rooms.map((room) => ({
      ...room,
      price: room.price * priceModifier,
    }));

    res.status(200).json({ hotel });
  } catch (error) {
    console.log("Error fetching hotels", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
