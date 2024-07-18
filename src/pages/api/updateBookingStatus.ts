import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
console.log(SECRET_KEY);
async function UpdateBookingStatusHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingID, newStatus } = req.body;

  if (!bookingID || !newStatus) {
    return res.status(400).json({ error: "Missing bookingID or newStatus" });
  }

  try {
    // Validate admin email
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
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string };

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You do not have permission to perform this action" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingID },
      data: { status: newStatus },
    });

    return res
      .status(200)
      .json({ message: "Booking status updated successfully", updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

export default UpdateBookingStatusHandler;
