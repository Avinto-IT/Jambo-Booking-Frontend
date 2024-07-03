import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

import { verifyToken } from "@/lib/middleware";

async function updatePasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid request method." });
  }

  const { email, currentPassword, newPassword } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }
  if (!currentPassword) {
    return res.status(400).json({ error: "Missing old password" });
  }
  if (!newPassword) {
    return res.status(400).json({ error: "Missing new password" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Could not find the user with this email" });
    }

    const isOldPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isOldPasswordValid) {
      return res.status(400).json({ error: "Invalid current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.status(200).json({ message: "Password updated sucessfully" });
  } catch (error) {
    console.error("Error updating password", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default function authenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => updatePasswordHandler(req, res));
}
