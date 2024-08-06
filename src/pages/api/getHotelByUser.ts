import { NextApiResponse, NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getHotelByUserHandler(
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
    const hotels = await prisma.hotel.findMany({
      where: {
        userID: idFromQuery,
      },
    });
    res.status(200).json({ hotels });
  } catch (error) {
    console.log("Error fetching hotels", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
