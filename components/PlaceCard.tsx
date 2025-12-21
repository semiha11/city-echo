"use client";

import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import FavoriteButton with no SSR to avoid hydration mismatch
const FavoriteButton = dynamic(() => import('./FavoriteButton'), {
    ssr: false,
    loading: () => <div className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md" />
});

interface Place {
    id: string;
    title: string;
    category: string;
    city: string;
    images?: { url: string }[];
    image_url?: string | null; // Keep for legacy or fallback
    reviews: { rating: number }[];
    _count: { reviews: number };
    isCheckFavorite?: boolean;
    priceRange?: string | null;
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
    dessert?: boolean;
    snack?: boolean;
    created_at?: string | Date; // Serialized date or Date object
    // New Fields
    blueFlag?: boolean;
    sunbed?: boolean;
    shower?: boolean;
    tentRental?: boolean;
    electricity?: boolean;
    fireAllowed?: boolean;
    caravanAccess?: boolean;
    museumCardAccepted?: boolean;
    isPaid?: boolean;
    petFriendly?: boolean;
    playground?: boolean;
}

export default function PlaceCard({ place }: { place: Place }) {
    const averageRating = place.reviews.length > 0
        ? place.reviews.reduce((acc, review) => acc + review.rating, 0) / place.reviews.length
        : 0;

    return (
        <div className="group block relative h-full">
            {/* Absolute positioned button outside the link to prevent navigation when clicking favorite */}
            <div
                className="absolute top-3 right-3 z-10"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <FavoriteButton placeId={place.id} initialIsFavorite={place.isCheckFavorite} className="bg-white/90 shadow-sm backdrop-blur-md" />
            </div>
            <Link href={`/places/${place.id}`} className="block h-full">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">

                        {(() => {
                            const images = place.images || [];
                            const mainImage = images.length > 0 ? images[0].url : (place as any).image_url;

                            return mainImage ? (
                                <>
                                    <img
                                        src={mainImage}
                                        alt={place.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Carousel Dots Indicator */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                            {images.slice(0, 4).map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full shadow-sm backdrop-blur-md ${idx === 0 ? 'bg-white scale-125' : 'bg-white/60'}`}
                                                />
                                            ))}
                                            {images.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm backdrop-blur-md" />}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">
                                    <MapPin className="h-12 w-12" />
                                </div>
                            );
                        })()}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                            {place.category}
                        </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-[var(--color-sunset-orange)] transition-colors">{place.title}</h3>
                            <div className="flex items-center gap-1 shrink-0">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
                            </div>
                        </div>

                        {/* Price Range */}
                        {place.priceRange && (
                            <div className="text-sm font-medium text-[var(--color-sunset-orange)] mb-2">
                                {place.priceRange === 'CHEAP' && '₺'}
                                {place.priceRange === 'MODERATE' && '₺₺'}
                                {place.priceRange === 'EXPENSIVE' && '₺₺₺'}
                                {place.priceRange === 'VERY_EXPENSIVE' && '₺₺₺₺'}
                            </div>
                        )}

                        <div className="flex items-center text-gray-500 text-sm mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {place.city}
                        </div>

                        {/* Spacer to push content down if needed, or just flex-1 above handles it */}
                        <div className="mt-auto pt-2">
                            <div className="flex flex-wrap gap-1">
                                {['RESTAURANT', 'CAFE'].includes(place.category) && (
                                    <>
                                        {place.breakfast && <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">Kahvaltı</span>}
                                        {place.lunch && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">Öğle</span>}
                                        {place.dinner && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">Akşam</span>}
                                    </>
                                )}

                                {/* Beach */}
                                {place.category === 'BEACH' && (
                                    <>
                                        {place.blueFlag && <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-xs rounded-full font-medium">Mavi Bayrak</span>}
                                        {place.sunbed && <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-xs rounded-full font-medium">Şezlong</span>}
                                    </>
                                )}

                                {/* Camping */}
                                {place.category === 'CAMPING' && (
                                    <>
                                        {place.tentRental && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-full font-medium">Çadır</span>}
                                        {place.caravanAccess && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs rounded-full font-medium">Karavan</span>}
                                    </>
                                )}

                                {/* Others */}
                                {['MUSEUM', 'OTHER'].includes(place.category) && (
                                    <>
                                        {place.museumCardAccepted && <span className="px-2 py-0.5 bg-pink-50 text-pink-600 text-xs rounded-full font-medium">Müze Kart</span>}
                                    </>
                                )}
                                {place.petFriendly && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">Evcil Hayvan</span>}
                            </div>

                            {/* New Badges Section (Req: Orange/Navy, Max 3) */}
                            {(() => {
                                const badges = [];

                                if ((place as any).isFamilyFriendly) badges.push({ icon: '👨‍👩‍👧‍👦', label: 'Aileye Uygun', color: 'text-[#1B263B] bg-orange-100 border-orange-200' });
                                if ((place as any).alcoholStatus === 'NONE') badges.push({ icon: '🥤', label: 'Alkolsüz', color: 'text-[#1B263B] bg-green-100 border-green-200' });
                                if ((place as any).alcoholStatus === 'ALCOHOLIC') badges.push({ icon: '🍷', label: 'Alkollü', color: 'text-[#1B263B] bg-indigo-100 border-indigo-200' });
                                if ((place as any).alcoholStatus === 'BOTH') badges.push({ icon: '🍹', label: 'Alkol Var', color: 'text-[#1B263B] bg-indigo-100 border-indigo-200' });
                                if ((place as any).hasSmokingArea) badges.push({ icon: '🚬', label: 'Sigara Alanı', color: 'text-[#1B263B] bg-gray-100 border-gray-200' });

                                // Fallback important ones if we need to fill space (only if < 3 new ones)
                                if (badges.length < 3 && (place as any).parking) badges.push({ icon: '🅿️', label: 'Otopark', color: 'text-[#1B263B] bg-blue-50 border-blue-100' });
                                if (badges.length < 3 && (place as any).wifi) badges.push({ icon: '📶', label: 'Wi-Fi', color: 'text-[#1B263B] bg-blue-50 border-blue-100' });

                                if (badges.length === 0) return null;

                                return (
                                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-dashed border-gray-100">
                                        {badges.slice(0, 3).map((badge, i) => (
                                            <span key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badge.color}`}>
                                                <span>{badge.icon}</span>
                                                {badge.label}
                                            </span>
                                        ))}
                                        {badges.length > 3 && (
                                            <span className="text-[10px] text-gray-400 self-center">+{badges.length - 3}</span>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
