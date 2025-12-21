"use client";

import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CompactPlaceCardProps {
    place: any;
    className?: string;
}

export default function CompactPlaceCard({ place, className }: CompactPlaceCardProps) {
    // Calculate Rating
    const averageRating = place.reviews && place.reviews.length > 0
        ? place.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / place.reviews.length
        : 0;

    const reviewCount = place._count?.reviews || place.reviews?.length || 0;

    // Get Image
    const images = place.images || [];
    const mainImage = images.length > 0 ? images[0].url : (place as any).image_url;

    return (
        <Link href={`/places/${place.id}`} className={cn("group block h-full", className)}>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                {/* Image Section - Smaller Aspect Ratio */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
                    {mainImage ? (
                        <img
                            src={mainImage}
                            alt={place.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                            <MapPin className="h-8 w-8" />
                        </div>
                    )}

                    {/* Category Overlay */}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-white uppercase tracking-wide">
                        {place.category}
                    </div>

                    {/* Editor Recommendation Badge (Mini) */}
                    {place.editorNote && (
                        <div className="absolute bottom-2 right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                            <Star className="w-3 h-3 fill-white" />
                        </div>
                    )}
                </div>

                {/* Content Section - Compact */}
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-orange-600 transition-colors mb-1">{place.title}</h3>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-gray-700">{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
                            <span className="text-[10px] text-gray-400">({reviewCount})</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
