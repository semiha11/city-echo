
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Save, Coffee, Utensils, UtensilsCrossed, IceCream, Carrot, Palmtree, Tent, Tag, Clock, UserCheck, Ticket, Mic2, Users, Music } from 'lucide-react';
import { turkeyLocations } from '@/data/turkey-locations';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';

interface EditPlaceModalProps {
    place: any;
    onClose: () => void;
    onUpdate: (updatedPlace: any) => void;
}

export default function EditPlaceModal({ place, onClose, onUpdate }: EditPlaceModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: place.title,
        category: place.category,
        city: place.city,
        // Added district field to state if not present (handled but good to be explicit)
        district: place.district || '',
        priceRange: place.priceRange || '',
        breakfast: place.breakfast,
        lunch: place.lunch,
        dinner: place.dinner,
        dessert: place.dessert,
        snack: place.snack,
        description: place.description,
        images: (place.images?.map((img: any) => img.url) as string[]) || [], // Load existing images
        // New Fields
        isPaid: place.isPaid || false,
        entranceFee: place.entranceFee || '',
        museumCardAccepted: place.museumCardAccepted || false,
        photography: place.photography || false,
        veganOption: place.veganOption || false,
        outdoorSeating: place.outdoorSeating || false,
        largeArea: place.largeArea || false,
        petFriendly: place.petFriendly || false,
        playground: place.playground || false,
        freeEntry: place.freeEntry || false,
        parking: place.parking || false,
        wifi: place.wifi || false,
        pool: place.pool || false,
        gym: place.gym || false,
        noiseLevel: place.noiseLevel || 'MODERATE',
        foodCourt: place.foodCourt || false,
        babyCare: place.babyCare || false,

        // Beach & Camping
        blueFlag: place.blueFlag || false,
        sunbed: place.sunbed || false,
        shower: place.shower || false,
        tentRental: place.tentRental || false,
        electricity: place.electricity || false,
        fireAllowed: place.fireAllowed || false,
        caravanAccess: place.caravanAccess || false,
        // New Features
        isFamilyFriendly: (place as any).isFamilyFriendly || false,
        hasSmokingArea: (place as any).hasSmokingArea || false,
        alcoholStatus: (place as any).alcoholStatus || null,
        // Activity & Nightlife
        duration: (place as any).duration || '',
        reservationRequired: (place as any).reservationRequired || false,
        bestTime: (place as any).bestTime || '',
        damAllowed: (place as any).damAllowed || false,
        musicType: (place as any).musicType || '',
        editorNote: (place as any).editorNote || '',
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Sanitize data based on category
        const sanitizedData = { ...formData };
        const category = sanitizedData.category;

        // Reset unrelated fields
        if (!['RESTAURANT', 'CAFE'].includes(category)) {
            sanitizedData.priceRange = '';
            sanitizedData.breakfast = false;
            sanitizedData.lunch = false;
            sanitizedData.dinner = false;
            sanitizedData.dessert = false;
            sanitizedData.snack = false;
            sanitizedData.veganOption = false;
            sanitizedData.outdoorSeating = false;
        }

        if (category !== 'BEACH') {
            sanitizedData.blueFlag = false;
            sanitizedData.sunbed = false;
            sanitizedData.shower = false;
        }

        if (category !== 'CAMPING') {
            sanitizedData.tentRental = false;
            sanitizedData.electricity = false;
            sanitizedData.fireAllowed = false;
            sanitizedData.caravanAccess = false;
        }

        if (category !== 'HOTEL') {
            sanitizedData.pool = false;
            sanitizedData.gym = false;
            sanitizedData.noiseLevel = 'MODERATE';
        }

        if (category !== 'MALL') {
            sanitizedData.foodCourt = false;
            sanitizedData.babyCare = false;
        }

        if (category !== 'PARK') {
            sanitizedData.petFriendly = false;
            sanitizedData.playground = false;
            sanitizedData.largeArea = false;
            sanitizedData.freeEntry = false;
        }

        // New Feature Cleanup
        if (!['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(category)) {
            sanitizedData.isFamilyFriendly = false;
            sanitizedData.hasSmokingArea = false;
        }

        if (!['RESTAURANT', 'CAFE', 'BEACH'].includes(category)) {
            sanitizedData.alcoholStatus = null;
        }

        if (category !== 'ACTIVITY') {
            sanitizedData.duration = null;
            sanitizedData.reservationRequired = false;
            sanitizedData.bestTime = null;
        }

        if (!['BAR', 'CLUB'].includes(category)) {
            sanitizedData.musicType = null;
            sanitizedData.damAllowed = false;
        }

        // Shared conditional fields cleanup
        if (!['HOTEL', 'MALL'].includes(category)) {
            sanitizedData.parking = false;
            sanitizedData.wifi = false;
        }

        if (!['BEACH', 'MUSEUM', 'OTHER', 'BAR', 'CLUB'].includes(category)) {
            sanitizedData.isPaid = false;
            sanitizedData.entranceFee = '';
        }

        if (!['MUSEUM', 'OTHER'].includes(category)) {
            sanitizedData.museumCardAccepted = false;
            sanitizedData.photography = false;
        }

        try {
            const res = await fetch(`/api/places/${place.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitizedData)
            });

            if (!res.ok) throw new Error('Failed to update');

            const updated = await res.json();
            onUpdate(updated);
            onClose();
            toast.success('Place updated successfully');
            router.refresh();
        } catch (error) {
            toast.error('Error updating place');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-900">Edit Place</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="">
                        {/* Basic Info */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4 mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-sunset-orange)] outline-none bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={(e) => {
                                            const newCategory = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                category: newCategory,
                                                // Reset Category Specific Fields (Same logic as before)
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
                                                alcoholStatus: ['RESTAURANT', 'CAFE', 'BEACH'].includes(newCategory) ? prev.alcoholStatus : null,
                                                // Category Reset Logic
                                                duration: newCategory === 'ACTIVITY' ? prev.duration : '',
                                                reservationRequired: ['ACTIVITY', 'RESTAURANT', 'BAR', 'CLUB'].includes(newCategory) ? prev.reservationRequired : false,
                                                bestTime: newCategory === 'ACTIVITY' ? prev.bestTime : '',
                                                damAllowed: ['BAR', 'CLUB'].includes(newCategory) ? prev.damAllowed : false,
                                                musicType: ['BAR', 'CLUB'].includes(newCategory) ? prev.musicType : '',
                                                isPaid: ['BEACH', 'MUSEUM', 'OTHER', 'BAR', 'CLUB'].includes(newCategory) ? prev.isPaid : false,
                                                entranceFee: ['BEACH', 'MUSEUM', 'OTHER', 'BAR', 'CLUB'].includes(newCategory) ? prev.entranceFee : '',
                                                parking: ['HOTEL', 'MALL'].includes(newCategory) ? prev.parking : false,
                                                wifi: ['HOTEL', 'MALL'].includes(newCategory) ? prev.wifi : false,

                                                museumCardAccepted: ['MUSEUM', 'OTHER'].includes(newCategory) ? prev.museumCardAccepted : false,
                                                photography: ['MUSEUM', 'OTHER'].includes(newCategory) ? prev.photography : false,
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-sunset-orange)] outline-none bg-white"
                                    >
                                        <option value="">Select category</option>
                                        {['CAFE', 'MUSEUM', 'HOTEL', 'MALL', 'RESTAURANT', 'PARK', 'BEACH', 'CAMPING', 'ACTIVITY', 'BAR', 'CLUB'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-sunset-orange)] outline-none bg-white resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4 mb-6">
                            <h3 className="font-semibold text-gray-900 border-b pb-2">Location Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <select
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFormData(prev => ({ ...prev, city: e.target.value, district: '' }));
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-sunset-orange)] outline-none bg-white"
                                    >
                                        <option value="">Select city</option>
                                        {Object.keys(turkeyLocations).sort().map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <select
                                        name="district"
                                        required
                                        disabled={!formData.city}
                                        value={formData.district || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-sunset-orange)] outline-none bg-white disabled:bg-gray-50"
                                    >
                                        <option value="">Select district</option>
                                        {formData.city && turkeyLocations[formData.city as keyof typeof turkeyLocations]?.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Features Sections */}
                        {/* 1. FOOD & DRINK (Restaurant, Cafe) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['RESTAURANT', 'CAFE'].includes(formData.category) ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
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
                                                <label key={price.value} className={`flex-1 cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-1 transition-all bg-white ${(formData as any).priceRange === price.value ? 'border-orange-500 ring-1 ring-orange-500 text-orange-700' : 'border-gray-200 hover:border-gray-300'}`}>
                                                    <input type="radio" name="priceRange" value={price.value} className="hidden" checked={formData.priceRange === price.value} onChange={handleChange} />
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
                                                    <label key={meal.key} className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-2 transition-all bg-white ${(formData as any)[meal.key] ? 'border-teal-500 ring-1 ring-teal-500 text-teal-700 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                        <input type="checkbox" name={meal.key} className="hidden" checked={Boolean((formData as any)[meal.key])} onChange={handleChange} />
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-xs font-medium">{meal.label}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {/* Features */}
                                    <div className="flex gap-4">
                                        <label className={`flex-1 cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).veganOption ? 'border-green-500 ring-1 ring-green-500 text-green-900 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
`}>
                                            <span className="font-medium">Vegan Options 🌱</span>
                                            <input type="checkbox" name="veganOption" className="w-5 h-5 rounded text-green-600 focus:ring-green-500" checked={Boolean((formData as any).veganOption)} onChange={handleChange} />
                                        </label>
                                        <label className={`flex-1 cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white
                                            ${(formData as any).outdoorSeating ? 'border-blue-500 ring-1 ring-blue-500 text-blue-900 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
`}>
                                            <span className="font-medium">Outdoor Seating ☀️</span>
                                            <input type="checkbox" name="outdoorSeating" className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" checked={Boolean((formData as any).outdoorSeating)} onChange={handleChange} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BEACH */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['BEACH'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
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
                                                <input type="checkbox" name={item.key} className="w-5 h-5 rounded text-cyan-600 focus:ring-cyan-500" checked={Boolean((formData as any)[item.key])} onChange={handleChange} />
                                            </label>
                                        ))}

                                        {/* Fee Input */}
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

                        {/* NIGHTLIFE (BAR, CLUB) */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['BAR', 'CLUB'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                            {['BAR', 'CLUB'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                                    <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                                        <Music className="w-5 h-5" />
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

                                        <label className={`flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer hover:border-gray-300 transition-all h-full ${Boolean((formData as any).isPaid) ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <Ticket className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">Entrance Fee</div>
                                                    <div className="text-xs text-gray-500">Is there an entry fee?</div>
                                                </div>
                                            </div>
                                            <input type="checkbox" name="isPaid" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" checked={Boolean((formData as any).isPaid)} onChange={handleChange} />
                                        </label>

                                        {(formData as any).isPaid && (
                                            <div className="md:col-span-2 transition-all animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
                                                <input type="text" name="entranceFee" placeholder="e.g. 500 TL" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" value={(formData as any).entranceFee} onChange={handleChange} />
                                            </div>
                                        )}

                                        <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any).damAllowed ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center gap-3 w-full">
                                                <input
                                                    type="checkbox"
                                                    name="damAllowed"
                                                    checked={Boolean((formData as any).damAllowed)}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="w-5 h-5 text-purple-600" />
                                                    <span>Solo Entry Permitted 👤</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CAMPING */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['CAMPING'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
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
                                                <input type="checkbox" name={item.key} className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500" checked={Boolean((formData as any)[item.key])} onChange={handleChange} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* GENERAL AMENITIES */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                            {['RESTAURANT', 'CAFE', 'MALL', 'BEACH'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        Important Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any).isFamilyFriendly ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <span className="font-medium text-gray-800">Family Friendly 👨‍👩‍👧‍👦</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500" checked={Boolean((formData as any).isFamilyFriendly)} onChange={(e) => setFormData(prev => ({ ...prev, isFamilyFriendly: e.target.checked }))} />
                                        </label>
                                        <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any).hasSmokingArea ? 'border-gray-500 bg-gray-100 ring-1 ring-gray-400' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <span className="font-medium text-gray-800">Smoking Area 🚬</span>
                                            <input type="checkbox" className="w-5 h-5 rounded text-gray-600 focus:ring-gray-500" checked={Boolean((formData as any).hasSmokingArea)} onChange={(e) => setFormData(prev => ({ ...prev, hasSmokingArea: e.target.checked }))} />
                                        </label>
                                        {['RESTAURANT', 'CAFE', 'BEACH'].includes(formData.category) && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Service 🍷</label>
                                                <div className="flex gap-4">
                                                    {[
                                                        { value: 'NONE', label: 'No Alcohol', icon: '🥤' },
                                                        { value: 'ALCOHOLIC', label: 'Alcohol Served', icon: '🍷' },
                                                        { value: 'BOTH', label: 'Both', icon: '🍹' }
                                                    ].map((opt) => (
                                                        <label key={opt.value} className={`flex-1 cursor-pointer rounded-xl border p-3 flex flex-col items-center gap-1 transition-all bg-white ${(formData as any).alcoholStatus === opt.value ? 'border-indigo-500 ring-1 ring-indigo-500 text-indigo-700 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                            <input type="radio" name="alcoholStatus" value={opt.value} className="hidden" checked={(formData as any).alcoholStatus === opt.value} onChange={(e) => setFormData({ ...formData, alcoholStatus: e.target.value })} />
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
                        {/* MUSEUM & VISIT */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['MUSEUM', 'OTHER'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                            {['MUSEUM', 'OTHER'].includes(formData.category) && (
                                <div className="space-y-4 pt-2 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5" />
                                        Visit Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                                            <div><div className="font-medium text-gray-900">Entrance Fee</div><div className="text-xs text-gray-500">Is this place paid?</div></div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" name="isPaid" className="sr-only peer" checked={Boolean((formData as any).isPaid)} onChange={handleChange} />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600"></div>
                                            </div>
                                        </label>
                                        {(formData as any).isPaid && (
                                            <div className="transition-all animate-in fade-in slide-in-from-top-2"><label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount</label><input type="text" name="entranceFee" placeholder="e.g. 150 TL" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={(formData as any).entranceFee} onChange={handleChange} /></div>
                                        )}
                                        <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any).museumCardAccepted ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <span className="font-medium text-gray-800">Museum Card Accepted 🎫</span>
                                            <input type="checkbox" name="museumCardAccepted" className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500" checked={Boolean((formData as any).museumCardAccepted)} onChange={handleChange} />
                                        </label>
                                        <label className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any).photography ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <span className="font-medium text-gray-800">Photography Allowed 📸</span>
                                            <input type="checkbox" name="photography" className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" checked={Boolean((formData as any).photography)} onChange={handleChange} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PARK */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['PARK'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
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
                                            <label key={item.key} className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any)[item.key] ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" name={item.key} className="w-5 h-5 rounded text-green-600 focus:ring-green-500" checked={Boolean((formData as any)[item.key])} onChange={handleChange} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* HOTEL */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['HOTEL'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
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
                                            <label key={item.key} className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any)[item.key] ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" name={item.key} className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" checked={Boolean((formData as any)[item.key])} onChange={handleChange} />
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

                        {/* MALL */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${['MALL'].includes(formData.category) ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
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
                                            <label key={item.key} className={`cursor-pointer rounded-xl border p-4 flex items-center justify-between transition-all bg-white ${(formData as any)[item.key] ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <span className="font-medium text-gray-800">{item.label}</span>
                                                <input type="checkbox" name={item.key} className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500" checked={Boolean((formData as any)[item.key])} onChange={handleChange} />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Photo Gallery - Moved to Bottom (before final buttons) */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="font-semibold text-gray-900 border-b pb-4 mb-4">Photo Gallery (Max 4)</h3>
                            <ImageUpload
                                value={formData.images}
                                onChange={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                                onRemove={(url) => setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== url) }))}
                                maxFiles={4}
                            />
                        </div>

                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-[var(--color-sunset-orange)] text-white rounded-lg font-medium hover:bg-[#E05A2B] transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
