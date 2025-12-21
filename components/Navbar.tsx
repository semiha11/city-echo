"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User as UserIcon, LogOut, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
    const { data: session } = useSession();
    const user = session?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-[var(--color-off-white)]/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo className="transition-transform group-hover:scale-105" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/search" className="text-[var(--color-deep-navy)] hover:text-[var(--color-sunset-orange)] font-medium transition-colors">
                            Explore
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {(user as any).role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="text-[var(--color-deep-navy)] hover:text-[var(--color-sunset-orange)] font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/add-place"
                                    className="flex items-center gap-2 bg-[var(--color-sunset-orange)] text-white px-4 py-2 rounded-full font-medium hover:bg-[#E05A2B] transition-colors shadow-md hover:shadow-lg"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add Place
                                </Link>

                                <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                                    <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-3 transition-colors group">
                                        {/* Simple avatar placeholder if image exists, or Icon */}
                                        <div className="h-8 w-8 bg-[var(--color-orange-100)] rounded-full flex items-center justify-center text-[var(--color-sunset-orange)]">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name || ''} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <UserIcon className="h-4 w-4" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-[var(--color-deep-navy)] group-hover:text-[var(--color-sunset-orange)] transition-colors">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="p-2 text-gray-400 hover:text-[var(--color-sunset-orange)] transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-[var(--color-deep-navy)] hover:text-[var(--color-sunset-orange)] font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-[var(--color-space-blue)] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#25324B] transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button - simplified for now */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
                            <UserIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white p-4">
                    {user ? (
                        <div className="flex flex-col gap-4">
                            <Link href="/profile" className="flex items-center gap-2 px-2 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                                {user.name}
                                <span className="ml-auto text-xs text-[var(--color-sunset-orange)] font-normal">View Profile</span>
                            </Link>
                            <Link href="/add-place" className="block px-2 py-2 text-[var(--color-sunset-orange)] font-medium">Add Place</Link>
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left px-2 py-2 text-gray-600">Logout</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link href="/login" className="block px-2 py-2 text-gray-600">Log in</Link>
                            <Link href="/register" className="block px-2 py-2 text-[var(--color-sunset-orange)] font-medium">Sign up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
