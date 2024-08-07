import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function hotelRegisterHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    agencyName,
    firstName,
    lastName,
    password,
    email,
    contactNumber,
    dateOfBirth,
  } = req.body;
  if (!agencyName) {
    return res.status(400).json({ error: "Agency name is required" });
  }
  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }
  if (!lastName) {
    return res.status(400).json({ error: "Last name is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!contactNumber) {
    return res.status(400).json({ error: "Contact number is required" });
  }
  if (!dateOfBirth) {
    return res.status(400).json({ error: "Date of birth is required" });
  }

  try {
    const emailCheck = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (emailCheck) {
      return res.status(401).json({ error: "The email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        agencyName,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNumber,
        role: "agent", // Hard-coded role value
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    return res.status(200).json({
      message:
        "Your account has been added to the registration queue. You will receive an email when it is successfully registered.",
    });
  } catch (error) {
    console.error("Agent registration error:", error);
    return res.status(500).json({ error: "Agent registration has failed." });
  } finally {
    await prisma.$disconnect();
  }
}
