// scripts/createUser.js

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createUser() {
  const password = "editor123"; // Replace with the desired password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: "editor@booking.com", // Replace with the desired email
      password: hashedPassword,
      username: "editor", // Replace with the desired username
      agencyName: "Cool Booking",
      contactNumber: "1234567890",
      role: "editor",
    },
  });

  console.log("User created:", user);
}

createUser()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
