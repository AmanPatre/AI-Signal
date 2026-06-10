'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react'

function SignInForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl,
            })

            if (res?.error) {
                setError('Invalid email or password')
            } else {
                router.push(callbackUrl)
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl })
    }

    return (
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
            <div className="text-center">
                <div className="bg-primary p-3 rounded-2xl text-white inline-block mb-4">
                    <GraduationCap className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Please enter your details to sign in
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm">
                        <a href="#" className="font-medium text-primary hover:text-primary-dark">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98]"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-dark">
                    Get started for free
                </Link>
            </p>
        </div>
    )
}

export default function SignInPage() {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="h-96 w-full flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
                <SignInForm />
            </Suspense>
        </div>
    )
}
