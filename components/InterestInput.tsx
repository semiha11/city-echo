"use client";

import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { X } from 'lucide-react';

interface InterestInputProps {
    value: string[]; // Array of strings for tags
    onChange: (tags: string[]) => void;
}

export default function InterestInput({ value = [], onChange }: InterestInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed && !value.includes(trimmed)) {
                onChange([...value, trimmed]);
                setInputValue('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="space-y-3">
            <input
                type="text"
                placeholder="Type an interest and press Enter (e.g. Hiking)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />

            <div className="flex flex-wrap gap-2">
                {value.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1.5">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-rose-700 focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <p className="text-xs text-gray-500">
                Press Enter to add tag.
            </p>
        </div>
    );
}
