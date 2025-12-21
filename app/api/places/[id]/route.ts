import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const place = await prisma.place.findUnique({ where: { id } });

        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }

        // Allow deletion if Admin OR Owner
        const isAdmin = (session.user as any).role === 'ADMIN';
        const isOwner = place.user_id === (session.user as any).id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.place.delete({ where: { id } });

        revalidatePath('/');
        revalidatePath('/search');
        revalidatePath('/admin/places');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const place = await prisma.place.findUnique({ where: { id } });

        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }

        // Allow update if Admin OR Owner
        const isAdmin = (session.user as any).role === 'ADMIN';
        const isOwner = place.user_id === (session.user as any).id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();

        // Exclude fields that shouldn't be updated directly or handle them carefully
        const {
            title, category, description, city, district,
            priceRange, breakfast, lunch, dinner, dessert, snack,
            entranceFee, museumCardAccepted, photography,
            veganOption, outdoorSeating,
            largeArea, petFriendly, playground, freeEntry,
            parking, wifi, pool, gym, noiseLevel, foodCourt, babyCare,
            isPaid,
            image_url,
            // New Fields
            blueFlag, sunbed, shower,
            tentRental, electricity, fireAllowed, caravanAccess,
            // Cafe/Rest/Mall/Beach features
            isFamilyFriendly, hasSmokingArea, alcoholStatus
        } = body;

        const updatedPlace = await prisma.place.update({
            where: { id },
            data: {
                title, category, description, city, district,
                priceRange,
                breakfast: Boolean(breakfast),
                lunch: Boolean(lunch),
                dinner: Boolean(dinner),
                dessert: Boolean(dessert),
                snack: Boolean(snack),
                veganOption: Boolean(veganOption),
                outdoorSeating: Boolean(outdoorSeating),
                isPaid: Boolean(isPaid),
                entranceFee: entranceFee || null,
                museumCardAccepted: Boolean(museumCardAccepted),
                photography: Boolean(photography),
                largeArea: Boolean(largeArea),
                petFriendly: Boolean(petFriendly),
                playground: Boolean(playground),
                freeEntry: Boolean(freeEntry),
                parking: Boolean(parking),
                wifi: Boolean(wifi),
                pool: Boolean(pool),
                gym: Boolean(gym),
                noiseLevel: noiseLevel || null,
                foodCourt: Boolean(foodCourt),
                babyCare: Boolean(babyCare),
                hasSmokingArea: Boolean(hasSmokingArea),
                alcoholStatus: alcoholStatus || null,
            }
        });

        // Image Sync Logic
        if (body.images && Array.isArray(body.images)) {
            await prisma.$transaction(async (tx) => {
                // 1. Get current images
                const currentImages = await tx.placeImage.findMany({
                    where: { placeId: id },
                    select: { url: true }
                });
                const currentUrls = currentImages.map(img => img.url);
                const newUrls = body.images as string[];

                // 2. Identify images to delete (present in DB but not in new list)
                const urlsToDelete = currentUrls.filter(url => !newUrls.includes(url));
                if (urlsToDelete.length > 0) {
                    await tx.placeImage.deleteMany({
                        where: {
                            placeId: id,
                            url: { in: urlsToDelete }
                        }
                    });
                }

                // 3. Identify images to add (present in new list but not in DB)
                const urlsToAdd = newUrls.filter(url => !currentUrls.includes(url));
                if (urlsToAdd.length > 0) {
                    await tx.placeImage.createMany({
                        data: urlsToAdd.map(url => ({
                            placeId: id,
                            url: url
                        }))
                    });
                }
            });
        }

        revalidatePath('/');
        revalidatePath('/search');
        revalidatePath('/admin/places');

        return NextResponse.json(updatedPlace);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
