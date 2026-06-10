'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, GraduationCap, GitCompare, Bookmark, User, LogIn, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { data: session, status } = useSession()

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Colleges', href: '/colleges' },
        { name: 'AI Predictor', href: '/predictor' },
        { name: 'Compare', href: '/compare' },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-1.5 rounded-lg text-white group-hover:bg-primary-dark transition-colors">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-primary tracking-tight">AI Signal</span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive(link.href)
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-gray-300'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {status === 'loading' ? (
                            <div className="h-8 w-20 bg-gray-100 animate-pulse rounded"></div>
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/saved"
                                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isActive('/saved') ? 'text-primary' : 'text-gray-500'}`}
                                    title="Saved Colleges"
                                >
                                    <Bookmark className="h-5 w-5" />
                                </Link>

                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="User"
                                            className="h-8 w-8 rounded-full border border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/auth/signin"
                                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-4 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-all px-5 py-2 rounded-lg shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(link.href)
                                    ? 'bg-blue-50 border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4 pb-3 border-t border-gray-200">
                        {session ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="" className="h-10 w-10 rounded-full" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="ml-auto bg-white p-1 rounded-full text-gray-400 hover:text-red-500"
                                >
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1 px-4">
                                <Link
                                    href="/auth/signin"
                                    className="block text-center w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="block text-center w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
