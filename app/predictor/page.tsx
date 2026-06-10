'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, ArrowLeft, Loader2, AlertCircle, CheckCircle, TrendingUp, MapPin, ChevronRight } from 'lucide-react'
import { getChanceColor } from '@/lib/utils'

const OPTIONS = {
  exams: ['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE'],
  categories: ['General', 'OBC', 'SC', 'ST'],
  fields: ['Engineering', 'Medical', 'Management', 'Science'],
  states: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana', 'Kerala', 'Punjab', 'Rajasthan', 'Odisha', 'Assam', 'Uttarakhand', 'Haryana']
}

const CHANCE_BADGE: Record<string, string> = {
  Safe: 'bg-green-100 text-green-700 border-green-200',
  Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Ambitious: 'bg-red-100 text-red-700 border-red-200',
}

const CHANCE_BAR: Record<string, string> = {
  Safe: 'bg-green-500',
  Moderate: 'bg-yellow-500',
  Ambitious: 'bg-red-400',
}

export default function PredictorPage() {
  const [formData, setFormData] = useState({
    exam: 'JEE Main',
    rank: '',
    percentile: '',
    category: 'General',
    preferredState: '',
    maxFees: '',
    preferredField: 'Engineering',
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
      setError(err.message || 'Analysis failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI College Predictor</h1>
              <p className="text-gray-500 text-sm">Get personalised college recommendations based on your rank and preferences.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-5 text-sm uppercase tracking-wide">Your Academic Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Entrance Exam</label>
                <select value={formData.exam} onChange={e => setFormData({ ...formData, exam: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  {OPTIONS.exams.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rank</label>
                <input type="number" placeholder="Your rank" value={formData.rank}
                  onChange={e => setFormData({ ...formData, rank: e.target.value, percentile: '' })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Percentile</label>
                <input type="number" step="0.01" placeholder="e.g. 98.5" value={formData.percentile}
                  onChange={e => setFormData({ ...formData, percentile: e.target.value, rank: '' })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  {OPTIONS.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Field</label>
                <select value={formData.preferredField} onChange={e => setFormData({ ...formData, preferredField: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  {OPTIONS.fields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred State</label>
                <select value={formData.preferredState} onChange={e => setFormData({ ...formData, preferredState: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  <option value="">Any State</option>
                  {OPTIONS.states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Annual Fees (₹)</label>
                <input type="number" placeholder="Optional budget limit" value={formData.maxFees}
                  onChange={e => setFormData({ ...formData, maxFees: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
            </div>

            <div className="mt-6">
              <button type="submit" disabled={loading}
                className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</> : 'Get Predictions'}
              </button>
            </div>
          </form>
        </div>


        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">{error}</p>
          </div>
        )}


        {fallback.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Matching Colleges from Database</h3>
            <div className="space-y-3">
              {fallback.map(c => (
                <div key={c.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{c.city}, {c.state}</p>
                  </div>
                  <Link href={`/colleges/${c.slug}`} className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    View <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}


        {results?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-gray-900">Your Personalised Predictions</h2>
              <span className="text-gray-400 text-sm">· {results.length} colleges matched</span>
            </div>

            <div className="space-y-4">
              {results.map((p: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{p.collegeName}</h3>
                      {p.college && (
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" /> {p.college.city}, {p.college.state}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${CHANCE_BADGE[p.admissionChance] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {p.admissionChance}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-3 border-l-2 border-gray-200 pl-3">{p.reason}</p>

                  {p.keyStrengths && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Key Strengths</p>
                      <p className="text-gray-700 text-sm">{p.keyStrengths}</p>
                    </div>
                  )}

                  {p.college && (
                    <Link href={`/colleges/${p.college.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all">
                      View Full Profile <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <p className="text-gray-400 text-xs text-center mt-6">
              Predictions are based on historical data and AI analysis. Final admissions are subject to official cutoffs.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
