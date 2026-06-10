'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogIn, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

const PROTECTED_ROUTES = ['/colleges', '/predictor', '/compare', '/saved']

export default function AuthPopup() {
    const { status } = useSession()
    const pathname = usePathname()
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated' && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [status, pathname])

    if (!show) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-5">
                    <ShieldAlert className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Please sign in to unlock the Prediction Engine, Compare Tool, and Institutional Intelligence.
                </p>

                <div className="flex flex-col w-full gap-3">
                    <Link
                        href="/auth/signin"
                        className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <LogIn className="w-4 h-4" /> Sign In to Proceed
                    </Link>
                    <Link
                        href="/"
                        className="w-full text-gray-500 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setShow(false)}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
