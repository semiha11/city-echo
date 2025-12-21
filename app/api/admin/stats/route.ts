import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const [totalPlaces, pendingPlaces, totalUsers] = await Promise.all([
            prisma.place.count(),
            prisma.place.count({ where: { isApproved: false } }),
            prisma.user.count(),
        ]);

        return NextResponse.json({
            totalPlaces,
            pendingPlaces,
            totalUsers
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
