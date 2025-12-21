"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { MapPin, Calendar, Heart, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';
import InterestInput from '@/components/InterestInput';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'sonner';
import ReviewItem from '@/components/ReviewItem';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        city: '',
        age: '',
        gender: '',
        interests: [] as string[],
        image_url: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user) {
            fetchUserData();
        }
    }, [status, session]);

    const fetchUserData = async () => {
        try {
            // In a real app we'd have a specific GET endpoint for full profile data 
            // including relations. For now, since we didn't make a GET /api/user/me with includes,
            // we might miss "Places", "Favorites", "Reviews" relation data if we just used session.
            // Let's create a quick server action or just use a new API route.
            // For MVP, I will assume we need to fetch this.
            // Let's make a dedicated fetch here.
            const res = await fetch('/api/user/me-full'); // We need to create this or use client-side fetch from standardized route
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setEditForm({
                    name: data.name || '',
                    bio: data.bio || '',
                    city: data.city || '',
                    age: data.age || '',
                    gender: data.gender || '',
                    interests: data.interests ? data.interests.split(',') : [],
                    image_url: data.image || ''
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Quick Fix: Since I didn't create GET /api/user/me-full in the plan, 
    // I should create it OR do it in a Server Component. 
    // But since this is a "use client" component (for Tabs/Interactivity), 
    // fetching data is easier via API or passing standard props.
    // I will switch this to a standard pattern: 
    // 1. Create the API route for fetching full user details.

    // ... (Wait, I should create the API route first in the next step. 
    // For now I'll implement the UI assuming the data structure).

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editForm,
                    interests: editForm.interests.join(',')
                })
            });

            if (!res.ok) throw new Error('Failed to update');

            const updated = await res.json();
            setUser({ ...user, ...updated }); // Merge simple updates
            setIsEditing(false);
            toast.success('Profile updated!');
            router.refresh(); // Refresh server state if needed
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

    // Helper for gender color
    const getGenderColor = (gender: string) => {
        switch (gender?.toLowerCase()) {
            case 'female': return 'border-pink-400 text-pink-500';
            case 'male': return 'border-blue-500 text-blue-500';
            case 'nonbinary': return 'border-gray-400 text-gray-500';
            default: return 'border-gray-200 text-gray-700';
        }
    };

    const getGenderBg = (gender: string) => {
        switch (gender?.toLowerCase()) {
            case 'female': return 'bg-pink-50';
            case 'male': return 'bg-blue-50';
            case 'nonbinary': return 'bg-gray-100';
            default: return 'bg-white';
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading profile...</div>;
    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header / Banner */}
            <div className={`rounded-2xl p-8 shadow-sm border mb-8 relative transition-colors ${getGenderBg(user.gender)} ${getGenderColor(user.gender).split(' ')[0]}`}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <Avatar className={`w-32 h-32 border-4 shadow-lg ${getGenderColor(user.gender).split(' ')[0]}`}>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className={`text-3xl font-bold ${getGenderColor(user.gender).split(' ')[1]}`}>{user.name}</h1>
                                <p className="text-gray-500">@{user.name?.toLowerCase().replace(/\s/g, '')}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-white/50 text-sm font-medium transition-colors bg-white/30"
                            >
                                <Edit className="w-4 h-4" />
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4">
                                {user.bio && <p className="text-gray-700 max-w-2xl">{user.bio}</p>}

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    {user.city && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {user.city}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Joined {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                    {user.age && (
                                        <div>Age: {user.age}</div>
                                    )}
                                    {user.gender && (
                                        <div className="capitalize">Gender: {user.gender}</div>
                                    )}
                                </div>

                                {user.interests && (
                                    <div className="flex flex-wrap gap-2">
                                        {user.interests.split(',').map((tag: string) => (
                                            <Badge key={tag} variant="secondary" className="bg-white/60 hover:bg-white/80">{tag}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl bg-white/80 p-6 rounded-xl border border-gray-200 shadow-sm backdrop-blur-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name</label>
                                        <input
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full p-2 rounded border border-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Age</label>
                                        <input
                                            value={editForm.age}
                                            onChange={e => setEditForm({ ...editForm, age: e.target.value })}
                                            className="w-full p-2 rounded border border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Gender</label>
                                    <select
                                        value={editForm.gender}
                                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                                        className="w-full p-2 rounded border border-gray-200"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="female">Woman (Kadın)</option>
                                        <option value="male">Man (Erkek)</option>
                                        <option value="nonbinary">Non-binary (Nonbirey)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Bio</label>
                                    <textarea
                                        value={editForm.bio}
                                        rows={3}
                                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                        className="w-full p-2 rounded border border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input
                                        value={editForm.city}
                                        onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                        className="w-full p-2 rounded border border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Interests</label>
                                    <InterestInput
                                        value={editForm.interests}
                                        onChange={tags => setEditForm({ ...editForm, interests: tags })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Profile Picture</label>
                                    <ImageUploader
                                        onImageSelect={(file) => {
                                            if (file) {
                                                // Convert file to Base64 to display immediately
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditForm(prev => ({ ...prev, image_url: reader.result as string }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        currentImageUrl={editForm.image_url}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                {!isEditing && (
                    <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{user.places?.length || 0}</div>
                            <div className="text-sm text-gray-500">Places</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{user.favorites?.length || 0}</div>
                            <div className="text-sm text-gray-500">Favorites</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{user.reviews?.length || 0}</div>
                            <div className="text-sm text-gray-500">Reviews</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="places" className="w-full">
                <TabsList className="w-full justify-start p-1 bg-white border border-gray-100 rounded-xl mb-8 overflow-x-auto">
                    <TabsTrigger value="places" className="flex-1 max-w-[200px] h-10">My Places</TabsTrigger>
                    <TabsTrigger value="favorites" className="flex-1 max-w-[200px] h-10">Favorites</TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1 max-w-[200px] h-10">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="places" className="space-y-4">
                    {user.places?.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900">No places shared yet</h3>
                            <Link href="/add-place" className="text-rose-500 hover:underline mt-2 inline-block">
                                Share your first place
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.places?.map((place: any) => (
                                <Link key={place.id} href={`/places/${place.id}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                                    <div className="h-48 bg-gray-100 relative">
                                        {place.image_url ? (
                                            <img src={place.image_url} alt={place.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <MapPin className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{place.title}</h3>
                                        <p className="text-gray-500 text-sm">{place.city}, {place.district}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                    {user.favorites?.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900">No favorites yet</h3>
                            <p className="text-gray-500 text-sm">Heart places you love to save them here</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.favorites?.map((fav: any) => (
                                <Link key={fav.place.id} href={`/places/${fav.place.id}`} className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                                    <div className="h-48 bg-gray-100 relative">
                                        {fav.place.image_url ? (
                                            <img src={fav.place.image_url} alt={fav.place.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <MapPin className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm">
                                            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{fav.place.title}</h3>
                                        <p className="text-gray-500 text-sm">{fav.place.city}, {fav.place.district}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                    {user.reviews?.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900">No reviews yet</h3>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {user.reviews?.map((review: any) => (
                                <div key={review.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                    {/* Place Header */}
                                    {review.place && (
                                        <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                                            <Link
                                                href={`/places/${review.place.id}`}
                                                className="font-bold text-gray-900 hover:text-orange-500 transition-colors flex items-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                {review.place.title}
                                            </Link>
                                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">
                                                {review.place.district}, {review.place.city}
                                            </span>
                                        </div>
                                    )}

                                    {/* Review Content - Using standardized component */}
                                    <div className="p-0">
                                        <ReviewItem
                                            review={review}
                                            currentUserId={session?.user ? (session.user as any).id : null}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
