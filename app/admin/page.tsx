"use client";

import { useEffect, useState } from "react";
import { MapPin, Users, Clock } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPlaces: 0,
        pendingPlaces: 0,
        totalUsers: 0
    });

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    const cards = [
        {
            title: "All Places",
            value: stats.totalPlaces,
            icon: MapPin,
            color: "text-blue-600 bg-blue-50"
        },
        {
            title: "Pending Approval",
            value: stats.pendingPlaces,
            icon: Clock,
            color: "text-orange-600 bg-orange-50"
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-green-600 bg-green-50"
        }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${card.color}`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
