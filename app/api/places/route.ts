import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { PlaceCategory } from '@/types';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const query = searchParams.get('q'); // General search

    const whereClause: any = {};

    if (city) {
        whereClause.city = { contains: city, mode: 'insensitive' };
    }

    if (category) {
        // Validate category if needed, or rely on Prisma to throw/ignore
        // Cast to PlaceCategory if it matches
        if (Object.values(PlaceCategory).includes(category as PlaceCategory)) {
            whereClause.category = category as string;
        }
    }

    if (query) {
        whereClause.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
        ]
    }

    try {
        const places = await prisma.place.findMany({
            where: whereClause,
            include: {
                user: { select: { username: true } },
                reviews: { select: { rating: true } },
                _count: { select: { reviews: true } },
                images: { select: { url: true } } // Include images
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    try {
        const {
            title, category, description, city, district, address, latitude, longitude, images, // Changed from image_url
            priceRange, breakfast, lunch, dinner, dessert, snack,
            // New Fields
            veganOption, outdoorSeating,
            isPaid, entranceFee, museumCardAccepted, photography,
            largeArea, petFriendly, playground, freeEntry,
            parking, wifi, pool, gym, noiseLevel, foodCourt, babyCare,
            // New Fields
            isFamilyFriendly, hasSmokingArea, alcoholStatus,
            // Activity & Nightlife
            duration, reservationRequired, bestTime,
            damAllowed, musicType, editorNote
        } = await req.json();

        // Validation (basic)
        if (!title || !category || !city || !district) {
            return NextResponse.json({ error: 'Missing required fields (Name, Category, City, District)' }, { status: 400 });
        }

        const place = await prisma.place.create({
            data: {
                title,
                category,
                description: description || null,
                city,
                district,
                address: address || null,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                // Create image relations from array of URLs
                images: {
                    create: (images as string[] || []).map(url => ({ url }))
                },
                user_id: userId,
                // Food Fields
                priceRange: priceRange || null,
                breakfast: Boolean(breakfast),
                lunch: Boolean(lunch),
                dinner: Boolean(dinner),
                dessert: Boolean(dessert),
                snack: Boolean(snack),
                veganOption: Boolean(veganOption),
                outdoorSeating: Boolean(outdoorSeating),
                // Visit Fields
                isPaid: Boolean(isPaid),
                entranceFee: entranceFee || null,
                museumCardAccepted: Boolean(museumCardAccepted),
                photography: Boolean(photography),
                // Park Fields
                largeArea: Boolean(largeArea),
                petFriendly: Boolean(petFriendly),
                playground: Boolean(playground),
                freeEntry: Boolean(freeEntry),
                // Hotel/Mall Fields
                parking: Boolean(parking),
                wifi: Boolean(wifi),
                pool: Boolean(pool),
                gym: Boolean(gym),
                noiseLevel: noiseLevel || null,
                foodCourt: Boolean(foodCourt),
                babyCare: Boolean(babyCare),
                // New Features
                isFamilyFriendly: Boolean(isFamilyFriendly),
                hasSmokingArea: Boolean(hasSmokingArea),
                alcoholStatus: alcoholStatus || null,
                // New Category Fields
                duration: duration || null,
                reservationRequired: Boolean(reservationRequired),
                bestTime: bestTime || null,
                damAllowed: Boolean(damAllowed),
                musicType: musicType || null,
                editorNote: editorNote || null
            },
            include: { images: true } // Return created images
        });

        return NextResponse.json(place, { status: 201 });

    } catch (error) {
        console.error('Error creating place:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
