import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const dataPath = path.join(process.cwd(), 'seed-data.json');

async function main() {
    if (!fs.existsSync(dataPath)) {
        console.error("❌ No seed-data.json found. Please run 'npm run export-data' first.");
        process.exit(1);
    }

    console.log("Reading seed data...");
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // 1. Import Users
    console.log(`Importing ${data.users.length} users...`);
    for (const user of data.users) {
        // Handle dates
        const userData = {
            ...user,
            created_at: new Date(user.created_at),
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null
        };

        await prisma.user.upsert({
            where: { id: user.id },
            update: {}, // Don't overwrite if exists
            create: userData
        });
    }

    // 2. Import Places
    console.log(`Importing ${data.places.length} places...`);
    for (const place of data.places) {
        const { images, ...placeData } = place;

        // Ensure format compatibility
        const formattedPlace = {
            ...placeData,
            created_at: new Date(placeData.created_at),
            latitude: placeData.latitude ? parseFloat(placeData.latitude) : null,
            longitude: placeData.longitude ? parseFloat(placeData.longitude) : null,
        };

        // Check if exists to avoid errors on re-run
        const exists = await prisma.place.findUnique({ where: { id: place.id } });
        if (!exists) {
            await prisma.place.create({
                data: {
                    ...formattedPlace,
                    images: {
                        create: (images || []).map((img: any) => ({ url: img.url }))
                    }
                }
            });
        }
    }

    // 3. Import Reviews
    console.log(`Importing ${data.reviews.length} reviews...`);
    for (const review of data.reviews) {
        const { images, ...reviewData } = review;

        const exists = await prisma.review.findUnique({ where: { id: review.id } });
        if (!exists) {
            await prisma.review.create({
                data: {
                    ...reviewData,
                    created_at: new Date(reviewData.created_at),
                    images: {
                        create: (images || []).map((img: any) => ({ url: img.url }))
                    }
                }
            });
        }
    }

    // 4. Import Favorites
    console.log(`Importing ${data.favorites.length} favorites...`);
    for (const fav of data.favorites) {
        const exists = await prisma.favorite.findUnique({
            where: {
                userId_placeId: { userId: fav.userId, placeId: fav.placeId }
            }
        });

        if (!exists) {
            await prisma.favorite.create({
                data: {
                    ...fav,
                    createdAt: new Date(fav.createdAt)
                }
            });
        }
    }

    console.log("✅ Import completed successfully!");
}

main()
    .catch((e) => {
        console.error("Error importing data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
