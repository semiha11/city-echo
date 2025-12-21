import { prisma } from '@/lib/prisma';
import AddReviewForm from '@/components/AddReviewForm';
import { notFound } from 'next/navigation';
import { MapPin, Star, User } from 'lucide-react';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import FavoriteButton from '@/components/FavoriteButton';
import ImageGallery from '@/components/ImageGallery';

import CommentForm from '@/components/CommentForm';
import ReviewItem from '@/components/ReviewItem';

import { Prisma } from '@prisma/client';

type PlaceWithRelations = Prisma.PlaceGetPayload<{
    include: {
        user: { select: { name: true, image: true } },
        images: { select: { url: true } },
        reviews: {
            include: {
                user: { select: { name: true, image: true } },
                images: { select: { url: true } }
            }
        },
        favorites: { select: { id: true } }
    }
}>;

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Force Prisma Client refresh
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    let place: PlaceWithRelations | null = null;
    try {
        // Attempt 1: Try to fetch WITH review images (Standard flow)
        place = await prisma.place.findUnique({
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
                        user: { select: { name: true, image: true } },
                        images: { select: { url: true } }
                    },
                    orderBy: { created_at: 'desc' }
                },
                favorites: userId ? {
                    where: { userId: userId },
                    select: { id: true }
                } : undefined
            }
        });
    } catch (error) {
        console.warn("Fetching place with review images failed. Retrying without review images...", error);

        // Attempt 2: Fallback - Fetch WITHOUT review images
        place = await prisma.place.findUnique({
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
                        user: { select: { name: true, image: true } },
                        // images excluded
                    },
                    orderBy: { created_at: 'desc' }
                },
                favorites: userId ? {
                    where: { userId: userId },
                    select: { id: true }
                } : undefined
            }
        }) as PlaceWithRelations | null;
    }

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
                        {place.isFamilyFriendly && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-orange-100 border border-orange-200">
                                👨‍👩‍👧‍👦 Aileye Uygun
                            </span>
                        )}
                        {place.hasSmokingArea && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-gray-100 border border-gray-200">
                                🚬 Sigara Alanı
                            </span>
                        )}
                        {place.alcoholStatus === 'NONE' && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-green-100 border border-green-200">
                                🥤 Alkolsüz
                            </span>
                        )}
                        {place.alcoholStatus === 'ALCOHOLIC' && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1B263B] bg-indigo-100 border border-indigo-200">
                                🍷 Alkollü
                            </span>
                        )}
                        {place.alcoholStatus === 'BOTH' && (
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

                    {/* User Recommendation */}
                    {place.editorNote && (
                        <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Star className="w-24 h-24 text-orange-500" />
                            </div>
                            <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                                <span className="text-2xl">📝</span> Kullanıcı Tavsiyesi
                            </h3>
                            <p className="text-orange-800 font-medium italic text-lg leading-relaxed">
                                "{place.editorNote}"
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-sm text-orange-700">
                                <User className="w-4 h-4" />
                                <span>{place.user.name} öneriyor</span>
                            </div>
                        </div>
                    )}

                    {/* Activity Info */}
                    {place.category === 'ACTIVITY' && (
                        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 shadow-sm">
                            <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                                ✨ Aktivite Detayları
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {place.duration && (
                                    <div className="bg-white p-3 rounded-lg border border-yellow-100">
                                        <p className="text-xs text-yellow-600 font-bold uppercase mb-1">Süre</p>
                                        <p className="font-semibold text-gray-900">{place.duration}</p>
                                    </div>
                                )}
                                {place.bestTime && (
                                    <div className="bg-white p-3 rounded-lg border border-yellow-100">
                                        <p className="text-xs text-yellow-600 font-bold uppercase mb-1">En İyi Zaman</p>
                                        <p className="font-semibold text-gray-900">{place.bestTime}</p>
                                    </div>
                                )}
                                {place.reservationRequired && (
                                    <div className="bg-white p-3 rounded-lg border border-yellow-100 col-span-2 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <p className="font-semibold text-red-600">Rezervasyon Gerekli</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Nightlife Info */}
                    {['BAR', 'CLUB'].includes(place.category) && (
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                            <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                                🎵 Gece Hayatı Bilgileri
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {place.musicType && (
                                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                                        <p className="text-xs text-purple-600 font-bold uppercase mb-1">Müzik Türü</p>
                                        <p className="font-semibold text-gray-900">{place.musicType}</p>
                                    </div>
                                )}
                                <div className="bg-white p-3 rounded-lg border border-purple-100">
                                    <p className="text-xs text-purple-600 font-bold uppercase mb-1">Damsız Giriş</p>
                                    <p className={`font-semibold ${place.damAllowed ? 'text-green-600' : 'text-red-600'}`}>
                                        {place.damAllowed ? 'Uygun ✅' : 'Girilmez ⛔'}
                                    </p>
                                </div>
                                {place.isPaid && place.entranceFee && (
                                    <div className="bg-white p-3 rounded-lg border border-purple-100 col-span-2">
                                        <p className="text-xs text-purple-600 font-bold uppercase mb-1">Giriş Ücreti</p>
                                        <p className="font-semibold text-gray-900">{place.entranceFee}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                    <div id="reviews" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Reviews
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{place.reviews.length}</span>
                        </h2>

                        {/* Add Review Form moved to sidebar */}

                        <div className="space-y-6">
                            {place.reviews.map((review) => (
                                <ReviewItem
                                    key={review.id}
                                    review={review}
                                    currentUserId={userId}
                                />
                            ))}
                            {place.reviews.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="mx-auto h-12 w-12 text-gray-300 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No reviews yet.</p>
                                    <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        {/* New Sidebar Review Form */}
                        {session ? (
                            <CommentForm placeId={place.id} />
                        ) : (
                            <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-6 text-center shadow-sm">
                                <Star className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">Deneyiminizi Paylaşın</h3>
                                <p className="text-sm text-gray-600 mb-4">Bu mekan hakkında ne düşünüyorsunuz? Yorum yapmak için giriş yapın.</p>
                                <a href="/login" className="block w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
                                    Giriş Yap
                                </a>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
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
