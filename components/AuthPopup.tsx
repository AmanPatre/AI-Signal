'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogIn, X, ShieldAlert } from 'lucide-react'
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
                    <ShieldAlert className="w-10 h-10" />
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2">Access Restricted</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    Please sign in to unlock the Prediction Engine, Compare Tool, and Institutional Intelligence.
                </p>

                <div className="flex flex-col w-full gap-3">
                    <Link
                        href="/auth/signin"
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        <LogIn className="w-5 h-5" /> Sign In to Proceed
                    </Link>
                    <Link
                        href="/"
                        className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all"
                        onClick={() => setShow(false)}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
