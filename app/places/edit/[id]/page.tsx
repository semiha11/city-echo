"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { MapPin, Type, Tag, AlignLeft, Utensils, UtensilsCrossed, IceCream, Carrot, Palmtree, Tent, Clock, Music, Ticket, Users, Mic2, Info, Loader2, UserCheck, Image as ImageIcon } from 'lucide-react';
import { turkeyLocations } from '@/data/turkey-locations';
import dynamic from 'next/dynamic';
import ImageUpload from '@/components/ImageUpload';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

const CoffeeIcon = dynamic(() => import('lucide-react').then(mod => mod.Coffee));

interface EditPlacePageProps {
    params: Promise<{ id: string }>;
}

export default function EditPlacePage({ params }: EditPlacePageProps) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        city: '',
        district: '',
        address: '',
        latitude: '',
        longitude: '',
        images: [] as string[],
        // New Fields
        priceRange: '',
        breakfast: false,
        lunch: false,
        dinner: false,
        dessert: false,
        snack: false,
        isPaid: false,
        entranceFee: '',
        museumCardAccepted: false,
        photography: false,
        veganOption: false,
        outdoorSeating: false,
        largeArea: false,
        petFriendly: false,
        playground: false,
        freeEntry: false,
        parking: false,
        wifi: false,
        pool: false,
        gym: false,
        noiseLevel: 'MODERATE',
        foodCourt: false,
        babyCare: false,

        // Beach & Camping
        blueFlag: false,
        sunbed: false,
        shower: false,
        tentRental: false,
        electricity: false,
        fireAllowed: false,
        caravanAccess: false,

        // New Features (Cafe/Rest/Mall)
        isFamilyFriendly: false,
        hasSmokingArea: false,
        alcoholStatus: null as string | null,

        // Activity Specific
        duration: '',
        reservationRequired: false,
        bestTime: '',

        // Bar/Club Specific
        damAllowed: false,
        musicType: '',

        // General
        editorNote: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('You must be logged in to edit a place');
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchPlaceData();
        }
    }, [status, router, id]);

    const fetchPlaceData = async () => {
        try {
            const res = await fetch(`/api/places/${id}`);
            if (!res.ok) throw new Error('Failed to fetch place');
            const data = await res.json();

            // Validate Ownership (this check is also done on API, but good for UI state)
            if (session?.user && (session.user as any).id !== data.user_id && (session.user as any).role !== 'ADMIN') {
                toast.error('You are not authorized to edit this place');
                router.push('/');
                return;
            }

            setFormData({
                title: data.title || '',
                category: data.category || '',
                description: data.description || '',
                city: data.city || '',
                district: data.district || '',
                address: data.address || '',
                latitude: data.latitude?.toString() || '',
                longitude: data.longitude?.toString() || '',
                images: data.images?.map((img: any) => img.url) || [],

                priceRange: data.priceRange || '',
                breakfast: data.breakfast || false,
                lunch: data.lunch || false,
                dinner: data.dinner || false,
                dessert: data.dessert || false,
                snack: data.snack || false,
                isPaid: data.isPaid || false,
                entranceFee: data.entranceFee || '',
                museumCardAccepted: data.museumCardAccepted || false,
                photography: data.photography || false,
                veganOption: data.veganOption || false,
                outdoorSeating: data.outdoorSeating || false,
                largeArea: data.largeArea || false,
                petFriendly: data.petFriendly || false,
                playground: data.playground || false,
                freeEntry: data.freeEntry || false,
                parking: data.parking || false,
                wifi: data.wifi || false,
                pool: data.pool || false,
                gym: data.gym || false,
                noiseLevel: data.noiseLevel || 'MODERATE',
                foodCourt: data.foodCourt || false,
                babyCare: data.babyCare || false,
                blueFlag: data.blueFlag || false,
                sunbed: data.sunbed || false,
                shower: data.shower || false,
                tentRental: data.tentRental || false,
                electricity: data.electricity || false,
                fireAllowed: data.fireAllowed || false,
                caravanAccess: data.caravanAccess || false,
                isFamilyFriendly: data.isFamilyFriendly || false,
                hasSmokingArea: data.hasSmokingArea || false,
                alcoholStatus: data.alcoholStatus || null,
                duration: data.duration || '',
                reservationRequired: data.reservationRequired || false,
                bestTime: data.bestTime || '',
                damAllowed: data.damAllowed || false,
                musicType: data.musicType || '',
                editorNote: data.editorNote || ''
            });
        } catch (error) {
            console.error('Error fetching place:', error);
            toast.error('Could not load place details');
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.city || !formData.district) {
            toast.error('Please fill in all required fields (Name, Category, City, District)');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/places/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update place');
            }

            toast.success('Place updated successfully!');
            router.push(`/places/${id}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['Cafe', 'Museum', 'Hotel', 'Mall', 'Restaurant', 'Park', 'Beach', 'Camping', 'Activity', 'Bar', 'Club'];

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[var(--color-orange-50)] px-8 py-6 border-b border-orange-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-deep-navy)]">Edit Place</h1>
                        <p className="text-[var(--color-sunset-orange)] mt-1">Update information for {formData.title}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div className="">
                        {/* Basic Info Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4 mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <AlignLeft className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Place Name</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            placeholder="e.g. The Cozy Corner"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <select
                                            name="category"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none appearance-none bg-white"
                                            value={formData.category}
                                            onChange={(e) => {
                                                const newCategory = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    category: newCategory,
                                                }));
                                            }}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(c => <option key={c} value={c.toUpperCase()}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <textarea
                                            name="description"
                                            placeholder="Tell us about this place..."
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none resize-none"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4 mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                Location Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <select
                                            name="city"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none appearance-none bg-white"
                                            value={formData.city}
                                            onChange={(e) => {
                                                handleChange(e);
                                                // Reset district when city changes
                                                setFormData(prev => ({ ...prev, city: e.target.value, district: '' }));
                                            }}
                                        >
                                            <option value="">Select city</option>
                                            {Object.keys(turkeyLocations).sort().map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <select
                                            name="district"
                                            required
                                            disabled={!formData.city}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                            value={formData.district}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select district</option>
                                            {formData.city && turkeyLocations[formData.city as keyof typeof turkeyLocations]?.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                                    <textarea
                                        name="address"
                                        placeholder="Full address details..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none resize-none"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 1. FOOD & DRINK (Restaurant, Cafe) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['RESTAURANT', 'CAFE'].includes(formData.category) ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['RESTAURANT', 'CAFE'].includes(formData.category) && (
                                <div className="space-y-6 pt-2 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                                    <h3 className="font-semibold text-orange-900 flex items-center gap-2">
                                        <Utensils className="w-5 h-5" />
                                        Food & Dining Details
                                    </h3>

                                    {/* Price Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                        <div className="flex gap-4">
                                            {[
                                                { value: 'CHEAP', label: '100-200 TL', desc: '(kişi başı)' },
                                                { value: 'MODERATE', label: '200-400 TL', desc: '(kişi başı)' },
                                                { value: 'EXPENSIVE', label: '400-600 TL', desc: '(kişi başı)' },
                                                { value: 'VERY_EXPENSIVE', label: '800+ TL', desc: '(kişi başı)' }
                                            ].map((price) => (
                                                <label key={price.value} className={`
                                                    flex-1 cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-1 transition-all bg-white
                                                    ${formData.priceRange === price.value ? 'border-orange-500 ring-1 ring-orange-500 text-orange-700' : 'border-gray-200 hover:border-gray-300'}
                                                `}>
                                                    <input
                                                        type="radio"
                                                        name="priceRange"
                                                        value={price.value}
                                                        className="hidden"
                                                        checked={formData.priceRange === price.value}
                                                        onChange={handleChange}
                                                    />
                                                    <span className="font-bold text-lg">{price.label}</span>
                                                    <span className="text-xs text-center opacity-70">{price.desc}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Meals */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meal Options</label>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {[
                                                { key: 'breakfast', label: 'Breakfast', icon: CoffeeIcon },
                                                { key: 'lunch', label: 'Lunch', icon: Utensils },
                                                { key: 'dinner', label: 'Dinner', icon: UtensilsCrossed },
                                                { key: 'dessert', label: 'Dessert', icon: IceCream },
                                                { key: 'snack', label: 'Snack', icon: Carrot },
                                            ].map((meal) => {
                                                const Icon = meal.icon;
                                                return (
                                                    <label key={meal.key} className={`
                                                        cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all bg-white
                                                        ${formData[meal.key as keyof typeof formData] ? 'border-teal-500 ring-1 ring-teal-500 text-teal-700 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}
                                                `}>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={Boolean(formData[meal.key as keyof typeof formData])}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, [meal.key]: e.target.checked }))}
                                                        />
                                                        { /* @ts-ignore */}
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-xs font-medium">{meal.label}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="flex gap-4">
                                        {/* Vegan Option */}
                                        <label className={`
                                            flex-1 cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).veganOption ? 'border-green-500 ring-1 ring-green-500 text-green-900 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium">Vegan Options 🌱</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-green-600 focus:ring-green-500" checked={Boolean((formData as any).veganOption)} onChange={(e) => setFormData(prev => ({ ...prev, veganOption: e.target.checked }))} />
                                        </label>

                                        {/* Outdoor Seating */}
                                        <label className={`
                                            flex-1 cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).outdoorSeating ? 'border-blue-500 ring-1 ring-blue-500 text-blue-900 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium">Outdoor Seating ☀️</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" checked={Boolean((formData as any).outdoorSeating)} onChange={(e) => setFormData(prev => ({ ...prev, outdoorSeating: e.target.checked }))} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* GENERAL AMENITIES (Cafe, Rest, Mall, Beach) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-orange-50/50 p-6 rounded-2xl border border-orange-100 mt-4">
                                    <h3 className="font-semibold text-orange-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        Important Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Family Friendly */}
                                        <label className={`
                                            cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).isFamilyFriendly ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium text-gray-800">Family Friendly 👨‍👩‍👧‍👦</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500" checked={Boolean((formData as any).isFamilyFriendly)} onChange={(e) => setFormData(prev => ({ ...prev, isFamilyFriendly: e.target.checked }))} />
                                        </label>

                                        {/* Smoking Area */}
                                        <label className={`
                                            cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).hasSmokingArea ? 'border-gray-500 bg-gray-100 ring-1 ring-gray-400' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium text-gray-800">Smoking Area 🚬</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-gray-600 focus:ring-gray-500" checked={Boolean((formData as any).hasSmokingArea)} onChange={(e) => setFormData(prev => ({ ...prev, hasSmokingArea: e.target.checked }))} />
                                        </label>

                                        {/* Alcohol Status */}
                                        {['RESTAURANT', 'CAFE', 'BEACH'].includes(formData.category) && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Service 🍷</label>
                                                <div className="flex gap-4">
                                                    {[
                                                        { value: 'NONE', label: 'No Alcohol', icon: '🥤' },
                                                        { value: 'ALCOHOLIC', label: 'Alcohol Served', icon: '🍷' },
                                                        { value: 'BOTH', label: 'Both', icon: '🍹' }
                                                    ].map((opt) => (
                                                        <label key={opt.value} className={`
                                                            flex-1 cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-1 transition-all bg-white
                                                            ${(formData as any).alcoholStatus === opt.value ? 'border-indigo-500 ring-1 ring-indigo-500 text-indigo-700 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                                                        `}>
                                                            <input
                                                                type="radio"
                                                                name="alcoholStatus"
                                                                value={opt.value}
                                                                className="hidden"
                                                                checked={(formData as any).alcoholStatus === opt.value}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, alcoholStatus: e.target.value }))}
                                                            />
                                                            <span className="text-2xl">{opt.icon}</span>
                                                            <span className="font-medium text-sm">{opt.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BEACH (Beach) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['BEACH'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['BEACH'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-cyan-50/50 p-6 rounded-2xl border border-cyan-100">
                                    <h3 className="font-semibold text-cyan-900 flex items-center gap-2">
                                        <Palmtree className="w-5 h-5" />
                                        Beach Features
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'blueFlag', label: 'Blue Flag 🏳️' },
                                            { key: 'sunbed', label: 'Sunbeds Included 🏖️' },
                                            { key: 'shower', label: 'Showers/Changing 🚿' },
                                            { key: 'isPaid', label: 'Entrance Fee 💵' },
                                        ].map((item) => (
                                            <label key={item.key} className={`
                                                cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                                ${(formData as any)[item.key] ? 'border-cyan-500 bg-cyan-50 ring-1 ring-cyan-500' : 'border-gray-200 hover:border-gray-300'}
                                            `}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" className="w-5 h-5 rounded text-cyan-600 focus:ring-cyan-500" checked={Boolean((formData as any)[item.key])} onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))} />
                                            </label>
                                        ))}

                                        {/* Fee Input for Beach if Paid */}
                                        {(formData as any).isPaid && (
                                            <div className="col-span-2 transition-all animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount</label>
                                                <input type="text" name="entranceFee" placeholder="e.g. 150 TL" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none" value={(formData as any).entranceFee} onChange={handleChange} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CAMPING (Camping) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['CAMPING'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['CAMPING'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                                    <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                                        <Tent className="w-5 h-5" />
                                        Camping Features
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'tentRental', label: 'Tent Rental ⛺' },
                                            { key: 'electricity', label: 'Electricity ⚡' },
                                            { key: 'fireAllowed', label: 'Fire Allowed 🔥' },
                                            { key: 'caravanAccess', label: 'Caravan Access 🚐' },
                                        ].map((item) => (
                                            <label key={item.key} className={`
                                                cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                                ${(formData as any)[item.key] ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-gray-300'}
                                            `}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500" checked={Boolean((formData as any)[item.key])} onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ACTIVITY (Activity) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['ACTIVITY'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['ACTIVITY'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-yellow-50/50 p-6 rounded-2xl border border-yellow-100">
                                    <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
                                        <Ticket className="w-5 h-5" />
                                        Activity Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <input type="text" name="duration" placeholder="e.g. 2 Hours, Full Day" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none" value={(formData as any).duration} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Best Time</label>
                                            <input type="text" name="bestTime" placeholder="e.g. Sunset, Morning" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none" value={(formData as any).bestTime} onChange={handleChange} />
                                        </div>
                                        <label className={`
                                            cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white col-span-2
                                            ${(formData as any).reservationRequired ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium text-gray-800">Reservation Required 📅</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-yellow-600 focus:ring-yellow-500" checked={Boolean((formData as any).reservationRequired)} onChange={(e) => setFormData(prev => ({ ...prev, reservationRequired: e.target.checked }))} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NIGHTLIFE (Bar, Club) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['BAR', 'CLUB'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['BAR', 'CLUB'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                                    <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                                        <Mic2 className="w-5 h-5" />
                                        Nightlife Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                                        <div className="p-4 bg-white border border-gray-200 rounded-xl h-full flex items-center gap-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                                <Music className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-xs text-gray-500 font-medium">Music Type</span>
                                                <input
                                                    type="text"
                                                    name="musicType"
                                                    placeholder="e.g. Jazz, Pop, Techno"
                                                    className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-400 text-sm font-medium h-6"
                                                    value={(formData as any).musicType}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Entrance Fee Toggle */}
                                        <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all h-full">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <Ticket className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">Entrance Fee</div>
                                                    <div className="text-xs text-gray-500">Is there an entry fee?</div>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex items-center">
                                                <input type="checkbox" className="sr-only peer" checked={Boolean((formData as any).isPaid)} onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))} />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                            </div>
                                        </label>

                                        {/* Entrance Fee Input (Conditional) */}
                                        {(formData as any).isPaid && (
                                            <div className="transition-all animate-in fade-in slide-in-from-top-2 md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-3 h-5 w-5 text-gray-400 flex items-center justify-center font-bold">₺</div>
                                                    <input type="text" name="entranceFee" placeholder="e.g. 500 TL" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none" value={(formData as any).entranceFee} onChange={handleChange} />
                                                </div>
                                            </div>
                                        )}

                                        <label className={`
                                            cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white h-full
                                            ${(formData as any).damAllowed ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${(formData as any).damAllowed ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <UserCheck className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-gray-800">Solo Entry Permitted 👤</span>
                                            </div>
                                            <input type="checkbox" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" checked={Boolean((formData as any).damAllowed)} onChange={(e) => setFormData(prev => ({ ...prev, damAllowed: e.target.checked }))} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Editor Note Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                User Recommendation
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Editor's Note (Optional)</label>
                                <p className="text-xs text-gray-500 mb-2">Why should people visit this place? Add a personal touch.</p>
                                <textarea
                                    name="editorNote"
                                    placeholder="e.g. You must try the sunset view here! / Kesinlikle gün batımında gelmelisiniz!"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-sunset-orange)] focus:border-transparent outline-none resize-none"
                                    value={formData.editorNote}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                Photos
                            </h3>
                            <ImageUpload
                                value={formData.images}
                                onChange={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                                onRemove={(url) => setFormData(prev => ({ ...prev, images: prev.images.filter(i => i !== url) }))}
                            />
                        </div>


                        {/* Map Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                Pin on Map (Optional)
                            </h3>
                            <div className="h-[400px] w-full rounded-xl overflow-hidden relative z-0">
                                <LocationPicker
                                    onLocationSelect={handleLocationSelect}
                                    initialLat={parseFloat(formData.latitude) || 39.9334}
                                    initialLng={parseFloat(formData.longitude) || 32.8597}
                                />
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Click on the map to automatically set coordinates.
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[var(--color-sunset-orange)] hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Updating Place...
                            </>
                        ) : (
                            <>
                                <Tag className="w-6 h-6" />
                                Update Place
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
