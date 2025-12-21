"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Edit2, Star, MapPin, User, X, Check, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
    id: string;
    rating: number;
    comment_text: string;
    created_at: string;
    user: {
        name: string | null;
        image: string | null;
        email: string | null;
    };
    place: {
        id: string;
        title: string;
    };
}

export default function AdminReviewTable() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Modal State
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editForm, setEditForm] = useState({ rating: 0, comment: "" });
    const [isSaving, setIsSaving] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Reviews
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);

        fetch(`/api/admin/reviews?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReviews(data);
                } else {
                    console.error("Failed to fetch reviews");
                }
            })
            .catch(err => toast.error("Failed to load reviews"))
            .finally(() => setLoading(false));
    }, [debouncedSearch]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete");

            setReviews(reviews.filter(r => r.id !== id));
            toast.success("Review deleted successfully");
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const handleEditClick = (review: Review) => {
        setEditingReview(review);
        setEditForm({ rating: review.rating, comment: review.comment_text });
    };

    const handleUpdate = async () => {
        if (!editingReview) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/api/reviews/${editingReview.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: editForm.rating,
                    comment_text: editForm.comment
                })
            });

            if (!res.ok) throw new Error("Failed to update");

            // Update local state
            setReviews(reviews.map(r =>
                r.id === editingReview.id
                    ? { ...r, rating: editForm.rating, comment_text: editForm.comment }
                    : r
            ));

            setEditingReview(null);
            toast.success("Review updated");
        } catch (error) {
            toast.error("Failed to update review");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header & Search */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 items-center">
                <h2 className="text-xl font-bold text-gray-800">Review Management</h2>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by user, place or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                            <th className="p-4">User</th>
                            <th className="p-4">Place</th>
                            <th className="p-4 w-1/3">Comment</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No reviews found.</td></tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {review.user.image ? (
                                                    <img src={review.user.image} alt={review.user.name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{review.user.name || "Unknown"}</div>
                                                <div className="text-xs text-gray-400">{review.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPin className="w-3 h-3 text-orange-500" />
                                            <span className="text-sm font-medium">{review.place.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-gray-600 line-clamp-2" title={review.comment_text}>{review.comment_text}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditClick(review)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingReview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-lg text-gray-900">Edit Review</h3>
                                <button onClick={() => setEditingReview(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setEditForm({ ...editForm, rating: star })}
                                                className="focus:outline-none"
                                            >
                                                <Star className={`w-8 h-8 ${star <= editForm.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                    <textarea
                                        rows={5}
                                        value={editForm.comment}
                                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setEditingReview(null)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
