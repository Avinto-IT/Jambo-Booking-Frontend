import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/middleware";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASSWORD;

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

async function updateBookingStatusHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    bookingID,
    newStatus,
    bookingRemarks,
    bookingStartDate,
    bookingEndDate,
    bookingInformation,
    totalAmount,
    hotelName,
  } = req.body;

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
      data: { status: newStatus, bookingRemarks },
    });

    const booking = await prisma.booking.findUnique({
      where: { bookingID },
      include: {
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const agentEmail = "jambobooking2024@gmail.com";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZoneName: "short",
    };
    const startDate = new Date(bookingStartDate).toLocaleDateString(
      "en-US",
      options
    );
    const endDate = new Date(bookingEndDate).toLocaleDateString(
      "en-US",
      options
    );
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border:8px;">
        <h1 style="text-align: center;">Booking Status Update</h1>
        <p>Your booking status has been updated to: <strong>${newStatus}</strong></p>
        <p>Remarks: ${bookingRemarks}</p>

        <h2>Booking Details</h2>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>End Date:</strong> ${endDate}</p>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>

        <h2>Room Information</h2>
        ${bookingInformation
          .map(
            (room: any) => `
          <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
            <p><strong>Room Type:</strong> ${room.roomType}</p>
            <p><strong>Number of Rooms:</strong> ${room.rooms}</p>
            <p><strong>Total Price:</strong> $${room.totalRoomPrice}</p>
            <p><strong>Beds:</strong></p>
            <ul>
              ${room.beds
                .map(
                  (bed: any) => `
                <li>${bed.numberOfBeds} ${bed.bedType}</li>
              `
                )
                .join("")}
            </ul>
            <p><strong>Room Capacity:</strong> ${room.roomCapacity} Guests</p>
            <p><strong>Room Price:</strong> $${room.roomPrice}</p>
          </div>
        `
          )
          .join("")}

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://your-booking-app-link.com" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Booking</a>
        </div>
      </div>
    `;
    try {
      await sendEmail(agentEmail, "Booking Status Update", emailHtml);
    } catch (emailError) {
      return res
        .status(500)
        .json({ error: "Booking status updated but failed to send email" });
    }

    return res.status(200).json({
      message: "Booking status updated successfully and mail has been sent.",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

export default function authenticationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  verifyToken(req, res, () => updateBookingStatusHandler(req, res));
}
