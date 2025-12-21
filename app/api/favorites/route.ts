import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { placeId } = await req.json();

        if (!placeId) {
            return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
        }

        const userId = (session.user as any).id;

        // Check if favorite exists
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_placeId: {
                    userId,
                    placeId
                }
            }
        });

        if (existingFavorite) {
            // Remove from favorites
            await prisma.favorite.delete({
                where: {
                    id: existingFavorite.id
                }
            });
            return NextResponse.json({ isFavorite: false });
        } else {
            // Add to favorites
            await prisma.favorite.create({
                data: {
                    userId,
                    placeId
                }
            });
            return NextResponse.json({ isFavorite: true });
        }

    } catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
