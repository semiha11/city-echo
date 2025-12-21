import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to normalize Turkish characters for English-keyboard matching
// e.g., "Anıtkabir" -> "anitkabir", "Şişli" -> "sisli"
const normalizeTurkish = (text: string) => {
    return text
        .replace(/İ/g, 'i')
        .replace(/I/g, 'i')
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ cities: [], places: [], categories: [] });
        }

        const normalizedQuery = normalizeTurkish(query);

        // Fetch ALL approved places (lightweight select)
        // Since SQLite/Prisma limitations on specific collation/insensitive/fuzzy,
        // and assuming dataset < 1000 items, in-memory filtering is most robust for "English keyboard" support.
        const allPlaces = await prisma.place.findMany({
            where: { isApproved: true },
            select: {
                id: true,
                title: true,
                category: true,
                city: true
            }
        });

        // Filter in memory
        const matches = allPlaces.filter(place => {
            const tTitle = normalizeTurkish(place.title);
            const tCity = normalizeTurkish(place.city);
            const tCat = normalizeTurkish(place.category);

            return tTitle.includes(normalizedQuery) ||
                tCity.includes(normalizedQuery) ||
                tCat.includes(normalizedQuery);
        });

        // 1. Exact Cities
        const cities = Array.from(new Set(
            matches
                .filter(p => normalizeTurkish(p.city).includes(normalizedQuery))
                .map(p => p.city)
        )).slice(0, 3);

        // 2. Categories
        const categories = Array.from(new Set(
            matches
                .filter(p => normalizeTurkish(p.category).includes(normalizedQuery))
                .map(p => p.category)
        )).slice(0, 3);

        // 3. Places (Titles)
        const places = matches
            .filter(p => normalizeTurkish(p.title).includes(normalizedQuery))
            .slice(0, 5);

        return NextResponse.json({
            cities,
            categories,
            places
        });

    } catch (error) {
        console.error('Search suggestion error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
