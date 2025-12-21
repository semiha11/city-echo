"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Coffee, Building2, Hotel, ShoppingBag, Utensils, Palmtree, Tent, ChevronDown, ChevronUp, MapPin, Tag, DollarSign, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

import { turkeyLocations } from '@/data/turkey-locations';

interface SearchFiltersProps {
    counts?: Record<string, number>;
}

export default function SearchFilters({ counts = {} }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        categories: true,
        price: true,
        features: false, // Collapsed by default
        city: true, // New open section
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push(`/search?${createQueryString(name, value)}`);
    };

    const categories = [
        { id: 'CAFE', label: 'Cafe', icon: Coffee },
        { id: 'RESTAURANT', label: 'Restaurant', icon: Utensils },
        { id: 'MUSEUM', label: 'Museum', icon: Building2 }, // Using Building2 as placeholder for Museum
        { id: 'HOTEL', label: 'Hotel', icon: Hotel },
        { id: 'MALL', label: 'Mall', icon: ShoppingBag },
        { id: 'PARK', label: 'Park', icon: Palmtree }, // Park similar to nature
        { id: 'BEACH', label: 'Beach', icon: Palmtree },
        { id: 'CAMPING', label: 'Camping', icon: Tent },
    ];

    const currentCategory = searchParams.get('category');
    const currentPrice = searchParams.get('price');
    const currentCity = searchParams.get('city') || '';

    // Price Slider Logic (Discrete)
    const priceOptions = ['CHEAP', 'MODERATE', 'EXPENSIVE', 'VERY_EXPENSIVE'];
    const currentPriceIndex = priceOptions.indexOf(currentPrice || '') + 1; // 0 if none, 1-4 if selected

    const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val === 0) handleFilterChange('price', '');
        else handleFilterChange('price', priceOptions[val - 1]);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    Filters
                </h3>
                {(searchParams.toString().length > 0) && (
                    <button onClick={() => router.push('/search')} className="text-xs text-[var(--color-sunset-orange)] hover:underline font-medium">
                        Clear All
                    </button>
                )}
            </div>

            <div className="divide-y divide-gray-100">

                {/* 0. City (New) */}
                <div className="p-4">
                    <button onClick={() => toggleSection('city')} className="flex items-center justify-between w-full mb-3 group">
                        <span className="font-semibold text-gray-800 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-sunset-orange)]" />
                            City
                        </span>
                        {openSections.city ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {openSections.city && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <select
                                value={currentCity}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none bg-white text-sm"
                            >
                                <option value="">All Cities</option>
                                {Object.keys(turkeyLocations).sort().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <button onClick={() => toggleSection('categories')} className="flex items-center justify-between w-full mb-3 group">
                        <span className="font-semibold text-gray-800 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-sunset-orange)]" />
                            Categories
                        </span>
                        {openSections.categories ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {openSections.categories && (
                        <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={() => handleFilterChange('category', '')}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                    !currentCategory ? "bg-orange-50 text-[var(--color-sunset-orange)] font-medium" : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <span className="flex items-center gap-2">All Categories</span>
                                <span className={cn("text-xs px-2 py-0.5 rounded-full", !currentCategory ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500")}>
                                    {Object.values(counts).reduce((a, b) => a + b, 0)}
                                </span>
                            </button>
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = currentCategory === cat.id;
                                const count = counts[cat.id] || 0;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleFilterChange('category', cat.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                            isSelected ? "bg-orange-50 text-[var(--color-sunset-orange)] font-medium" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Icon className={cn("w-4 h-4", isSelected ? "text-[var(--color-sunset-orange)]" : "text-gray-400")} />
                                            {cat.label}
                                        </span>
                                        <span className={cn("text-xs px-2 py-0.5 rounded-full", isSelected ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500")}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 2. Price Range Slider */}
                <div className="p-4">
                    <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full mb-3 group">
                        <span className="font-semibold text-gray-800 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-sunset-orange)]" />
                            Price Range
                        </span>
                        {openSections.price ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {openSections.price && (
                        <div className="px-2 pb-2">
                            <input
                                type="range"
                                min="0"
                                max="4"
                                step="1"
                                value={currentPriceIndex}
                                onChange={handlePriceSliderChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-sunset-orange)]"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                <span className={cn(currentPriceIndex === 0 && "text-gray-900 font-bold")}>All</span>
                                <span className={cn(currentPriceIndex === 1 && "text-[var(--color-sunset-orange)] font-bold")}>₺</span>
                                <span className={cn(currentPriceIndex === 2 && "text-[var(--color-sunset-orange)] font-bold")}>₺₺</span>
                                <span className={cn(currentPriceIndex === 3 && "text-[var(--color-sunset-orange)] font-bold")}>₺₺₺</span>
                                <span className={cn(currentPriceIndex === 4 && "text-[var(--color-sunset-orange)] font-bold")}>₺₺₺₺</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Meals / Features */}
                <div className="p-4">
                    <button onClick={() => toggleSection('features')} className="flex items-center justify-between w-full mb-3 group">
                        <span className="font-semibold text-gray-800 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-sunset-orange)]" />
                            Meals
                        </span>
                        {openSections.features ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    {openSections.features && (
                        <div className="space-y-2">
                            {[
                                { key: 'breakfast', label: 'Breakfast' },
                                { key: 'lunch', label: 'Lunch' },
                                { key: 'dinner', label: 'Dinner' },
                                { key: 'dessert', label: 'Dessert' },
                                { key: 'snack', label: 'Snack' },
                            ].map((meal) => {
                                const currentMeals = searchParams.get('meals')?.split(',') || [];
                                const isChecked = currentMeals.includes(meal.key);

                                return (
                                    <label key={meal.key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                let newMeals = [...currentMeals];
                                                if (e.target.checked) {
                                                    newMeals.push(meal.key);
                                                } else {
                                                    newMeals = newMeals.filter(m => m !== meal.key);
                                                }
                                                handleFilterChange('meals', newMeals.join(','));
                                            }}
                                            className="w-4 h-4 rounded text-[var(--color-sunset-orange)] focus:ring-[var(--color-sunset-orange)] border-gray-300"
                                        />
                                        <span className={cn("text-sm", isChecked ? "text-gray-900 font-medium" : "text-gray-600")}>{meal.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
