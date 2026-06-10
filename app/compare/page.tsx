'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useCompareStore } from '@/store/compareStore'
import { ArrowLeft, MapPin, IndianRupee, Star, Award, X, Building2, Briefcase, GraduationCap, Calendar, Maximize2, Trophy } from 'lucide-react'
import { formatCurrency, getRatingColor } from '@/lib/utils'

export default function ComparePage() {
  const { colleges, removeCollege, clearColleges } = useCompareStore()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchComparison = useCallback(async () => {
    if (colleges.length < 2) return
    setLoading(true)
    try {
      const ids = colleges.map(c => c.id).join(',')
      const res = await fetch(`/api/colleges/compare?ids=${ids}`)
      const { data, error } = await res.json()
      if (error) throw new Error(error)
      setData(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to sync comparison data')
    } finally {
      setLoading(false)
    }
  }, [colleges])

  useEffect(() => {
    fetchComparison()
  }, [fetchComparison])

  if (colleges.length < 2) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-white">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative p-8 bg-white/50 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl">
          <Building2 className="w-16 h-16 text-primary" />
        </div>
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Compare like a Pro</h2>
      <p className="text-slate-500 mb-10 max-w-sm text-center font-medium text-lg leading-relaxed">
        Choose up to 3 colleges from our discovery engine to unlock deep technical side-by-side insights.
      </p>
      <Link href="/colleges" className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200">
        <span className="relative z-10 flex items-center gap-2">
          Start Discovery
          <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  )

  const rows = [
    {
      label: 'Rating',
      icon: <Star className="w-4 h-4" />,
      render: (c: any) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
            <span className={`text-lg font-black ${getRatingColor(c.overallRating)}`}>{c.overallRating}</span>
            <span className="text-slate-400 text-sm font-bold ml-1">/5</span>
          </div>
        </div>
      )
    },
    {
      label: 'Annual Fees',
      icon: <IndianRupee className="w-4 h-4" />,
      render: (c: any) => (
        <div className="space-y-1">
          <div className="text-xl font-black text-slate-900 leading-none">
            {formatCurrency(c.feesMax)}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maximum Estimate</div>
        </div>
      )
    },
    {
      label: 'Placement (Avg)',
      icon: <Briefcase className="w-4 h-4" />,
      render: (c: any) => (
        <div className="text-lg font-black text-emerald-600">
          {c.placementAvg ? formatCurrency(c.placementAvg) : '—'}
        </div>
      )
    },
    {
      label: 'Placement (Max)',
      icon: <Trophy className="w-4 h-4" />,
      render: (c: any) => (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-lg">
          <span className="text-lg font-black">{c.placementHighest ? formatCurrency(c.placementHighest) : '—'}</span>
        </div>
      )
    },
    {
      label: 'Courses Offered',
      icon: <GraduationCap className="w-4 h-4" />,
      render: (c: any) => (
        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
          {c.courses?.slice(0, 4).map((course: any) => (
            <span key={course.id} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 truncate hover:bg-slate-50 transition-colors cursor-default">
              {course.name}
            </span>
          ))}
          {c.courses?.length > 4 && <span className="text-[10px] font-black text-slate-400 ml-1">+{c.courses.length - 4} more</span>}
        </div>
      )
    },
    {
      label: 'Exams Accepted',
      icon: <Award className="w-4 h-4" />,
      render: (c: any) => (
        <div className="flex flex-wrap gap-1">
          {c.examAccepted?.map((e: string) => (
            <span key={e} className="px-2 py-1 bg-slate-900 text-white rounded-md text-[10px] font-black uppercase tracking-tighter">
              {e}
            </span>
          ))}
        </div>
      )
    },
    {
      label: 'Campus Size',
      icon: <Maximize2 className="w-4 h-4" />,
      render: (c: any) => <span className="text-sm font-bold text-slate-700">{c.campusSize || '—'}</span>
    },
    {
      label: 'Establishment',
      icon: <Calendar className="w-4 h-4" />,
      render: (c: any) => <span className="text-sm font-bold text-slate-700">{c.established}</span>
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Premium Header */}
      <div className="relative bg-slate-900 pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
              <Link href="/colleges" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md font-bold text-xs uppercase tracking-widest">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Discovery
              </Link>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                Comparison <span className="text-primary tracking-normal font-light">Matrix</span>
              </h1>
              <p className="text-slate-400 max-w-lg font-medium text-lg">
                Technical assessment of academic outcomes, financial investment, and industry standing.
              </p>
            </div>
            <button
              onClick={clearColleges}
              className="px-8 py-3 bg-white/10 hover:bg-red-500/20 hover:text-red-400 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] backdrop-blur-xl transition-all hover:border-red-500/30"
            >
              Reset Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden ring-1 ring-slate-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-10 text-left bg-slate-50/50 w-[280px] align-top">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Key Metrics</div>
                      <div className="text-2xl font-black text-slate-900">Variables</div>
                    </div>
                  </th>
                  {data.map((c) => (
                    <th key={c.id} className="p-10 text-left align-top min-w-[320px] relative transition-colors group hover:bg-slate-50/30">
                      <button
                        onClick={() => removeCollege(c.id)}
                        className="absolute top-6 right-6 p-2.5 bg-slate-100 hover:bg-red-600 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-lg text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2 leading-[1.1] tracking-tight">{c.name}</h3>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                            <MapPin className="w-3.5 h-3.5" />
                            {c.city}, {c.state}
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row, idx) => (
                  <tr key={row.label} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="p-10 bg-slate-50/30 border-r border-slate-50 align-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          {row.icon}
                        </div>
                        <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{row.label}</span>
                      </div>
                    </td>
                    {data.map((c) => (
                      <td key={c.id} className="p-10 transition-all group-hover:scale-[1.01] origin-left">
                        {row.render(c || {})}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-12 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
              <div>
                <p className="text-white font-black uppercase text-xs tracking-widest">Active Comparison</p>
                <p className="text-slate-400 text-sm font-medium">Data synced with official placement archives 2024</p>
              </div>
            </div>

            <div className="flex gap-4">
              {colleges.length < 3 && (
                <Link href="/colleges" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                  Add to Comparison
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Insight Badge */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-lg shadow-slate-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Proprietary AI Signal Scoring Enabled</span>
          </div>
        </div>
      </div>
    </div>
  )
}
