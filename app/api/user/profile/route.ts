import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, bio, city, age, gender, interests, image_url } = await req.json();
        const userId = (session.user as any).id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                city,
                age,
                gender,
                interests, // Expecting a CSV string or stringified JSON from frontend if complex, but here simplistic string
                image: image_url || undefined // Update image only if provided
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                city: true,
                age: true,
                gender: true,
                interests: true
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
