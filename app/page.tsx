import Link from 'next/link'
import { GraduationCap, Sparkles, BarChart3, Bookmark, Search, ArrowRight, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">India's Smartest College Discovery Platform</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find the Right College for You
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Compare colleges, predict your admission chances with AI, and make data-backed decisions for your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/colleges" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Browse Colleges
            </Link>
            <Link href="/predictor" className="bg-blue-600 text-white border border-blue-400 font-semibold px-8 py-3 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
              AI Predictor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-5 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-slate-700 text-center">
          <div className="px-4">
            <div className="text-2xl font-bold text-white">40+</div>
            <div className="text-slate-400 text-xs mt-0.5">Top Colleges</div>
          </div>
          <div className="px-4">
            <div className="text-2xl font-bold text-white">15+</div>
            <div className="text-slate-400 text-xs mt-0.5">States Covered</div>
          </div>
          <div className="px-4">
            <div className="text-2xl font-bold text-white">5 Exams</div>
            <div className="text-slate-400 text-xs mt-0.5">JEE, NEET, CAT & more</div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Everything You Need</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">From discovery to decision — all in one place.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-primary mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Admission Predictor</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter your rank, category, and preferences. Our AI matches you to colleges where you have the best chances.
              </p>
              <Link href="/predictor" className="text-primary text-sm font-semibold mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all">
                Try Predictor <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compare Side by Side</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Compare fees, placements, ratings, and courses for up to 3 colleges at the same time.
              </p>
              <Link href="/compare" className="text-primary text-sm font-semibold mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all">
                Compare Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save Your Shortlist</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bookmark colleges you like and revisit your personal shortlist anytime from your account.
              </p>
              <Link href="/saved" className="text-primary text-sm font-semibold mt-4 inline-flex items-center gap-1 hover:gap-2 transition-all">
                View Saved <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Exam</h2>
          <p className="text-gray-500 text-sm mb-8">Find colleges that accept your entrance exam.</p>
          <div className="flex flex-wrap gap-3">
            {['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE'].map((exam) => (
              <Link
                key={exam}
                href={`/colleges?examType=${exam}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-primary hover:text-primary transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                {exam}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to find your perfect college?</h2>
          <p className="text-blue-100 mb-6 text-sm">Join thousands of students making smarter admission decisions.</p>
          <Link href="/auth/signup" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-primary text-lg">AI Signal</span>
          </Link>
          <p className="text-gray-400 text-sm">&copy; 2024 AI Signal. Built for students across India.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
