const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Destinations...");

    // Clear existing to prevent conflicts with new schema
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.destination.deleteMany();

    await prisma.destination.createMany({
        data: [
            {
                name: "Goa Beach Resort",
                location: "North Goa, Goa",
                category: "BEACH",
                description: "A premium beachfront property perfect for relaxing with ocean views and vibrant nightlife.",
                imagePath: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
                basePrice: 5000,
                originalPrice: 7500,
                rating: 4.6,
                amenities: ["Free WiFi", "Swimming Pool", "Beachfront", "Bar"]
            },
            {
                name: "Manali Snow Cabin",
                location: "Manali, Himachal Pradesh",
                category: "MOUNTAIN",
                description: "Cozy wooden cabin surrounded by snow-capped mountains and pine forests.",
                imagePath: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
                basePrice: 8500,
                rating: 4.8,
                amenities: ["Free WiFi", "Heater", "Bonfire", "Mountain View"]
            },
            {
                name: "Alleppey Houseboat",
                location: "Alleppey, Kerala",
                category: "BACKWATERS",
                description: "Experience the serene backwaters of Kerala on a luxury traditional houseboat.",
                imagePath: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
                basePrice: 12000,
                originalPrice: 15000,
                rating: 4.9,
                amenities: ["All Meals Included", "AC", "Private Deck", "Lake View"]
            },
            {
                name: "Taj Lake Palace",
                location: "Udaipur, Rajasthan",
                category: "HERITAGE",
                description: "Live like royalty in this historic 18th-century palace floating on Lake Pichola.",
                imagePath: "https://images.unsplash.com/photo-1598977123118-4e50bb6c469f?w=800&q=80",
                basePrice: 25000,
                rating: 5.0,
                amenities: ["Free WiFi", "Spa", "Fine Dining", "Lake View"]
            },
            {
                name: "Ranthambore Jungle Lodge",
                location: "Sawai Madhopur, Rajasthan",
                category: "WILDLIFE",
                description: "Luxury tents situated on the edge of Ranthambore Tiger Reserve for the ultimate safari.",
                imagePath: "https://images.unsplash.com/photo-1548681528-7a5ae01fb33b?w=800&q=80",
                basePrice: 14000,
                originalPrice: 18000,
                rating: 4.7,
                amenities: ["Safari Tour", "Pool", "AC", "Bonfire"]
            },
            {
                name: "Munnar Tea Estate Stay",
                location: "Munnar, Kerala",
                category: "HILL_STATION",
                description: "Awake to the scent of fresh tea leaves in this pristine colonial-era bungalow.",
                imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Munnar_hill_station.jpg/800px-Munnar_hill_station.jpg",
                basePrice: 6500,
                rating: 4.5,
                amenities: ["Free Breakfast", "Tea Tasting", "Balcony", "Free WiFi"]
            },
            {
                name: "Rishikesh Yoga Retreat",
                location: "Rishikesh, Uttarakhand",
                category: "MOUNTAIN",
                description: "Find inner peace along the Ganges with daily yoga sessions and wellness dining.",
                imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Laxman_Jhula%2C_Rishikesh.jpg/800px-Laxman_Jhula%2C_Rishikesh.jpg",
                basePrice: 4000,
                originalPrice: 5500,
                rating: 4.4,
                amenities: ["Yoga Classes", "Spa", "Vegan Meals", "River View"]
            },
            {
                name: "Hampi Stone Villas",
                location: "Hampi, Karnataka",
                category: "HERITAGE",
                description: "Boutique stay nestled uniquely among the ancient boulder-strewn ruins of Vijayanagara.",
                imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Virupaksha_Temple%2C_Hampi.jpg/800px-Virupaksha_Temple%2C_Hampi.jpg",
                basePrice: 4800,
                rating: 4.3,
                amenities: ["Free WiFi", "Bicycle Rental", "AC", "Local Tours"]
            },
            {
                name: "Kaziranga Eco Camp",
                location: "Kaziranga, Assam",
                category: "WILDLIFE",
                description: "Eco-friendly cottage stay perfect for spotting the famous One-Horned Rhinoceros.",
                imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Indian_Rhinoceros.jpg/800px-Indian_Rhinoceros.jpg",
                basePrice: 5500,
                rating: 4.6,
                amenities: ["Jeep Safari", "Restaurant", "Free Parking", "Nature Walk"]
            },
            {
                name: "Andaman Sea Villa",
                location: "Havelock Island, Andaman",
                category: "BEACH",
                description: "Idyllic private villa with direct access to the white sands of Radhanagar beach.",
                imagePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Radhanagar_Beach%2C_Havelock_Island.jpg/800px-Radhanagar_Beach%2C_Havelock_Island.jpg",
                basePrice: 18000,
                originalPrice: 22000,
                rating: 4.9,
                amenities: ["Private Pool", "Scuba Diving", "Free WiFi", "Beachfront"]
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
