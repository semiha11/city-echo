"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import { cityCoordinates } from '@/data/turkey-locations';

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    focusCity?: string;
    initialLat?: number;
    initialLng?: number;
}

// Component to handle map clicks
function MapEvents({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to handle flying to selected city
function MapController({ city }: { city?: string }) {
    const map = useMap();

    useEffect(() => {
        if (city && cityCoordinates[city]) {
            const { lat, lng } = cityCoordinates[city];
            map.flyTo([lat, lng], 10);
        }
    }, [city, map]);

    return null;
}

export default function LocationPicker({ onLocationSelect, focusCity, initialLat, initialLng }: LocationPickerProps) {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    // Default center (Turkey center roughly)
    const defaultCenter: [number, number] = [39.0, 35.0];
    const center = position || defaultCenter;

    if (!mounted) {
        return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>;
    }

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {position && <Marker position={position} />}

                <MapEvents onSelect={handleSelect} />
                <MapController city={focusCity} />
            </MapContainer>

            {!position && (
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-[1000]">
                    <span className="bg-white/90 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-md backdrop-blur-sm">
                        Tap anywhere on the map to set location
                    </span>
                </div>
            )}
        </div>
    );
}
