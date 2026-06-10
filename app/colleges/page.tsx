'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, MapPin, IndianRupee, Star, GraduationCap, X, ChevronRight, LayoutGrid, ArrowRight, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCompareStore } from '@/store/compareStore'

const STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana', 'Kerala', 'Punjab', 'Rajasthan', 'Odisha', 'Assam', 'Uttarakhand', 'Haryana']
const EXAMS = ['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE']
const FIELDS = ['Engineering', 'Medical', 'Management', 'Science']

function CollegesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addCollege, colleges: selectedColleges } = useCompareStore()

  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

  const fetchItems = useCallback(async (params = filters) => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ ...params, page: params.page.toString(), limit: '12' })
      Object.keys(params).forEach(k => !(params as any)[k] && q.delete(k))

      const res = await fetch(`/api/colleges?${q.toString()}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      setColleges(json.data || [])
      setTotal(json.meta?.total || 0)

      const urlQ = new URLSearchParams(q)
      urlQ.delete('limit')
      router.push(`/colleges?${urlQ.toString()}`, { scroll: false })
    } catch (err: any) {
      setError(err.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }, [router, filters])

  useEffect(() => {
    fetchItems()
  }, [])

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault()
    fetchItems({ ...filters, page: 1 })
  }

  const clearFilters = () => {
    const defaultFilters = { search: '', state: '', feesMin: '', feesMax: '', examType: '', courseType: '', page: 1 }
    setFilters(defaultFilters)
    fetchItems(defaultFilters)
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="bg-slate-900 border-b border-white/5 pt-12 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tight">University Discovery</h1>
            <p className="text-slate-400 font-medium text-lg">Compare and discover {total} accredited institutions across India.</p>
          </div>
          {selectedColleges.length > 0 && (
            <Link href="/compare" className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/20 transition-all">
              Compare Selected ({selectedColleges.length}) <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <form onSubmit={handleApply} className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-900" />
                  <h2 className="text-xl font-black text-slate-900">Filters</h2>
                </div>
                <button type="button" onClick={clearFilters} className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-widest">Reset</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Search</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      placeholder="University name..."
                      value={filters.search}
                      onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Regional Filter</label>
                  <select
                    value={filters.state}
                    onChange={e => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none font-medium text-slate-900 cursor-pointer appearance-none"
                  >
                    <option value="">All Regions</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Financial Bounds (₹)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.feesMin}
                      onChange={e => setFilters(prev => ({ ...prev, feesMin: e.target.value }))}
                      className="w-full px-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none font-medium text-slate-900"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.feesMax}
                      onChange={e => setFilters(prev => ({ ...prev, feesMax: e.target.value }))}
                      className="w-full px-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Academic field</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FIELDS.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilters(prev => ({ ...prev, courseType: prev.courseType === f ? '' : f }))}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${filters.courseType === f ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-slate-200">
                  Refine Search <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse border border-slate-100" />)}
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-2xl shadow-slate-200">
                <LayoutGrid className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No institutions found</h3>
                <p className="text-slate-400 font-medium">Try broadening your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {colleges.map((college) => (
                    <div key={college.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {college.overallRating}
                        </div>
                        <button
                          onClick={() => { addCollege(college) }}
                          disabled={selectedColleges.some(c => c.id === college.id)}
                          className={`p-3 rounded-full border transition-all ${selectedColleges.some(c => c.id === college.id) ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400 hover:text-primary hover:border-primary'}`}
                        >
                          <Filter className="w-5 h-5" />
                        </button>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-3 min-h-[4rem] line-clamp-2 leading-tight">
                        {college.name}
                      </h3>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-500 font-bold text-sm tracking-tight">
                          <MapPin className="w-4 h-4 text-slate-300" />
                          {college.city}, {college.state}
                        </div>
                        <div className="flex items-center gap-3 text-primary font-black">
                          <IndianRupee className="w-4 h-4" />
                          {formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}
                        </div>
                      </div>

                      <Link href={`/colleges/${college.slug}`} className="w-full bg-slate-50 text-slate-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                        Full Profile <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>

                {total > 12 && (
                  <div className="flex justify-center flex-wrap gap-3">
                    {[...Array(Math.ceil(total / 12))].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const nextPg = i + 1
                          setFilters(prev => ({ ...prev, page: nextPg }))
                          fetchItems({ ...filters, page: nextPg })
                        }}
                        className={`w-14 h-14 rounded-2xl font-black text-sm transition-all ${filters.page === i + 1 ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300'}`}
                      >
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50/50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <CollegesContent />
    </Suspense>
  )
}
