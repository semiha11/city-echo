"use client";

import { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
    onImageSelect: (file: File | null) => void;
    currentImageUrl?: string;
}

export default function ImageUploader({ onImageSelect, currentImageUrl }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeImage = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            {preview ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={removeImage}
                            type="button"
                            className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                        ${isDragging
                            ? 'border-[var(--color-sunset-orange)] bg-[var(--color-orange-50)]/50'
                            : 'border-gray-200 hover:border-[var(--color-sunset-orange)]/50 hover:bg-gray-50'
                        }
                    `}
                >
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className={`
                            p-3 rounded-full 
                            ${isDragging ? 'bg-[var(--color-orange-100)]' : 'bg-gray-100'}
                        `}>
                            <UploadCloud className={`
                                h-6 w-6 
                                ${isDragging ? 'text-[var(--color-sunset-orange)]' : 'text-gray-400'}
                            `} />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-gray-700">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
