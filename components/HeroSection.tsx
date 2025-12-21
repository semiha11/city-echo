"use client";

import { SmartSearch } from './SmartSearch';

export default function HeroSection() {
    return (
        <section className="relative bg-white py-20 lg:py-32 px-4 flex flex-col items-center justify-center text-center">
            {/* Background elements wrapper with overflow hidden */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-orange-50)] to-white" />

                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--color-orange-100)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-[var(--color-space-blue)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[var(--color-deep-navy)] tracking-tight mb-6 font-display">
                Explore the world <br className="hidden sm:block" />
                <span className="text-[var(--color-sunset-orange)]">around you</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 font-sans">
                Discover the best hidden gems, from cozy cafes to luxurious hotels, shared by our community.
            </p>

            {/* New Smart Search Component */}
            <SmartSearch />
        </section>
    );
}
