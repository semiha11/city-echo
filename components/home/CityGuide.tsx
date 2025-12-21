"use client";

import { useState, useMemo, useEffect } from 'react';
import CompactPlaceCard from '@/components/CompactPlaceCard';
import { MapPin, Info, Sparkles } from 'lucide-react';

interface CityGuideProps {
    places: any[];
}

export default function CityGuide({ places }: CityGuideProps) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // 1. Filter, Group & Sort Data
    const citiesData = useMemo(() => {
        // Categories to include (Activities/Nightlife)
        const targetCategories = ['MUSEUM', 'PARK', 'BEACH', 'CAMPING', 'BAR', 'CLUB', 'OTHER'];

        // Helper to calculate rating
        const getRating = (p: any) => {
            if (!p.reviews || p.reviews.length === 0) return 0;
            return p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length;
        };

        const getReviewCount = (p: any) => p._count?.reviews || p.reviews?.length || 0;

        // Filter valid places
        const relevantPlaces = places.filter(p => targetCategories.includes(p.category));

        // Group by City
        const groups: Record<string, any[]> = {};
        relevantPlaces.forEach(place => {
            const city = place.city || 'Other';
            if (!groups[city]) groups[city] = [];
            groups[city].push(place);
        });

        // For each city: Sort by Rating -> Review Count, then slice top 10
        Object.keys(groups).forEach(city => {
            groups[city].sort((a, b) => {
                const ratingA = getRating(a);
                const ratingB = getRating(b);
                if (ratingB !== ratingA) return ratingB - ratingA; // Higher rating first
                return getReviewCount(b) - getReviewCount(a); // Then more reviews
            });
            groups[city] = groups[city].slice(0, 10); // Limit to 10
        });

        // Get list of cities sorted by total available places (popularity)
        const cityList = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);

        return { groups, cityList };
    }, [places]);

    // Initialize selected city
    useEffect(() => {
        if (!selectedCity && citiesData.cityList.length > 0) {
            setSelectedCity(citiesData.cityList[0]);
        }
    }, [citiesData.cityList, selectedCity]);

    const currentPlaces = selectedCity ? citiesData.groups[selectedCity] : [];

    if (citiesData.cityList.length === 0) return null;

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto w-full my-8">
            <div className="flex flex-col items-center mb-10 text-center">
                <span className="text-orange-500 font-bold tracking-wider text-xs uppercase mb-2">Editor's Picks</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                    City Bucket List <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </h2>
                <p className="text-gray-500 mt-2 max-w-lg">Discover the highest-rated adventures and hidden gems, curated by travelers.</p>
            </div>

            {/* City Tabs - Horizontal Scroll */}
            <div className="flex justify-center mb-8">
                <div className="flex gap-2 overflow-x-auto pb-4 px-4 max-w-full no-scrollbar mask-gradient-x">
                    {citiesData.cityList.map(city => (
                        <button
                            key={city}
                            onClick={() => setSelectedCity(city)}
                            className={`
                                whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300
                                ${selectedCity === city
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                                }
                            `}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Header */}
            <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-orange-500 rounded-full" />
                <h3 className="text-xl font-bold text-gray-900">
                    Things to do in <span className="text-orange-600 underline decoration-orange-200 decoration-4 underline-offset-2">{selectedCity}</span>
                </h3>
            </div>

            {/* Compact Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 key={selectedCity}">
                {currentPlaces.map((place, idx) => (
                    <div key={place.id} className="relative group">
                        {/* Rank Badge for Top 3 */}
                        {idx < 3 && (
                            <div className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                                {idx + 1}
                            </div>
                        )}
                        <CompactPlaceCard place={place} />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {currentPlaces.length === 0 && (
                <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400">No top-rated activities found for this city yet.</p>
                </div>
            )}
        </section>
    );
}
