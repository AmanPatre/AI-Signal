'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, IndianRupee, Star, ChevronRight, Loader2, RotateCcw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCompareStore } from '@/store/compareStore'

const STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana', 'Kerala', 'Punjab', 'Rajasthan', 'Odisha', 'Assam', 'Uttarakhand', 'Haryana']
const FIELDS = ['Engineering', 'Medical', 'Management', 'Science']

function CollegesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addCollege, colleges: selectedColleges } = useCompareStore()

  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    feesMin: searchParams.get('feesMin') || '',
    feesMax: searchParams.get('feesMax') || '',
    examType: searchParams.get('examType') || '',
    courseType: searchParams.get('courseType') || '',
    page: parseInt(searchParams.get('page') || '1')
  })

  const fetchColleges = useCallback(async (params = filters) => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ ...params, page: params.page.toString(), limit: '12' })
      Object.keys(params).forEach(k => !(params as any)[k] && q.delete(k))
      const res = await fetch(`/api/colleges?${q.toString()}`)
      const json = await res.json()
      setColleges(json.data || [])
      setTotal(json.meta?.total || 0)
      const urlQ = new URLSearchParams(q)
      urlQ.delete('limit')
      router.push(`/colleges?${urlQ.toString()}`, { scroll: false })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [router, filters])

  useEffect(() => { fetchColleges() }, [])

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault()
    fetchColleges({ ...filters, page: 1 })
  }

  const clearFilters = () => {
    const def = { search: '', state: '', feesMin: '', feesMax: '', examType: '', courseType: '', page: 1 }
    setFilters(def)
    fetchColleges(def)
  }

  const inCompare = (id: string) => selectedColleges.some(c => c.id === id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">College Discovery</h1>
            <p className="text-gray-500 text-sm">{total} institutions found across India</p>
          </div>
          {selectedColleges.length > 0 && (
            <Link href="/compare" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Compare ({selectedColleges.length}) →
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <form onSubmit={handleApply} className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-20">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </div>
                <button type="button" onClick={clearFilters} className="text-xs text-gray-400 hover:text-primary flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="College name..."
                      value={filters.search}
                      onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">State</label>
                  <select
                    value={filters.state}
                    onChange={e => setFilters(p => ({ ...p, state: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  >
                    <option value="">All States</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Annual Fees (₹)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min" value={filters.feesMin} onChange={e => setFilters(p => ({ ...p, feesMin: e.target.value }))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
                    <input type="number" placeholder="Max" value={filters.feesMax} onChange={e => setFilters(p => ({ ...p, feesMax: e.target.value }))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Field</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FIELDS.map(f => (
                      <button key={f} type="button" onClick={() => setFilters(p => ({ ...p, courseType: p.courseType === f ? '' : f }))}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all ${filters.courseType === f ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Apply Filters
                </button>
              </div>
            </form>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
                <p className="text-gray-400 font-medium">No colleges found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {colleges.map(college => (
                  <div key={college.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base leading-snug">{college.name}</h3>
                          <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {college.city}, {college.state}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-sm font-semibold flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-green-600 text-green-600" /> {college.overallRating}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-3">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {formatCurrency(college.feesMin)} – {formatCurrency(college.feesMax)} / year
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 sm:w-36 flex-shrink-0">
                      <Link href={`/colleges/${college.slug}`} className="flex-1 sm:flex-none text-center bg-primary text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                        View Details
                      </Link>
                      <button
                        onClick={() => addCollege(college)}
                        disabled={inCompare(college.id)}
                        className={`flex-1 sm:flex-none text-center py-2 px-3 rounded-lg text-sm font-semibold border transition-colors ${inCompare(college.id) ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default' : 'bg-white text-primary border-primary hover:bg-blue-50'}`}
                      >
                        {inCompare(college.id) ? 'Added' : '+ Compare'}
                      </button>
                    </div>
                  </div>
                ))}

                {total > 12 && (
                  <div className="flex justify-center gap-2 pt-4">
                    {[...Array(Math.ceil(total / 12))].map((_, i) => (
                      <button key={i} onClick={() => { const p = i + 1; setFilters(prev => ({ ...prev, page: p })); fetchColleges({ ...filters, page: p }) }}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${filters.page === i + 1 ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <CollegesContent />
    </Suspense>
  )
}
