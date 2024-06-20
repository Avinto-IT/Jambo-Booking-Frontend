const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createHotel() {
  const hotel = await prisma.hotel.create({
    data: {
      name: "Dummy", // Replace with the desired hotel name
      address: "Dummy, Kathmandu, Nepal", // Replace with the desired address
      locationID: "60d5ec4f2f8fb814c69b611c", // Replace with the actual location ID
      amenities: {
        wifi: true,
        pool: true,
        gym: true,
        breakfast: true,
        dinner: true,
      },
    
      description: "A very cool hotel in the center", // Replace with the desired description
      houseRules: {
        noSmoking: true,
        noPets: true,
      },
      imageLinks: [
        "https://example.com/image11.jpg",
        "https://example.com/image12.jpg",
      ],
      primaryImageLink: "https://example.com/primaryimage111.jpg",
      isRunning: true,
      rooms:{
        simple: {
          facility:{
            iron: true,
            fridge: true,
            balcony: true,
          },
          capacity:"6",
          bed:{
           bedType:"single",
           numberOfBeds:"1"
          }
      },
      deluxe: {

      },
      super: {

      },
      }
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
