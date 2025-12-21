import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const city = searchParams.get('city');

    if (!title || !city) {
        return NextResponse.json({ exists: false });
    }

    try {
        const existingPlace = await prisma.place.findFirst({
            where: {
                title: {
                    equals: title,
                    // Case insensitive search would be better for UX, 
                    // but standard SQLite doesn't strictly support mode: 'insensitive' easily without setup.
                    // For now, exact match or reliant on collation. 
                    // Let's assume exact match for the unique constraint logic first.
                },
                city: {
                    equals: city
                }
            },
            select: {
                id: true,
                title: true
            }
        });

        if (existingPlace) {
            return NextResponse.json({
                exists: true,
                placeId: existingPlace.id,
                message: "This place is already registered."
            });
        }

        return NextResponse.json({ exists: false });
    } catch (error) {
        console.error("Error checking place existence:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
