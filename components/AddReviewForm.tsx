"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Star } from 'lucide-react';

export default function AddReviewForm({ placeId }: { placeId: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!session?.user) {
        return (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                <p className="text-gray-600 mb-4">Please log in to leave a review.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="text-[var(--color-sunset-orange)] font-medium hover:underline"
                >
                    Log in here
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/places/${placeId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment_text: comment }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit review');
            }

            setRating(0);
            setComment('');
            router.refresh(); // Refresh server components to show new review
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`h-6 w-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] outline-none h-32 resize-none"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
                {loading ? 'Posting...' : 'Post Review'}
            </button>
        </form>
    );
}
