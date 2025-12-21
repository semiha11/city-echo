"use client";

import { useState, useEffect } from "react";
import { Check, X, Trash2, Edit, Search } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from 'next/link';

interface AdminPlace {
    id: string;
    title: string;
    city: string;
    image_url: string | null;
    isApproved: boolean;
    priceRange: string | null;
    user: { username: string };
    images?: { id: string; url: string }[];
    created_at: string;
}

import EditPlaceModal from "@/components/admin/EditPlaceModal";

export default function AdminPlacesPage() {
    const [places, setPlaces] = useState<AdminPlace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
    const [editingPlace, setEditingPlace] = useState<AdminPlace | null>(null);

    const fetchPlaces = async () => {
        setIsLoading(true);
        // We might need a specific admin endpoint for getting ALL places (including unapproved)
        // For now, let's assume we update the public GET endpoint to allow fetching unapproved if admin...
        // Actually, cleaner to have /api/admin/places endpoint.
        // I will implement fetching logic here assuming we add that endpoint or filter logic.
        // Let's create `GET /api/admin/places` as well.

        try {
            const res = await fetch('/api/admin/places');
            const data = await res.json();
            setPlaces(data);
        } catch (error) {
            toast.error("Failed to fetch places");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleApprove = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/places/${id}/approve`, {
                method: 'PATCH',
                body: JSON.stringify({ isApproved: !currentStatus })
            });
            if (!res.ok) throw new Error('Failed');

            setPlaces(places.map(p => p.id === id ? { ...p, isApproved: !currentStatus } : p));
            toast.success(currentStatus ? "Place unapproved" : "Place approved");
        } catch (e) {
            toast.error("Error updating status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this place?")) return;

        try {
            const res = await fetch(`/api/places/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');

            setPlaces(places.filter(p => p.id !== id));
            toast.success("Place deleted");
        } catch (e) {
            toast.error("Error deleting place");
        }
    };

    const handleUpdate = (updatedPlace: any) => {
        setPlaces(places.map(p => p.id === updatedPlace.id ? { ...p, ...updatedPlace } : p));
    };

    const filteredPlaces = places.filter(place => {
        if (filter === 'PENDING') return !place.isApproved;
        if (filter === 'APPROVED') return place.isApproved;
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Places</h1>
                <div className="flex gap-2">
                    {['ALL', 'PENDING', 'APPROVED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Place</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">City</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Added By</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredPlaces.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No places found.</td></tr>
                        ) : (
                            filteredPlaces.map((place) => (
                                <tr key={place.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden relative">
                                                {(place.images?.[0]?.url || place.image_url) ? (
                                                    <img src={place.images?.[0]?.url || place.image_url || ''} alt="" className="object-cover w-full h-full" />
                                                ) : <div className="w-full h-full bg-gray-200" />}
                                            </div>
                                            <Link href={`/places/${place.id}`} target="_blank" className="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                                                {place.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{place.city}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${place.isApproved
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-orange-50 text-orange-700'
                                            }`}>
                                            {place.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{place.user?.username || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingPlace(place)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(place.id, place.isApproved)}
                                                className={`p-2 rounded-lg transition-colors ${place.isApproved
                                                    ? 'text-orange-600 hover:bg-orange-50'
                                                    : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={place.isApproved ? "Revoke Approval" : "Approve"}
                                            >
                                                {place.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(place.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            {editingPlace && (
                <EditPlaceModal
                    place={editingPlace}
                    onClose={() => setEditingPlace(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}
