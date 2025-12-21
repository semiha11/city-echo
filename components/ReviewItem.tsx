'use client';

import { useState } from 'react';
import { Star, User, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ReviewItemProps {
    review: {
        id: string;
        rating: number;
        comment_text: string;
        created_at: Date;
        user: {
            name: string | null;
            image: string | null;
        };
        images?: { url: string }[];
        user_id: string;
    };
    currentUserId?: string;
}

export default function ReviewItem({ review, currentUserId }: ReviewItemProps) {
    const router = useRouter();
    const isOwner = currentUserId === review.user_id;

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Edit State
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment_text);
    const [hoverRating, setHoverRating] = useState(0);

    const handleDelete = async () => {
        if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Yorum silindi");
            router.refresh();
        } catch (error) {
            toast.error("Yorum silinemedi");
            setIsDeleting(false);
        }
    };

    const handleUpdate = async () => {
        if (editComment.trim().length < 3) return toast.error("Yorum çok kısa");

        setIsSaving(true);
        try {
            const res = await fetch(`/api/reviews/${review.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: editRating,
                    comment_text: editComment
                })
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Yorum güncellendi");
            setIsEditing(false);
            router.refresh(); // Important to show updated content from server
        } catch (error) {
            toast.error("Yorum güncellenemedi");
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">Yorumu Düzenle</h4>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Rating Edit */}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-6 h-6 ${star <= (hoverRating || editRating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-200'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment Edit */}
                <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
                    rows={4}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        disabled={isSaving}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Kaydet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-100 transition-colors shadow-sm group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-white shadow-sm">
                        {review.user.image ? (
                            <img
                                src={review.user.image}
                                alt={review.user.name || "User"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{review.user.name || "Misafir Kullanıcı"}</p>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">
                        {new Date(review.created_at).toLocaleDateString('tr-TR')}
                    </span>

                    {/* Owner Actions */}
                    {isOwner && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Düzenle"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm mb-4 pl-[52px]">
                {review.comment_text}
            </p>

            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 pl-[52px] mb-2 overflow-x-auto pb-2 scrollbar-hide">
                    {review.images.map((img, idx) => (
                        <div
                            key={idx}
                            className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 cursor-zoom-in"
                            onClick={() => setSelectedImage(img.url)}
                        >
                            <img src={img.url} alt="Review" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            src={selectedImage}
                            alt="Full screen review"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
