"use client";

import React from 'react';

export default function Logo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                {/* City Silhouette becoming Sound Wave */}
                <path
                    d="M4 32H36"
                    stroke="#1B263B"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* Building 1 (Left - Navy) */}
                <path
                    d="M6 32V18L10 16V32"
                    stroke="#1B263B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Building 2 (Navy) */}
                <path
                    d="M14 32V22L18 20V32"
                    stroke="#1B263B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Building 3 -> Wave Start (Navy) */}
                <path
                    d="M22 32V14"
                    stroke="#1B263B"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* The Echo Peak (Orange) */}
                <path
                    d="M26 32V8"
                    stroke="#FF6B35"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Wave Decreasing (Navy) */}
                <path
                    d="M30 32V16"
                    stroke="#1B263B"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M34 32V24"
                    stroke="#1B263B"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className="text-xl tracking-tight font-display text-[var(--color-deep-navy)]">
                        <span className="font-light">City</span>
                        <span className="font-bold">Echo</span>
                    </span>
                </div>
            )}
        </div>
    );
}
