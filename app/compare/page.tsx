'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useCompareStore } from '@/store/compareStore'
import { ArrowLeft, MapPin, IndianRupee, Star, Award, X, Building2 } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="p-6 bg-white rounded-full shadow-xl shadow-slate-200 mb-8">
        <Building2 className="w-12 h-12 text-slate-300" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4">Comparison is empty</h2>
      <p className="text-slate-500 mb-8 max-w-xs text-center font-medium">Select at least 2 colleges from the discovery page to start comparing.</p>
      <Link href="/colleges" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg transition-all">Go to Discovery</Link>
    </div>
  )

  const rows = [
    {
      label: 'Rating', render: (c: any) => (
        <div className="flex items-center gap-2 font-black">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className={getRatingColor(c.overallRating)}>{c.overallRating}/5</span>
        </div>
      )
    },
    {
      label: 'Annual Fees', render: (c: any) => (
        <div className="font-bold text-slate-900">
          {formatCurrency(c.feesMin)} - {formatCurrency(c.feesMax)}
        </div>
      )
    },
    { label: 'Average Package', render: (c: any) => <span className="font-bold text-slate-700">{c.placementAvg ? formatCurrency(c.placementAvg) : '—'}</span> },
    { label: 'Highest Package', render: (c: any) => <span className="font-black text-primary">{c.placementHighest ? formatCurrency(c.placementHighest) : '—'}</span> },
    {
      label: 'Top Recruiters', render: (c: any) => (
        <div className="flex flex-wrap gap-1">
          {c.topRecruiters?.slice(0, 3).map((r: string) => <span key={r} className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase">{r}</span>)}
        </div>
      )
    },
    {
      label: 'Entrance Exams', render: (c: any) => (
        <div className="flex flex-wrap gap-1">
          {c.examAccepted?.map((e: string) => <span key={e} className="px-2 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase tracking-wider">{e}</span>)}
        </div>
      )
    },
    {
      label: 'Accreditations', render: (c: any) => (
        <div className="flex flex-wrap gap-1">
          {c.accreditations?.map((a: string) => <span key={a} className="px-2 py-1 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase">{a}</span>)}
        </div>
      )
    },
    { label: 'Campus Size', render: (c: any) => <span className="text-sm font-medium text-slate-600">{c.campusSize || '—'}</span> },
    { label: 'Established', render: (c: any) => <span className="text-sm font-medium text-slate-600">{c.established}</span> },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <Link href="/colleges" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group font-bold text-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Discovery
            </Link>
            <h1 className="text-4xl font-black tracking-tight">Side-by-Side Comparison</h1>
            <p className="text-slate-400 font-medium">Deep dive into technical parameters and outcomes.</p>
          </div>
          <button onClick={clearColleges} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest backdrop-blur-sm transition-all">Reset All</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-8 text-left bg-slate-50/50 w-64 border-b border-slate-100">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Comparison Matrix</span>
                  </th>
                  {data.map((c) => (
                    <th key={c.id} className="p-8 text-left border-b border-slate-100 min-w-[300px] relative">
                      <button onClick={() => removeCollege(c.id)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                      </button>
                      <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{c.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <MapPin className="w-3 h-3" />
                        {c.city}, {c.state}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                  <tr key={row.label} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-8 bg-slate-50/30 border-r border-slate-50">
                      <span className="text-sm font-black text-slate-500 uppercase tracking-wider">{row.label}</span>
                    </td>
                    {data.map((c) => (
                      <td key={c.id} className="p-8">
                        {row.render(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-bold italic">Generated by AI Signal Comparison Engine</p>
            <div className="flex gap-4">
              {colleges.length < 3 && (
                <Link href="/colleges" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-black transition-colors">Add Third College</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
