"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { MapPin, Image as ImageIcon, Type, Tag, AlignLeft, DollarSign, Coffee, Utensils, UtensilsCrossed, IceCream, Carrot, Palmtree, Tent } from 'lucide-react';
import { turkeyLocations } from '@/data/turkey-locations';
import dynamic from 'next/dynamic';
import ImageUpload from '@/components/ImageUpload';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function AddPlacePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        alcoholStatus: 'NONE',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.error('You must be logged in to add a place');
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="flex justify-center py-20">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add place');
            }

            toast.success('Place added successfully!');
            router.push(`/places/${data.id}`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['Cafe', 'Museum', 'Hotel', 'Mall', 'Restaurant', 'Park', 'Beach', 'Camping'];

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[var(--color-orange-50)] px-8 py-6 border-b border-orange-100">
                    <h1 className="text-2xl font-bold text-[var(--color-deep-navy)]">Add a New Place</h1>
                    <p className="text-[var(--color-sunset-orange)] mt-1">Share your favorite spots with the community</p>
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
                                                    // Reset Category Specific Fields
                                                    priceRange: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.priceRange : '',
                                                    breakfast: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.breakfast : false,
                                                    lunch: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.lunch : false,
                                                    dinner: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.dinner : false,
                                                    dessert: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.dessert : false,
                                                    snack: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.snack : false,
                                                    veganOption: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.veganOption : false,
                                                    outdoorSeating: ['RESTAURANT', 'CAFE'].includes(newCategory) ? prev.outdoorSeating : false,
                                                    blueFlag: newCategory === 'BEACH' ? prev.blueFlag : false,
                                                    sunbed: newCategory === 'BEACH' ? prev.sunbed : false,
                                                    shower: newCategory === 'BEACH' ? prev.shower : false,
                                                    tentRental: newCategory === 'CAMPING' ? prev.tentRental : false,
                                                    electricity: newCategory === 'CAMPING' ? prev.electricity : false,
                                                    fireAllowed: newCategory === 'CAMPING' ? prev.fireAllowed : false,
                                                    caravanAccess: newCategory === 'CAMPING' ? prev.caravanAccess : false,
                                                    pool: ['HOTEL'].includes(newCategory) ? prev.pool : false,
                                                    gym: ['HOTEL'].includes(newCategory) ? prev.gym : false,
                                                    noiseLevel: ['HOTEL'].includes(newCategory) ? prev.noiseLevel : 'MODERATE',
                                                    foodCourt: ['MALL'].includes(newCategory) ? prev.foodCourt : false,
                                                    babyCare: ['MALL'].includes(newCategory) ? prev.babyCare : false,
                                                    petFriendly: ['PARK'].includes(newCategory) ? prev.petFriendly : false,
                                                    playground: ['PARK'].includes(newCategory) ? prev.playground : false,
                                                    largeArea: ['PARK'].includes(newCategory) ? prev.largeArea : false,
                                                    freeEntry: ['PARK'].includes(newCategory) ? prev.freeEntry : false,
                                                    isFamilyFriendly: ['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(newCategory) ? prev.isFamilyFriendly : false,
                                                    hasSmokingArea: ['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(newCategory) ? prev.hasSmokingArea : false,
                                                    alcoholStatus: ['RESTAURANT', 'CAFE', 'BEACH'].includes(newCategory) ? prev.alcoholStatus : 'NONE',
                                                    parking: ['HOTEL', 'MALL'].includes(newCategory) ? prev.parking : false,
                                                    wifi: ['HOTEL', 'MALL'].includes(newCategory) ? prev.wifi : false,
                                                    isPaid: ['BEACH', 'MUSEUM', 'OTHER'].includes(newCategory) ? prev.isPaid : false,
                                                    entranceFee: ['BEACH', 'MUSEUM', 'OTHER'].includes(newCategory) ? prev.entranceFee : '',
                                                    museumCardAccepted: ['MUSEUM', 'OTHER'].includes(newCategory) ? prev.museumCardAccepted : false,
                                                    photography: ['MUSEUM', 'OTHER'].includes(newCategory) ? prev.photography : false,
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
                                            required
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
                                                { key: 'breakfast', label: 'Breakfast', icon: Coffee },
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

                        {/* 2. MUSEUM & VISIT (Museum, Other) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['MUSEUM', 'OTHER'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['MUSEUM', 'OTHER'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        Visit Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Is Paid Toggle */}
                                        <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                                            <div>
                                                <div className="font-medium text-gray-900">Entrance Fee</div>
                                                <div className="text-xs text-gray-500">Is this place paid?</div>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={Boolean((formData as any).isPaid)} onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))} />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </div>
                                        </label>

                                        {/* Entrance Fee Input (Conditional) */}
                                        {(formData as any).isPaid && (
                                            <div className="transition-all animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount</label>
                                                <input type="text" name="entranceFee" placeholder="e.g. 150 TL" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={(formData as any).entranceFee} onChange={handleChange} />
                                            </div>
                                        )}

                                        {/* Museum Card */}
                                        <label className={`
                                            cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).museumCardAccepted ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium text-gray-800">Museum Card Accepted 🎫</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500" checked={Boolean((formData as any).museumCardAccepted)} onChange={(e) => setFormData(prev => ({ ...prev, museumCardAccepted: e.target.checked }))} />
                                        </label>

                                        {/* Photography */}
                                        <label className={`
                                            cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).photography ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}
                                        `}>
                                            <span className="font-medium text-gray-800">Photography Allowed 📸</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" checked={Boolean((formData as any).photography)} onChange={(e) => setFormData(prev => ({ ...prev, photography: e.target.checked }))} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. PARK (Park) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['PARK'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['PARK'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-green-50/50 p-6 rounded-2xl border border-green-100">
                                    <h3 className="font-semibold text-green-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        Park Amenities
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'petFriendly', label: 'Pet Friendly 🐾' },
                                            { key: 'playground', label: 'Playground 🛝' },
                                            { key: 'largeArea', label: 'Large Area 🌳' },
                                            { key: 'freeEntry', label: 'Free Entry 🎟️' },
                                        ].map((item) => (
                                            <label key={item.key} className={`
                                                cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                                ${(formData as any)[item.key] ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-gray-300'}
                                            `}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" className="w-5 h-5 rounded text-green-600 focus:ring-green-500" checked={Boolean((formData as any)[item.key])} onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. HOTEL & ACCOMMODATION (Hotel) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['HOTEL'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['HOTEL'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                    <h3 className="font-semibold text-blue-900">Hotel Amenities</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'parking', label: 'Parking 🅿️' },
                                            { key: 'pool', label: 'Swimming Pool 🏊' },
                                            { key: 'gym', label: 'Gym / Fitness 🏋️' },
                                            { key: 'wifi', label: 'Free Wi-Fi 📶' },
                                        ].map((item) => (
                                            <label key={item.key} className={`
                                                cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                                ${(formData as any)[item.key] ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}
                                            `}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" checked={Boolean((formData as any)[item.key])} onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))} />
                                            </label>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Noise Level</label>
                                        <select name="noiseLevel" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none bg-white" value={(formData as any).noiseLevel} onChange={handleChange}>
                                            <option value="QUIET">Quiet (Peaceful)</option>
                                            <option value="MODERATE">Moderate</option>
                                            <option value="LOUD">Loud (Busy Area)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 5. SHOPPING & MALL (Mall) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['MALL'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                            }`}>
                            {['MALL'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                                    <h3 className="font-semibold text-purple-900">Mall Services</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: 'parking', label: 'Parking 🅿️' },
                                            { key: 'foodCourt', label: 'Food Court 🍔' },
                                            { key: 'babyCare', label: 'Baby Care Room 👶' },
                                            { key: 'wifi', label: 'Free Wi-Fi 📶' },
                                        ].map((item) => (
                                            <label key={item.key} className={`
                                                cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                                ${(formData as any)[item.key] ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-gray-300'}
                                            `}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" checked={Boolean((formData as any)[item.key])} onChange={(e) => setFormData(prev => ({ ...prev, [item.key]: e.target.checked }))} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Photo Gallery Section - Moved Here */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                Photo Gallery
                            </h3>
                            <div>
                                <p className="text-sm text-gray-500 mb-3">Add up to 4 high-quality images. The first one will be the cover.</p>
                                <ImageUpload
                                    value={formData.images}
                                    onChange={(url) => {
                                        if (formData.images.length < 4) {
                                            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
                                        }
                                    }}
                                    onRemove={(url) => {
                                        setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }));
                                    }}
                                    maxFiles={4}
                                />
                            </div>
                        </div>

                        {/* Map Section - Moved Here */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4 mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[var(--color-sunset-orange)]" />
                                Pin Location
                            </h3>
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select exact location on map</label>
                                <LocationPicker
                                    onLocationSelect={(lat, lng) => {
                                        setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
                                    }}
                                    focusCity={formData.city}
                                />
                                {/* Hidden inputs */}
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex justify-between items-center px-4">
                                        <span className="text-xs text-gray-500">Lat</span>
                                        <span className="font-mono text-sm text-gray-700">{formData.latitude ? parseFloat(formData.latitude).toFixed(6) : '-'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex justify-between items-center px-4">
                                        <span className="text-xs text-gray-500">Lng</span>
                                        <span className="font-mono text-sm text-gray-700">{formData.longitude ? parseFloat(formData.longitude).toFixed(6) : '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[var(--color-sunset-orange)] text-white font-bold py-3 rounded-xl hover:bg-[#E05A2B] transition-colors shadow-lg shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Place'}
                        </button>
                    </div>

                </form >
            </div >
        </div >
    );
}
