import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    // Admin check
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';

        const reviews = await prisma.review.findMany({
            where: {
                OR: [
                    { comment_text: { contains: search } }, // Check sqlite 'contains' support usually works or fallback
                    { user: { name: { contains: search } } },
                    { place: { title: { contains: search } } }
                ]
            },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                },
                place: {
                    select: { id: true, title: true }
                },
                images: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
