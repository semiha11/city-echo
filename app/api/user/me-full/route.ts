import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = (session.user as any).id;

        const userData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                places: {
                    orderBy: { created_at: 'desc' }
                },
                reviews: {
                    orderBy: { created_at: 'desc' },
                    // include: { place: true } // Optional: if we want to show which place the review is for
                },
                favorites: {
                    include: {
                        place: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(userData);

    } catch (error) {
        console.error('Error fetching full user data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
