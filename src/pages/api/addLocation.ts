import { verifyToken } from "@/lib/middleware";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
async function addLocationHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method" });
  }
  const { address, city, country, zipCode } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is not provided" });
  }
  if (!city) {
    return res.status(400).json({ error: "City is not provided" });
  }
  if (!country) {
    return res.status(400).json({ error: "Country is not provided" });
  }
  if (!zipCode) {
    return res.status(400).json({ error: "ZipCode is not provided" });
  }
  try {
    const location = await prisma.location.create({
      data: {
        address: address,
        city: city,
        country: country,
        zipCode: zipCode,
      },
    });
    res.status(201).json({ message: "Location Added sucessfully", location });
  } catch (error) {
    console.error("Error creating location", error);
    res.status(500).json({ error: "Internal Server error" });
  } finally {
    prisma.$disconnect;
  }
}

export default function addLocationAuthenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => addLocationHandler(req, res));
}
