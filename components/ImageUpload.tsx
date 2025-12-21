"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

interface ImageUploadProps {
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
    maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onRemove,
    value,
    maxFiles = 4
}) => {
    const handleUpload = useCallback((result: any) => {
        onChange(result.info.secure_url);
    }, [onChange]);

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[150px] h-[150px] rounded-lg overflow-hidden shadow-md group border border-gray-200">
                        <div className="z-10 absolute top-2 right-2">
                             <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                             >
                                <Trash className="w-4 h-4" />
                             </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            
            {value.length < maxFiles && (
                <CldUploadWidget
                    onSuccess={handleUpload}
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
                    options={{
                        maxFiles: maxFiles - value.length,
                        folder: "cityecho",
                        clientAllowedFormats: ["image"], 
                    }}
                >
                    {({ open }) => {
                        const onClick = () => {
                            open();
                        };

                        return (
                            <button
                                type="button"
                                onClick={onClick}
                                className="flex flex-col items-center justify-center w-36 h-36 rounded-xl border-2 border-dashed border-gray-300 hover:border-[var(--color-sunset-orange)] hover:bg-orange-50 transition-all text-gray-400 hover:text-[var(--color-sunset-orange)]"
                            >
                                <ImagePlus className="w-8 h-8 mb-2" />
                                <span className="text-sm font-medium">Upload Image</span>
                                <span className="text-xs mt-1">Max {maxFiles}</span>
                            </button>
                        );
                    }}
                </CldUploadWidget>
            )}
        </div>
    );
};

export default ImageUpload;
