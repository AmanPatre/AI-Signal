import Link from 'next/link'
import { Sparkles, GraduationCap, BarChart3, Bookmark, Search, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Powered by Advanced AI
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900">
              Find Your <span className="text-primary">Perfect</span> University.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              The smartest way for students in India to discover colleges, compare courses, and predict their admission chances with data-driven precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/colleges" className="bg-primary text-white px-10 py-5 rounded-3xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Explore Discovery <Search className="w-5 h-5" />
              </Link>
              <Link href="/predictor" className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-3xl font-black text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                AI Predictor <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-24 px-4">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="group space-y-6 p-8 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Intelligent Prediction</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Input your rank and category to see which top-tier institutions are within your theoretical reach this year.
            </p>
          </div>
          <div className="group space-y-6 p-8 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Deep Comparison</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Go beyond the brochure. Compare fees, actual placement statistics, and authentic student reviews side-by-side.
            </p>
          </div>
          <div className="group space-y-6 p-8 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Personal Shortlist</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              Save the colleges that excite you. Build your strategy and track your application journey in one dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-32 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(65,105,225,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-2">
              <div className="text-7xl font-black text-white tracking-tighter">40+</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Top Institutions</div>
            </div>
            <div className="space-y-2">
              <div className="text-7xl font-black text-primary tracking-tighter">15+</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">States Covered</div>
            </div>
            <div className="space-y-2">
              <div className="text-7xl font-black text-white tracking-tighter">98%</div>
              <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">AI Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-32 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Ready to start your journey?</h2>
        <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto font-medium">
          Whether it's Engineering, Medical, or Management — your next big step starts with the right information.
        </p>
        <Link href="/colleges" className="inline-flex bg-primary text-white px-12 py-6 rounded-full font-black text-xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
          Get Started Now
        </Link>
      </section>

      <footer className="border-t border-slate-100 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-primary rounded-xl" />
            AI SIGNAL
          </div>
          <p className="text-slate-400 font-bold text-sm">
            &copy; 2024 AI Signal. Built with precision for students across India.
          </p>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
