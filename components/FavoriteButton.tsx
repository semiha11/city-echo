"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    placeId: string;
    initialIsFavorite?: boolean;
    className?: string;
    count?: number; // Optional: Display like count if needed
}

export default function FavoriteButton({ placeId, initialIsFavorite = false, className, count }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsFavorite(initialIsFavorite);
    }, [initialIsFavorite]);

    if (!mounted) {
        // Render a placeholder button that matches the structure but does nothing, or return null to avoid mismatch
        // Returning null might cause layout shift, so better to return the button structure but disabled/static
        return (
            <button
                className={cn(
                    "group relative flex items-center justify-center p-2 rounded-full transition-all duration-200 bg-white/90 shadow-sm backdrop-blur-md",
                    className
                )}
                disabled
            >
                <Heart className="w-6 h-6 text-gray-400" />
            </button>
        );
    }

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a link
        e.stopPropagation();

        if (!session) {
            router.push('/login?callbackUrl=' + window.location.pathname);
            return;
        }

        // Optimistic Update
        const previousState = isFavorite;
        setIsFavorite(!isFavorite);
        setIsLoading(true);

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ placeId }),
            });

            if (!res.ok) {
                throw new Error('Failed to update favorite');
            }

            // Validate server response state
            const data = await res.json();
            // In case server logic diverged, sync it back, but usually optimistic is fine
            // setIsFavorite(data.isFavorite); 
        } catch (error) {
            // Revert on error
            setIsFavorite(previousState);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "group relative flex items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-95 hover:bg-[var(--color-orange-50)]",
                className
            )}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={cn(
                    "w-6 h-6 transition-colors duration-200 ease-out",
                    isFavorite ? "fill-[var(--color-sunset-orange)] text-[var(--color-sunset-orange)]" : "text-gray-400 group-hover:text-[var(--color-sunset-orange)]"
                )}
            />
        </button>
    );
}
