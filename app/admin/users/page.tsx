"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { Search, Mail, Shield, User as UserIcon } from "lucide-react";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    image: string | null;
    created_at: string;
    _count: {
        places: number;
        reviews: number;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users", err);
                setLoading(false);
            });
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-500">Total Users: {users.length}</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stats</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={user.image || ''} />
                                            <AvatarFallback><UserIcon className="h-5 w-5 text-gray-400" /></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className={user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : ''}>
                                        {user.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3 text-sm">
                                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg min-w-[60px]">
                                            <span className="font-bold text-gray-900">{user._count.places}</span>
                                            <span className="text-[10px] text-gray-500 uppercase">Places</span>
                                        </div>
                                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg min-w-[60px]">
                                            <span className="font-bold text-gray-900">{user._count.reviews}</span>
                                            <span className="text-[10px] text-gray-500 uppercase">Reviews</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found matching "{search}"
                    </div>
                )}
            </div>
        </div>
    );
}
