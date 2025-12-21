"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';

interface CommentFormProps {
    placeId: string;
}

export default function CommentForm({ placeId }: CommentFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Puan vermeyi unutmayın!");
            return;
        }
        if (comment.trim().length < 3) {
            toast.error("Yorum çok kısa!");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/places/${placeId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    comment_text: comment,
                    images: images
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to submit review");
            }

            toast.success("Yorumunuz yayınlandı!");
            setRating(0);
            setComment("");
            setImages([]);
            setShowImageUpload(false);
            router.refresh();

        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    Deneyiminizi Paylaşın
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Rating Input - Compact */}
                <div className="flex justify-center gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                className={`w-6 h-6 ${star <= (hoverRating || rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment Input - Compact */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bu mekan nasıldı? Deneyimlerinizi yazın..."
                    rows={3}
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all placeholder-gray-400 bg-gray-50 focus:bg-white"
                />

                {/* Compact Actions Bar */}
                <div className="flex flex-col gap-3">
                    {/* Image Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowImageUpload(!showImageUpload)}
                        className={`text-xs font-medium flex items-center gap-2 transition-colors ${showImageUpload ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        {showImageUpload ? 'Fotoğraf yüklemeyi kapat' : 'Fotoğraf ekle'}
                    </button>

                    {showImageUpload && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <ImageUpload
                                value={images}
                                onChange={(url) => setImages([...images, url])}
                                onRemove={(url) => setImages(images.filter(i => i !== url))}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Gönderiliyor
                            </>
                        ) : (
                            <>
                                Yorumu Gönder
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
