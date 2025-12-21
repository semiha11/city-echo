import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getPlaces() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const placesRaw = await prisma.place.findMany({
        where: {
            isApproved: true
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                }
            },
            reviews: {
                select: {
                    rating: true
                }
            },
            _count: {
                select: {
                    reviews: true
                }
            },
            // Check if favorited by current user
            ...(userId ? {
                favorites: {
                    where: { userId: userId },
                    select: { id: true }
                }
            } : {}),
            images: {
                select: { url: true }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    // Transform to include isCheckFavorite flat boolean and stringify dates
    return placesRaw.map(place => ({
        ...place,
        created_at: place.created_at.toISOString(),
        isCheckFavorite: userId ? (place.favorites && place.favorites.length > 0) : false
    }));
}
