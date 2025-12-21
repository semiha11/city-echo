import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Security Check: Only Admin
        if (!session || (session.user as any).role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                created_at: true,
                _count: {
                    select: {
                        places: true,
                        reviews: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("[ADMIN_USERS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
