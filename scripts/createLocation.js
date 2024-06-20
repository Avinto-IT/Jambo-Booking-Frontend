const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createHotel() {
  const location = await prisma.location.create({
    data: {
      city:"Moscow",
      country:"Russia"
    },
  });

  console.log("Hotel created:", location);
}

createHotel()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
