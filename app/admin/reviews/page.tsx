"use client";

import AdminReviewTable from "@/components/admin/AdminReviewTable";

export default function AdminReviewsPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                <p className="text-gray-500">Monitor and manage user reviews across all places.</p>
            </div>

            <AdminReviewTable />
        </div>
    );
}
