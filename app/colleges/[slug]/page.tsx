'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Star, IndianRupee, Building2, Heart, Award } from 'lucide-react'
import { formatCurrency, getRatingColor } from '@/lib/utils'
import { useCompareStore } from '@/store/compareStore'

const TABS = ['overview', 'courses', 'placements', 'reviews']

export default function CollegeDetailPage() {
  const { slug } = useParams()
  const { addCollege, colleges: compareColleges } = useCompareStore()

  const [college, setCollege] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [saved, setSaved] = useState(false)

  const fetchCollege = useCallback(async () => {
    try {
      const res = await fetch(`/api/colleges/${slug}`)
      const { data, error } = await res.json()
      if (error) throw new Error(error)
      setCollege(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { fetchCollege() }, [fetchCollege])

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
    } catch {
      alert('Please sign in to save colleges.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  )

  if (error || !college) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500 text-sm">{error || 'College not found'}</p>
      <Link href="/colleges" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold">Back to Colleges</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/colleges" className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Colleges
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{college.name}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <MapPin className="w-3.5 h-3.5" /> {college.city}, {college.state}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <Calendar className="w-3.5 h-3.5" /> Est. {college.established}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> {college.overallRating} / 5.0
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">


          <div className="flex-1">

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3.5 text-sm font-semibold capitalize flex-shrink-0 transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-6">{college.about}</p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Accreditations</h3>
                        <div className="flex flex-wrap gap-2">
                          {college.accreditations.map((a: string) => (
                            <span key={a} className="bg-blue-50 text-primary text-xs font-semibold px-3 py-1 rounded-full">{a}</span>
                          ))}
                        </div>
                      </div>
                      {college.campusSize && (
                        <div>
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Campus Size</h3>
                          <p className="text-gray-800 font-medium text-sm">{college.campusSize}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-4">Courses Offered</h2>
                    <div className="space-y-3">
                      {college.courses?.map((c: any) => (
                        <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{c.duration} · {c.eligibility}</p>
                          </div>
                          <span className="text-primary font-semibold text-sm ml-4 flex-shrink-0">
                            {formatCurrency(c.annualFees)}/yr
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'placements' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-4">Placement Statistics</h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Average Package</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(college.placementAvg)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">per annum</p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Highest Package</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(college.placementHighest)}</p>
                        <p className="text-xs text-primary/60 mt-0.5">per annum</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-3">Top Recruiters</h3>
                    <div className="flex flex-wrap gap-2">
                      {college.topRecruiters?.map((r: string) => (
                        <span key={r} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg">{r}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="font-semibold text-gray-900 mb-4">Student Reviews</h2>
                    <div className="space-y-4">
                      {college.reviews?.map((r: any) => (
                        <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{r.reviewerName}</p>
                              <p className="text-gray-400 text-xs">Class of {r.yearOfPassing}</p>
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{r.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          <aside className="lg:w-80 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="font-semibold text-gray-800 text-sm mb-4">Quick Actions</h3>

              <div className="space-y-3 mb-5">
                <button onClick={handleSave}
                  className={`w-full py-2.5 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${saved ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-primary text-primary hover:bg-blue-50'}`}>
                  <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
                  {saved ? 'Saved' : 'Save College'}
                </button>
                <button onClick={() => addCollege(college)} disabled={compareColleges.length >= 3}
                  className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40">
                  <Building2 className="w-4 h-4" /> Add to Compare
                </button>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Annual Fees</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(college.feesMin)}+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getRatingColor(college.overallRating)}`}>
                    {college.overallRating} / 5.0
                  </span>
                </div>
                {college.website && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Website</span>
                    <a href={college.website} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline truncate max-w-[160px]">
                      Visit →
                    </a>
                  </div>
                )}
              </div>

              {college.examAccepted?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Accepted Exams</p>
                  <div className="flex flex-wrap gap-1.5">
                    {college.examAccepted.map((e: string) => (
                      <span key={e} className="bg-blue-50 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{e}</span>
                    ))}
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
