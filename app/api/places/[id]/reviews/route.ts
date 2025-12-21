import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { rating, comment_text, images } = body;

    // Validation
    if (!rating || !comment_text) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const review = await prisma.review.create({
            data: {
                place_id: id,
                user_id: (session.user as any).id,
                rating: parseInt(rating),
                comment_text: comment_text,
                // @ts-ignore
                images: {
                    create: (images || []).map((url: string) => ({ url }))
                }
            },
            include: {
                // @ts-ignore
                images: true
            }
        });
        return NextResponse.json(review);
    } catch (error: any) {
        console.error("Failed to create review (Detailed):", error);
        return NextResponse.json(
            { error: error.message || "Database Error during Review Creation" },
            { status: 500 }
        );
    }
}
