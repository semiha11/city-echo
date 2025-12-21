import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    try {
        const { rating, comment_text } = await req.json();
        const { id } = await params;
        const placeId = id;

        if (!rating) {
            return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                place_id: placeId,
                user_id: userId,
                rating: parseInt(rating),
                comment_text: comment_text || '',
            }
        });

        return NextResponse.json(review, { status: 201 });

    } catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
