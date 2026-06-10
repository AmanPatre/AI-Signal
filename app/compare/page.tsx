'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useCompareStore } from '@/store/compareStore'
import { ArrowLeft, MapPin, IndianRupee, Star, X, Building2 } from 'lucide-react'
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="p-6 bg-white rounded-full shadow-md border border-gray-100 mb-6">
        <Building2 className="w-12 h-12 text-primary/40" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Comparison is empty</h2>
      <p className="text-gray-500 mb-8 max-w-sm text-center text-sm">
        Select at least 2 colleges from the discovery page to start comparing their details.
      </p>
      <Link href="/colleges" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
        Go to Discovery
      </Link>
    </div>
  )

  const rows = [
    {
      label: 'Rating', render: (c: any) => (
        <div className="flex items-center gap-1.5 font-bold">
          <Star className="w-4 h-4 text-green-600 fill-green-600" />
          <span className="text-green-700">{c.overallRating}/5</span>
        </div>
      )
    },
    {
      label: 'Annual Fees', render: (c: any) => (
        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
          <IndianRupee className="w-4 h-4 text-gray-400" />
          {formatCurrency(c.feesMin)} - {formatCurrency(c.feesMax)}
        </div>
      )
    },
    { label: 'Average Package', render: (c: any) => <span className="font-medium text-gray-800">{c.placementAvg ? formatCurrency(c.placementAvg) : '—'}</span> },
    { label: 'Highest Package', render: (c: any) => <span className="font-semibold text-primary">{c.placementHighest ? formatCurrency(c.placementHighest) : '—'}</span> },
    {
      label: 'Top Recruiters', render: (c: any) => (
        <div className="flex flex-wrap gap-1.5">
          {c.topRecruiters?.slice(0, 3).map((r: string) => <span key={r} className="px-2 py-1 bg-gray-100 rounded-md text-[11px] font-medium text-gray-600">{r}</span>)}
        </div>
      )
    },
    {
      label: 'Entrance Exams', render: (c: any) => (
        <div className="flex flex-wrap gap-1.5">
          {c.examAccepted?.map((e: string) => <span key={e} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-[11px] font-semibold">{e}</span>)}
        </div>
      )
    },
    {
      label: 'Accreditations', render: (c: any) => (
        <div className="flex flex-wrap gap-1.5">
          {c.accreditations?.map((a: string) => <span key={a} className="px-2 py-1 border border-gray-200 rounded-md text-[11px] font-medium text-gray-500 uppercase">{a}</span>)}
        </div>
      )
    },
    { label: 'Campus Size', render: (c: any) => <span className="text-sm font-medium text-gray-600">{c.campusSize || '—'}</span> },
    { label: 'Established', render: (c: any) => <span className="text-sm font-medium text-gray-600">{c.established}</span> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/colleges" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm mb-3 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Discovery
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Side-by-Side Comparison</h1>
            <p className="text-gray-500 text-sm">Compare technical parameters and outcomes across institutions.</p>
          </div>
          <button onClick={clearColleges} className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100 mr-2 md:mr-0">
            Clear All
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-6 text-left bg-gray-50 w-56 border-b border-r border-gray-200 align-top">
                    <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Comparison Matrix</span>
                  </th>
                  {data.map((c) => (
                    <th key={c.id} className="p-6 text-left border-b border-gray-200 min-w-[300px] relative bg-white align-top">
                      <button onClick={() => removeCollege(c.id)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-all">
                        <X className="w-4 h-4" />
                      </button>
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5 pr-8 leading-tight">{c.name}</h3>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {c.city}, {c.state}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm font-semibold text-gray-600">{row.label}</span>
                    </td>
                    {data.map((c) => (
                      <td key={c.id} className="p-6 align-top">
                        {row.render(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-medium">Powered by AI Signal Database</p>
            {colleges.length < 3 && (
              <Link href="/colleges" className="text-sm font-medium text-primary hover:text-blue-700">
                + Add another college
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
