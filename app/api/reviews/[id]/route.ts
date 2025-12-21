import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const userRole = (session.user as any).role; // Assuming role is in session, otherwise fetch user

    try {
        const review = await prisma.review.findUnique({
            where: { id },
            select: { user_id: true }
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // Check ownership or admin role
        if (review.user_id !== userId && userRole !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.review.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete review", error);
        return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const body = await req.json();
    const { rating, comment_text } = body;

    if (!rating || !comment_text) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const review = await prisma.review.findUnique({
            where: { id },
            select: { user_id: true }
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        if (review.user_id !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                rating: parseInt(rating),
                comment_text: comment_text,
                // Images update logic can be added later if needed, complex with current state
            }
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error("Failed to update review", error);
        return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }
}
