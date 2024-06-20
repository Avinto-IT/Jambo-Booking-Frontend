const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createHotel() {
  const hotel = await prisma.hotel.create({
    data: {
      name: "Deja Vu", // Replace with the desired hotel name
      address: "Durbarmarg, Kathmandu, Nepal", // Replace with the desired address
      locationID: "60d5ec4f2f8fb814c69b6999", // Replace with the actual location ID
      amenities: {
        wifi: true,
        pool: true,
        gym: true,
        breakfast: true,
        dinner: true,
      },
      description: "A very cool hotel in the valley", // Replace with the desired description
      houseRules: {
        noSmoking: true,
        noPets: true,
      },
      imageLinks: [
        "https://example.com/imagethird1.jpg",
        "https://example.com/imagethird2.jpg",
      ],
      primaryImageLink: "https://example.com/primaryimagethird.jpg",
      isRunning: false
    },
  });

  console.log("Hotel created:", hotel);
}

createHotel()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
