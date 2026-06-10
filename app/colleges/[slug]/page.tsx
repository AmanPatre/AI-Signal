'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Star, IndianRupee, Building2, Award, Heart } from 'lucide-react'
import { formatCurrency, getRatingColor } from '@/lib/utils'
import { useCompareStore } from '@/store/compareStore'

export default function CollegeDetailPage() {
  const { slug } = useParams()
  const { addCollege, colleges: compareColleges } = useCompareStore()

  const [college, setCollege] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [saved, setSaved] = useState(false)

  const fetchCollege = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/colleges/${slug}`)
      const { data, error } = await res.json()
      if (error) throw new Error(error)
      setCollege(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load details')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchCollege()
  }, [fetchCollege])

  const handleSave = async () => {
    try {
      if (saved) {
        await fetch(`/api/saved/${college.id}`, { method: 'DELETE' })
      } else {
        await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId: college.id }),
        })
      }
      setSaved(!saved)
    } catch (err) {
      alert('Action failed. Are you signed in?')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
    </div>
  )

  if (error || !college) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <p className="text-slate-500 mb-6 font-medium">{error || 'College not found'}</p>
      <Link href="/colleges" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20">Back to Discovery</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/colleges" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Colleges
          </Link>
          <h1 className="text-5xl font-black mb-6 tracking-tight">{college.name}</h1>
          <div className="flex flex-wrap gap-6 text-primary-foreground/80 font-medium">
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"><MapPin className="w-4 h-4" />{college.city}, {college.state}</span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"><Calendar className="w-4 h-4" />Est. {college.established}</span>
            <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{college.overallRating} Rating</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <nav className="flex p-2 bg-slate-50 gap-1">
                {['overview', 'courses', 'placements', 'reviews'].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 px-6 rounded-2xl text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900 group'}`}>
                    {t}
                  </button>
                ))}
              </nav>

              <div className="p-8 md:p-12">
                {activeTab === 'overview' && (
                  <div className="animate-in fade-in duration-500">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">About the Institution</h2>
                    <p className="text-slate-600 leading-relaxed text-lg mb-10 whitespace-pre-line">{college.about}</p>
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Accreditations</h3>
                        <div className="flex flex-wrap gap-2">
                          {college.accreditations.map((a: string) => <span key={a} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold">{a}</span>)}
                        </div>
                      </div>
                      {college.campusSize && (
                        <div>
                          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Campus Environment</h3>
                          <p className="text-slate-900 font-bold text-lg">{college.campusSize}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Academic Programs</h2>
                    <div className="space-y-4">
                      {college.courses?.map((c: any) => (
                        <div key={c.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-1">{c.name}</h4>
                            <p className="text-sm text-slate-500 font-medium">{c.duration} • {c.eligibility}</p>
                          </div>
                          <span className="text-xl font-black text-primary">{formatCurrency(c.annualFees)}<span className="text-xs text-slate-400 font-bold ml-1">/ year</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'placements' && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Career Outcomes</h2>
                    <div className="grid sm:grid-cols-2 gap-6 mb-10">
                      <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-4">Average Salary</span>
                        <p className="text-3xl font-black">{formatCurrency(college.placementAvg)}</p>
                      </div>
                      <div className="p-8 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
                        <span className="text-xs font-black uppercase text-white/60 tracking-widest block mb-4">Highest CTC</span>
                        <p className="text-3xl font-black">{formatCurrency(college.placementHighest)}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-4">Top Hiring Partners</h3>
                    <div className="flex flex-wrap gap-3">
                      {college.topRecruiters?.map((r: string) => <span key={r} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600">{r}</span>)}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900">Student Voices</h2>
                    {college.reviews?.map((r: any) => (
                      <div key={r.id} className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="font-bold text-slate-900">{r.reviewerName}</h4>
                            <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Class of {r.yearOfPassing}</p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}
                          </div>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">"{r.content}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-96 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-12">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Admission Desk</h3>
              <div className="space-y-4 mb-8">
                <button onClick={handleSave} className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-bold flex items-center justify-center gap-3 hover:bg-primary/5 transition-colors">
                  <Heart className={`w-5 h-5 ${saved ? 'fill-primary' : ''}`} />
                  {saved ? 'Saved to Favorites' : 'Shortlist College'}
                </button>
                <button onClick={() => addCollege(college)} disabled={compareColleges.length >= 3} className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-3 hover:bg-primary-dark transition-all disabled:opacity-30">
                  <Building2 className="w-5 h-5" />
                  Add to Comparison
                </button>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">Tuition Range</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(college.feesMin)} +</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400">NIRF Rating</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-black ${getRatingColor(college.overallRating)}`}>{college.overallRating} / 5.0</span>
                </div>
              </div>

              {college.examAccepted?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Entrance Exams</h4>
                  <div className="flex flex-wrap gap-2">
                    {college.examAccepted.map((e: string) => <span key={e} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">{e}</span>)}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
