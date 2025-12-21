import { getPlaces } from '@/lib/db-queries';
import PlaceCard from '@/components/PlaceCard';
import { Search, Coffee, Palmtree, Utensils, Building2, ShoppingBag } from 'lucide-react';

// Wait, Search logic is client side (useState), but this is a server component now.
// I will keep the Hero section client-side or extract SearchBar to a client component.
// Let's extract SearchBar to components/SearchBar.tsx first?
// Or I can make parts of this page client component?
// Actually `page.tsx` should be Server Component to fetch data.
// So I need to move the Hero/Search logic to a separate Client Component or just the form.
// For simplicity, let's make `app/page.tsx` a Server Component and import `SearchBar` client component.

import Link from 'next/link';
import CityGuide from '@/components/home/CityGuide';

// Client Component for Hero to handle Search State
import HeroSection from '@/components/HeroSection';
import ClientOnly from '@/components/ClientOnly';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const places = await getPlaces();

  const categories = [
    { name: 'Cafe', icon: Coffee, color: 'text-amber-600 bg-amber-50' },
    { name: 'Restaurant', icon: Utensils, color: 'text-orange-600 bg-orange-50' },
    { name: 'Hotel', icon: Building2, color: 'text-blue-600 bg-blue-50' },
    { name: 'Park', icon: Palmtree, color: 'text-green-600 bg-green-50' },
    { name: 'Mall', icon: ShoppingBag, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <ClientOnly>
        <HeroSection />
        {/* City Guide Section - Dynamic from DB */}
        <CityGuide places={places} />
      </ClientOnly>

      {/* Categories Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/search?category=${cat.name.toUpperCase()}`}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:border-transparent transition-all group"
            >
              <div className={`p-4 rounded-full mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="h-8 w-8" />
              </div>
              <span className="font-semibold text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Places</h2>

        {places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">No places added yet.</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to share a hidden gem!</p>
          </div>
        )}
      </section>
    </div>
  );
}
