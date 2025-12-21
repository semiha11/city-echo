import { prisma } from '@/lib/prisma';
import PlaceCard from '@/components/PlaceCard';
import SearchFilters from '@/components/SearchFilters';
import { PlaceCategory } from '@/types';
import { Suspense } from 'react';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Force dynamic to ensure searchParams are handled correctly and not statically optimized
export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const { city: cityParam, category: categoryParam, q, price, meals } = await searchParams;
    const city = typeof cityParam === 'string' ? cityParam : undefined;
    const category = typeof categoryParam === 'string' ? categoryParam : undefined;
    const query = typeof q === 'string' ? q : undefined;
    const priceRange = typeof price === 'string' && price ? price : undefined;
    const mealOptions = typeof meals === 'string' ? meals.split(',').filter(Boolean) : [];

    const whereClause: any = {};

    if (city) {
        whereClause.city = { contains: city };
    }

    if (category) {
        // Basic validation
        if (Object.values(PlaceCategory).includes(category as PlaceCategory)) {
            whereClause.category = category as string;
        }
    }

    if (priceRange) {
        whereClause.priceRange = priceRange;
    }

    if (mealOptions.length > 0) {
        // For multiple meals, let's require ALL (AND logic) or ANY (OR logic)?
        // Usually boolean attributes are "Must have X".
        // If I select "Breakfast" and "Lunch", the place must provide both.
        // Actually, for "What kind of meal?", maybe OR is better? "I want Breakfast OR Lunch".
        // But usually amenities are AND. "Wifi AND Parking".
        // Let's stick to AND for start as it is stricter/cleaner for checking capabilities.
        // Actually, if I'm searching for places to eat, and I check Breakfast and Dinner, maybe I want a place open for both?
        // Let's do AND.
        mealOptions.forEach(m => {
            // Valid keys only
            if (['breakfast', 'lunch', 'dinner', 'dessert', 'snack'].includes(m)) {
                whereClause[m] = true;
            }
        });
    }

    if (query) {
        whereClause.OR = [
            { title: { contains: query } },
            { description: { contains: query } },
            { city: { contains: query } },
        ];
    }

    const placesRaw = await prisma.place.findMany({
        where: {
            ...whereClause,
            isApproved: true // Only show approved places
        },
        take: 50, // Limit results to prevent browser hang
        include: {
            user: { select: { username: true } },
            reviews: { select: { rating: true } },
            _count: { select: { reviews: true } },
            // If user is logged in, check if they favorited this place
            ...(userId ? {
                favorites: {
                    where: { userId: userId },
                    select: { id: true }
                }
            } : {}),
            images: {
                select: { url: true } // Include images for PlaceCard
            }
        },
        orderBy: { created_at: 'desc' }
    });

    // Transform to add consistent boolean flag
    const places = placesRaw.map(p => ({
        ...p,
        isCheckFavorite: userId ? p.favorites && p.favorites.length > 0 : false
    }));

    // const places: any[] = [];

    // Get counts for sidebar
    const countsRaw = await prisma.place.groupBy({
        by: ['category'],
        _count: { category: true },
        where: { isApproved: true }
    });
    const counts = countsRaw.reduce((acc, curr) => ({ ...acc, [curr.category]: curr._count.category }), {} as Record<string, number>);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full lg:w-1/4 h-fit">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <SearchFilters counts={counts} />
                    </Suspense>
                </aside>

                {/* Results */}
                <div className="w-full lg:w-3/4">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {places.length === 0 ? 'No places found' : `Found ${places.length} places`}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place) => (
                            <PlaceCard key={place.id} place={place} />
                        ))}
                    </div>

                    {places.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
