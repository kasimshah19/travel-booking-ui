const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Destinations...");

    await prisma.destination.createMany({
        data: [
            {
                name: "Goa Beach Resort",
                description: "A premium beachfront property to relax with ocean views.",
                imagePath: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80",
                basePrice: 5000,
            },
            {
                name: "Manali Snow Cabin",
                description: "Cozy wooden cabin surrounded by snow-capped mountains.",
                imagePath: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500&q=80",
                basePrice: 8500,
            },
            {
                name: "Kerala Backwaters Houseboat",
                description: "Experience the serene backwaters of Kerala on a luxury houseboat.",
                imagePath: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80",
                basePrice: 12000,
            }
        ],
        skipDuplicates: true
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
