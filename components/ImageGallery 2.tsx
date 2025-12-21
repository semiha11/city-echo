"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
    images: { url: string }[];
    placeTitle: string;
}

export default function ImageGallery({ images, placeTitle }: ImageGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // If no images, show fallback
    if (!images || images.length === 0) {
        return (
            <div className="aspect-[16/9] w-full bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-16 w-16" />
                    <span className="font-medium">Görsel Bulunmuyor</span>
                </div>
            </div>
        );
    }

    const mainImage = images[0].url;
    const sideImages = images.slice(1, 4); // Max 3 side images

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % images.length);
        }
    };
    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
        }
    };

    return (
        <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                {/* Main Image (Left, 3 cols) */}
                <div
                    className={`relative h-full cursor-pointer group ${sideImages.length > 0 ? 'md:col-span-3' : 'md:col-span-4'}`}
                    onClick={() => openLightbox(0)}
                >
                    <img
                        src={mainImage}
                        alt={`${placeTitle} - Main`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Side Images (Right, 1 col, vertical stack) */}
                {sideImages.length > 0 && (
                    <div className="hidden md:flex flex-col gap-2 h-full">
                        {sideImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative flex-1 cursor-pointer overflow-hidden group"
                                onClick={() => openLightbox(idx + 1)}
                            >
                                <img
                                    src={img.url}
                                    alt={`${placeTitle} - ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Show "+X photos" on the last image if there are more */}
                                {idx === 2 && images.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg backdrop-blur-[2px] hover:bg-black/40 transition-colors">
                                        +{images.length - 4} Fotoğraf
                                    </div>
                                )}
                                {!(idx === 2 && images.length > 4) && (
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center">
                            {/* Navigation Buttons */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 md:-left-12 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 md:-right-12 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </button>
                                </>
                            )}

                            {/* Main Lightbox Image */}
                            <motion.img
                                key={lightboxIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                src={images[lightboxIndex].url}
                                alt={`Gallery ${lightboxIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Counter */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
                                {lightboxIndex + 1} / {images.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
