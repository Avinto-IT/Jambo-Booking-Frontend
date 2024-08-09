import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/middleware";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

async function updateHotelDiscountHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hotelID, discountStartDate, discountEndDate, discountPercentage } =
    req.body;

  if (!discountStartDate) {
    return res.status(400).json({ error: "Discount start date is missing" });
  }
  if (!hotelID) {
    return res.status(400).json({ error: "Hotel Id is missing" });
  }
  if (!discountEndDate) {
    return res.status(400).json({ error: "Discount end date is missing" });
  }
  if (!discountPercentage) {
    return res.status(400).json({ error: "Discount percentage is missing" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "You are not authorized to perform this action" });
    }

    const token = authHeader.split(" ")[1];
    if (!SECRET_KEY) {
      return res
        .status(500)
        .json({ error: "Internal server error: SECRET_KEY is not set" });
    }
    const decoded = jwt.verify(token, SECRET_KEY) as { role: "admin" };

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    const hotel = await prisma.hotel.findUnique({
      where: { hotelID: hotelID },
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    const updatedDiscount = {
      startDate: discountStartDate,
      endDate: discountEndDate,
      discountPercentage: discountPercentage,
    };
    // Update the agent's grade
    const updateHotelDiscount = await prisma.hotel.update({
      where: { hotelID },
      data: { discount: updatedDiscount },
    });

    res.status(200).json({
      message: "Hotel discount percentage updated succesfully",
      updateHotelDiscount,
    });
  } catch (error) {
    console.error("Error updating hotel discount percentage:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}

export default function authenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => updateHotelDiscountHandler(req, res));
}
