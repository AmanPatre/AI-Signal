'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Heart, MapPin, IndianRupee, Star, LogOut, User, GraduationCap, ArrowRight } from 'lucide-react'
import { formatCurrency, getRatingColor } from '@/lib/utils'

export default function SavedPage() {
  const { data: session, status } = useSession()
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSaved = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/saved')
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setColleges(json.data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved colleges')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') fetchSaved()
  }, [status, fetchSaved])

  const handleUnsave = async (id: string) => {
    try {
      await fetch(`/api/saved/${id}`, { method: 'DELETE' })
      setColleges(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (status === 'loading') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  )

  if (status === 'unauthenticated') return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-12 rounded-[2rem] shadow-2xl shadow-slate-200 text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Your shortlist is waiting</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">Sign in to sync your saved colleges across all your devices.</p>
        <Link href="/auth/signin" className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg block hover:shadow-xl transition-all">Sign In Now</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-slate-900 text-white pt-16 pb-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(65,105,225,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 relative">
          <div className="space-y-2">
            <Link href="/" className="text-slate-400 hover:text-white font-bold text-sm mb-4 inline-block">Back to Dashboard</Link>
            <h1 className="text-5xl font-black tracking-tight mb-2">My Shortlist</h1>
            <p className="text-slate-400 font-medium">Tracking {colleges.length} preferred institutions.</p>
          </div>
          {session && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black uppercase tracking-tighter">
                {session.user?.name?.slice(0, 2)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Signed in as</p>
                <p className="font-bold text-sm">{session.user?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-white rounded-[2rem] border border-slate-100 animate-pulse" />)}
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-20 text-center">
            <GraduationCap className="w-20 h-20 text-slate-200 mx-auto mb-8" />
            <h3 className="text-3xl font-black text-slate-900 mb-4">No colleges saved yet</h3>
            <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Start your journey by exploring and shortlisting the best institutions in India.</p>
            <Link href="/colleges" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black inline-flex items-center gap-2 hover:bg-black transition-all">Start Exploring <ArrowRight className="w-5 h-5" /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college) => (
              <div key={college.id} className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:-translate-y-1 transition-all">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {college.overallRating} Rating
                    </div>
                    <button onClick={() => handleUnsave(college.id)} className="text-red-500 hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6 fill-red-500" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight min-h-[4rem] line-clamp-2">
                    {college.name}
                  </h3>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-sm uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-slate-300" />
                      {college.city}, {college.state}
                    </div>
                    <div className="flex items-center gap-3 text-primary font-black text-lg">
                      <IndianRupee className="w-5 h-5" />
                      {formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}
                    </div>
                  </div>

                  <Link href={`/colleges/${college.slug}`} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 group-hover:bg-primary transition-all">
                    Full Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
