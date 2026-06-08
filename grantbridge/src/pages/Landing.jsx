import React from 'react'
import { Search, FileText, BarChart2, BookOpen, ArrowRight, CheckCircle } from 'lucide-react'

export default function Landing({ setPage }) {
  const stats = [
    { number:'1.8M+', label:'Nonprofits in the US alone' },
    { number:'$100B+', label:'In grants awarded annually in the US' },
    { number:'72%', label:'Of small nonprofits never apply for grants' },
  ]

  const features = [
    { icon:Search, color:'bg-indigo-100 text-indigo-700', title:'Find Grants', desc:'Search thousands of federal, state, foundation, and corporate grants filtered by your cause, size, and location. Updated regularly.', page:'find' },
    { icon:FileText, color:'bg-purple-100 text-purple-700', title:'Apply Wizard', desc:'Our step-by-step application wizard walks you through every section. Cuts grant writing time by 60% with guided templates and AI-powered suggestions.', page:'apply' },
    { icon:BarChart2, color:'bg-green-100 text-green-700', title:'Application Tracker', desc:'Track every grant you\'ve applied for in one place. See deadlines, statuses, awarded amounts, and follow-up tasks — never miss a deadline again.', page:'tracker' },
    { icon:BookOpen, color:'bg-orange-100 text-orange-700', title:'Grant Resources', desc:'Free grant writing guides, templates, sample narratives, budget templates, and training videos for nonprofits of every size.', page:'resources' },
  ]

  const promises = [
    'No subscription fees — ever',
    'No grant writing experience required',
    'Works for nonprofits of every size',
    'Federal, state, foundation & corporate grants',
    'Step-by-step application wizard',
    'Deadline reminders and tracking',
  ]

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-600 to-violet-600 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🏛️</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Every nonprofit deserves<br />
            <span className="text-indigo-200">access to funding.</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            GrantBridge makes it easy for any nonprofit — regardless of size or experience — to find grants, simplify the application process, and secure the funding they need to change the world.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setPage('find')} className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all flex items-center gap-2">
              <Search size={18} /> Find Grants Now
            </button>
            <button onClick={() => setPage('apply')} className="bg-indigo-900 text-white font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all flex items-center gap-2">
              <FileText size={18} /> Start an Application
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-indigo-600">{s.number}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Everything you need to get funded</h2>
        <p className="text-center text-gray-500 mb-10">From discovery to award — GrantBridge covers the full journey.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}><f.icon size={24} /></div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
              <button onClick={() => setPage(f.page)} className="flex items-center gap-1 text-indigo-700 font-semibold text-sm hover:gap-2 transition-all">
                Get Started <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Promises */}
      <div className="bg-indigo-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Built for nonprofits. Not for profit.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promises.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle size={20} className="text-indigo-600 shrink-0" />
                <p className="text-gray-700 font-medium text-sm">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
