"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Store, Tag, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
    cities: string[];
    places: { id: string; title: string; category: string; city: string; image_url: string | null }[];
    categories: string[];
}

export function SmartSearch() {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<Suggestion | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Debounce logic
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                fetchSuggestions(query);
            } else {
                setResults(null);
                setOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (q: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
                setOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
            <form onSubmit={handleSearch} className="relative z-20">
                <div className="relative flex items-center w-full bg-white rounded-full shadow-lg border border-gray-100 hover:border-orange-200 focus-within:ring-4 focus-within:ring-orange-100 transition-all duration-300">
                    <div className="pl-6 text-gray-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.length >= 2) setOpen(true);
                        }}
                        onFocus={() => {
                            if (query.length >= 2) setOpen(true);
                        }}
                        placeholder="Search for cities, places..."
                        className="w-full h-14 pl-4 pr-16 bg-transparent outline-none text-gray-700 placeholder-gray-400 font-medium text-lg" // Increased height and font size
                    />
                    {loading && (
                        <div className="absolute right-32 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-[var(--color-sunset-orange)] text-white px-8 rounded-full font-bold hover:bg-[#E05A2B] transition-colors"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {open && results && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-[400px] overflow-y-auto py-2">

                        {/* Empty State */}
                        {results.cities.length === 0 && results.places.length === 0 && results.categories.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No results found for "{query}"
                            </div>
                        )}

                        {/* Cities */}
                        {results.cities.length > 0 && (
                            <div className="mb-2">
                                <h3 className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cities</h3>
                                {results.cities.map((city) => (
                                    <div
                                        key={city}
                                        onClick={() => {
                                            router.push(`/search?city=${encodeURIComponent(city)}`);
                                            setOpen(false);
                                        }}
                                        className="group cursor-pointer px-5 py-3 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:text-orange-500 transition-colors">
                                            <MapPin className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-gray-900 font-medium">{city}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Categories */}
                        {results.categories.length > 0 && (
                            <div className="mb-2">
                                <h3 className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</h3>
                                {results.categories.map((cat) => (
                                    <div
                                        key={cat}
                                        onClick={() => {
                                            router.push(`/search?category=${encodeURIComponent(cat)}`);
                                            setOpen(false);
                                        }}
                                        className="group cursor-pointer px-5 py-3 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:text-orange-500 transition-colors">
                                            <Tag className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-gray-900 font-medium capitalize">{cat.toLowerCase()}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Places */}
                        {results.places.length > 0 && (
                            <div className="mb-2">
                                <h3 className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Places</h3>
                                {results.places.map((place) => (
                                    <div
                                        key={place.id}
                                        onClick={() => {
                                            router.push(`/places/${place.id}`);
                                            setOpen(false);
                                        }}
                                        className="group cursor-pointer px-5 py-3 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:text-orange-500 transition-colors">
                                            <Store className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-800 group-hover:text-gray-900 font-medium">{place.title}</span>
                                            <span className="text-xs text-gray-400 group-hover:text-gray-500">{place.city} • <span className="capitalize">{place.category.toLowerCase()}</span></span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer - Search for raw query */}
                        {query.length > 0 && (
                            <div
                                onClick={handleSearch}
                                className="border-t border-gray-100 px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                Search for <span className="font-bold text-gray-900">"{query}"</span>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
