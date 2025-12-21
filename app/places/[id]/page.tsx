import { prisma } from '@/lib/prisma';
import AddReviewForm from '@/components/AddReviewForm';
import { notFound } from 'next/navigation';
import { MapPin, Star, User } from 'lucide-react';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FavoriteButton from '@/components/FavoriteButton';
import ImageGallery from '@/components/ImageGallery';

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const place = await prisma.place.findUnique({
        where: { id },
        include: {
            user: {
                select: { name: true, image: true }
            },
            images: {
                select: { url: true }
            },
            reviews: {
                include: {
                    user: { select: { name: true, image: true } }
                },
                orderBy: { created_at: 'desc' }
            },
            ...(userId ? {
                favorites: {
                    where: { userId: userId },
                    select: { id: true }
                }
            } : {})
        }
    });

    if (!place) {
        notFound();
    }

    const isFavorite = userId ? (place.favorites && place.favorites.length > 0) : false;

    const averageRating = place.reviews.length > 0
        ? place.reviews.reduce((acc, r) => acc + r.rating, 0) / place.reviews.length
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{place.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <span className="flex items-center gap-1 font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full text-sm">
                            {place.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {place.city}, {place.district}
                        </span>
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {averageRating > 0 ? averageRating.toFixed(1) : 'New'} ({place.reviews.length} reviews)
                        </span>
                    </div>

                    {/* Feature Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {(place as any).isFamilyFriendly && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-orange-100 border border-orange-200">
                                👨‍👩‍👧‍👦 Aileye Uygun
                            </span>
                        )}
                        {(place as any).hasSmokingArea && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-gray-100 border border-gray-200">
                                🚬 Sigara Alanı
                            </span>
                        )}
                        {(place as any).alcoholStatus === 'NONE' && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-green-100 border border-green-200">
                                🥤 Alkolsüz
                            </span>
                        )}
                        {(place as any).alcoholStatus === 'ALCOHOLIC' && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-indigo-100 border border-indigo-200">
                                🍷 Alkollü
                            </span>
                        )}
                        {(place as any).alcoholStatus === 'BOTH' && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-indigo-100 border border-indigo-200">
                                🍹 Alkol Var
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <FavoriteButton
                        placeId={place.id}
                        initialIsFavorite={isFavorite}
                        className="bg-white border border-gray-200 shadow-sm p-3 h-12 w-12 hover:bg-gray-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Gallery */}
                    <ImageGallery
                        images={place.images || []}
                        placeTitle={place.title}
                    />

                    {/* Description */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About this place</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {place.description}
                        </p>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                            <p className="text-gray-600 mb-4">{place.address}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium"
                            >
                                <MapPin className="h-5 w-5" />
                                View on Map
                            </a>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                        <div className="space-y-4">
                            {place.reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{review.user.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{review.comment_text}</p>
                                </div>
                            ))}
                            {place.reviews.length === 0 && (
                                <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-24">
                        <AddReviewForm placeId={place.id} />

                        <div className="mt-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Shared by</h3>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-rose-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{place.user.name}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Community Member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
