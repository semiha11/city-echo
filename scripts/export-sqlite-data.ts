import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting data export from SQLite...');

    // Fetch all data with relations where necessary to preserve structure
    // Note: For simple migration, we fetch raw data. 
    // Relational integrity will be handled by the seed script importing in correct order.

    const users = await prisma.user.findMany();
    console.log(`Fetched ${users.length} users.`);

    const places = await prisma.place.findMany({
        include: {
            images: true
        }
    });
    console.log(`Fetched ${places.length} places.`);

    const reviews = await prisma.review.findMany({
        include: {
            images: true
        }
    });
    console.log(`Fetched ${reviews.length} reviews.`);

    const favorites = await prisma.favorite.findMany();
    console.log(`Fetched ${favorites.length} favorites.`);

    const data = {
        users,
        places,
        reviews,
        favorites
    };

    const outputPath = path.join(process.cwd(), 'seed-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✅ Data successfully exported to ${outputPath}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
