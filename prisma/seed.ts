import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Clean up existing data to ensure fresh images
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.place.deleteMany();
    // await prisma.user.deleteMany(); // Keep users if possible, or just the demo one

    // 2. Define Users
    const users = [
        {
            email: 'admin@cityecho.com',
            name: 'System Admin',
            username: 'sysadmin',
            password: 'admin123',
            role: 'ADMIN',
            image: 'https://avatar.vercel.sh/sysadmin'
        },
        {
            email: 'semihagokmen@gmail.com',
            name: 'Semiha Gokmen',
            username: 'semiha',
            // User had 'neymar11.', keeping it consistent or resetting. 
            // Better to fetch hash or just reset to known if this is a seed. 
            // I'll assume standardizing to 'neymar11.' for consistency unless specified.
            password: 'neymar11.',
            role: 'USER', // DEMOTED
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
        },
        {
            email: 'semihagokmen2@gmail.com',
            name: 'semiha',
            username: 'semiha2',
            password: 'neymar11.',
            role: 'USER', // DEMOTED
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
        },
        {
            email: 'demo@cityecho.com',
            name: 'City Explorer',
            username: 'cityexplorer',
            password: '123123',
            role: 'USER',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
        }
    ];

    let adminUser;

    for (const u of users) {
        const hash = await bcrypt.hash(u.password, 10);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: u.role,
                // Only update password if needed, but for seed we force it to ensure access
                password_hash: hash
            },
            create: {
                email: u.email,
                name: u.name,
                username: u.username,
                password_hash: hash,
                role: u.role,
                image: u.image,
                city: 'Istanbul'
            }
        });
        console.log(`👤 Processed user: ${u.email} -> ${u.role}`);

        if (u.role === 'ADMIN') adminUser = user;
    }

    if (!adminUser) throw new Error("No admin created!");

    // 3. Seed Places
    // Use Admin for places ownership for better management
    const places = [
        // ANKARA
        {
            title: 'Aspava Şöhretler',
            category: 'RESTAURANT',
            description: 'The legendary Aspava experience in Ankara. Famous for its truncated doner and endless treats. "Soslu soganli kasarli" is a must-try.',
            city: 'Ankara',
            district: 'Cankaya',
            address: 'Esat Cd. No:110, Küçükesat',
            latitude: 39.9142,
            longitude: 32.8664,
            image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800',
            priceRange: 'MODERATE',
            breakfast: false,
            lunch: true,
            dinner: true,
            dessert: true,
            snack: false,
            isApproved: true, // Approved
            user_id: adminUser.id,
        },
        {
            title: 'Anıtkabir',
            category: 'MUSEUM',
            description: 'The mausoleum of Mustafa Kemal Atatürk. A magnificent architectural monument and a place of great historical significance.',
            city: 'Ankara',
            district: 'Cankaya',
            address: 'Anıtkabir, Çankaya',
            latitude: 39.9255,
            longitude: 32.8368,
            image_url: 'https://images.unsplash.com/photo-1596307398186-b4131548858e?auto=format&fit=crop&q=80&w=800',
            priceRange: 'CHEAP',
            breakfast: false,
            lunch: false,
            dinner: false,
            dessert: false,
            snack: false,
            isApproved: true, // Approved
            user_id: adminUser.id,
        },
        {
            title: 'Kuğulu Park',
            category: 'PARK',
            description: 'A small but iconic park in the heart of Tunalı Hilmi Street. Known for its swans and as a meeting point for locals.',
            city: 'Ankara',
            district: 'Cankaya',
            address: 'Kavaklıdere, Tunalı Hilmi Cd.',
            latitude: 39.9038,
            longitude: 32.8608,
            image_url: 'https://images.unsplash.com/photo-1698777176228-569477025807?auto=format&fit=crop&q=80&w=800',
            priceRange: 'CHEAP',
            breakfast: false,
            lunch: false,
            dinner: false,
            dessert: false,
            snack: true,
            isApproved: true, // Approved
            user_id: adminUser.id,
        },

        // ISTANBUL
        {
            title: 'Galata Tower',
            category: 'MUSEUM',
            description: 'One of the highest and oldest towers of Istanbul. Offers a panoramic view of the old town and surroundings.',
            city: 'Istanbul',
            district: 'Beyoglu',
            address: 'Bereketzade, Galata Kulesi',
            latitude: 41.0256,
            longitude: 28.9744,
            image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800',
            priceRange: 'EXPENSIVE',
            breakfast: true,
            lunch: true,
            dinner: true,
            dessert: true,
            snack: false,
            isApproved: true, // Approved
            user_id: adminUser.id,
        },
        {
            title: 'Karaköy Güllüoğlu',
            category: 'CAFE',
            description: 'World-famous baklava shop. The best place to taste traditional Turkish desserts with a view of the Bosphorus.',
            city: 'Istanbul',
            district: 'Karakoy',
            address: 'Kemankeş Karamustafa Paşa, Rıhtım Cd.',
            latitude: 41.0234,
            longitude: 28.9765,
            image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
            priceRange: 'MODERATE',
            breakfast: true,
            lunch: false,
            dinner: false,
            dessert: true,
            snack: true,
            isApproved: true, // Approved
            user_id: adminUser.id,
        },
        {
            title: 'Vogue Restaurant',
            category: 'RESTAURANT',
            description: 'Fine dining with a spectacular view of the Bosphorus. Exceptional sushi and Mediterranean cuisine.',
            city: 'Istanbul',
            district: 'Besiktas',
            address: 'Akaretler, Spor Cd. No:92',
            latitude: 41.0425,
            longitude: 29.0012,
            image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
            priceRange: 'VERY_EXPENSIVE',
            breakfast: false,
            lunch: true,
            dinner: true,
            dessert: true,
            snack: false,
            isApproved: true, // Approved
            user_id: adminUser.id,
        }
    ];

    for (const place of places) {
        await prisma.place.create({ data: place });
        console.log(`📍 Added place: ${place.title}`);
    }

    console.log('✅ Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
