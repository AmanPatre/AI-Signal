'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, ArrowLeft, Loader2, AlertCircle, CheckCircle, TrendingUp, Sparkles, ChevronRight, Target, IndianRupee, MapPin, ArrowRight } from 'lucide-react'
import { getChanceColor } from '@/lib/utils'

const OPTIONS = {
  exams: ['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE'],
  categories: ['General', 'OBC', 'SC', 'ST'],
  fields: ['Engineering', 'Medical', 'Management', 'Science'],
  states: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana', 'Kerala', 'Punjab', 'Rajasthan', 'Odisha', 'Assam', 'Uttarakhand', 'Haryana']
}

export default function PredictorPage() {
  const [formData, setFormData] = useState({
    exam: 'JEE Main' as const,
    rank: '',
    percentile: '',
    category: 'General' as const,
    preferredState: '',
    maxFees: '',
    preferredField: 'Engineering' as const,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<any>(null)
  const [fallback, setFallback] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.rank && !formData.percentile) return setError('Please enter rank or percentile')

    setLoading(true)
    setError('')
    setResults(null)
    setFallback([])

    try {
      const res = await fetch('/api/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rank: formData.rank ? parseInt(formData.rank) : undefined,
          percentile: formData.percentile ? parseFloat(formData.percentile) : undefined,
          maxFees: formData.maxFees ? parseInt(formData.maxFees) : undefined,
        }),
      })

      const { data, error } = await res.json()
      if (error) throw new Error(error)

      if (data.fallbackReason) {
        setFallback(data.fallbackColleges || [])
        setError(data.fallbackReason)
      } else {
        setResults(data.predictions)
      }
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please recalibrate inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-primary selection:text-white">
      <div className="bg-slate-900 pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-12 font-bold group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Control Center
          </Link>
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20 backdrop-blur-xl">
              <Brain className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight italic uppercase">
              AI Prediction <span className="text-primary not-italic">Engine</span>
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Proprietary algorithms analyzing multi-year historical datasets to calculate your precise institutional compatibility.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 pb-32">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <Target className="w-24 h-24 text-slate-50 opacity-[0.05]" />
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12 relative">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Assessment</label>
                <select
                  value={formData.exam}
                  onChange={(e) => setFormData({ ...formData, exam: e.target.value as any })}
                  className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                >
                  {OPTIONS.exams.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rank</label>
                  <input
                    type="number"
                    placeholder="Global Rank"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value, percentile: '' })}
                    className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Percentile</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.9"
                    value={formData.percentile}
                    onChange={(e) => setFormData({ ...formData, percentile: e.target.value, rank: '' })}
                    className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category Bracket</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                >
                  {OPTIONS.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Geographic Priority</label>
                <select
                  value={formData.preferredState}
                  onChange={(e) => setFormData({ ...formData, preferredState: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">National Search</option>
                  {OPTIONS.states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fiscal Threshold (Annual)</label>
                <input
                  type="number"
                  placeholder="Max Fees (Optional)"
                  value={formData.maxFees}
                  onChange={(e) => setFormData({ ...formData, maxFees: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Discipline</label>
                <select
                  value={formData.preferredField}
                  onChange={(e) => setFormData({ ...formData, preferredField: e.target.value as any })}
                  className="w-full px-6 py-5 bg-slate-50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/10 font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer"
                >
                  {OPTIONS.fields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-black hover:shadow-2xl hover:shadow-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group overflow-hidden relative"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="animate-pulse">Crunching Datasets...</span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      Initialize AI Analysis
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mt-12 bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] flex items-start gap-6 animate-in slide-in-from-top-4 duration-500 shadow-xl shadow-rose-100/20">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-rose-900 mb-1 tracking-tight">System Notification</h4>
              <p className="text-rose-700 font-medium leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {fallback.length > 0 && (
          <div className="mt-16 grid md:grid-cols-2 gap-8 animate-in fade-in duration-1000">
            {fallback.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all">
                <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{c.name}</h4>
                <p className="text-slate-400 font-bold text-sm mb-8 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {c.city}, {c.state}
                </p>
                <Link href={`/colleges/${c.slug}`} className="text-primary font-black flex items-center gap-2 group">
                  Institutional Profile <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {results?.length > 0 && (
          <div className="mt-20 space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center justify-between pb-8 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Strategic Matches</h2>
              </div>
              <div className="hidden md:flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse delay-150" />
              </div>
            </div>

            <div className="grid gap-8">
              {results.map((p: any, i: number) => (
                <div key={i} className="group bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${p.admissionChance === 'Safe' ? 'bg-green-500' : p.admissionChance === 'Moderate' ? 'bg-yellow-500' : 'bg-rose-500'}`} />

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{p.collegeName}</h3>
                      {p.college && (
                        <p className="text-slate-400 font-bold text-lg flex items-center gap-2">
                          <MapPin className="w-5 h-5 opacity-50" /> {p.college.city}, {p.college.state}
                        </p>
                      )}
                    </div>
                    <div className={`self-start px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2 shadow-lg ${getChanceColor(p.admissionChance)}`}>
                      {p.admissionChance} Probability
                    </div>
                  </div>

                  <p className="text-slate-600 font-medium text-lg leading-relaxed mb-12 max-w-3xl border-l-4 border-slate-50 pl-8 italic">
                    "{p.reason}"
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-4">Strategic Insight</span>
                      <p className="text-slate-900 font-bold leading-relaxed">{p.keyStrengths}</p>
                    </div>
                    {p.college && (
                      <Link href={`/colleges/${p.college.slug}`} className="bg-slate-900 text-white flex items-center justify-center gap-3 py-8 rounded-[2rem] font-black hover:bg-black transition-all shadow-xl shadow-slate-200 group">
                        Institutional Intelligence Report <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-10 bg-slate-100/50 rounded-[3rem] text-slate-500 text-sm font-medium border border-slate-200/50 backdrop-blur-sm max-w-3xl mx-auto text-center leading-relaxed">
              <span className="block font-black text-slate-900 uppercase tracking-widest text-[10px] mb-4">Compliance Disclaimer</span>
              Algorithms output predictive modeling based on historical trend analysis. Final institutional determinations are governed by statutory admission authorities and official cutoff notifications.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
