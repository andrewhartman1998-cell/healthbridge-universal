import React from 'react'
import { Briefcase, Building2, HeartHandshake, Shield, Globe, ArrowRight, Phone } from 'lucide-react'

export default function Landing({ setPage }) {
  const stats = [
    { number: '582,000+', label: 'People experiencing homelessness in the US' },
    { number: '40M+', label: 'Americans living in poverty' },
    { number: '100%', label: 'Free — no cost ever' },
  ]

  const features = [
    {
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-700',
      title: 'Find Stable Work',
      desc: 'Jobs that welcome you — no fixed address required. Day labor, part-time, full-time, remote. Filtered for barrier-friendly employers.',
      page: 'jobs',
    },
    {
      icon: Building2,
      color: 'bg-purple-100 text-purple-700',
      title: 'Find Safe Housing',
      desc: 'Emergency shelters, transitional housing, subsidized apartments, and shared homes — filtered by what you actually need.',
      page: 'housing',
    },
    {
      icon: HeartHandshake,
      color: 'bg-orange-100 text-orange-700',
      title: 'Support Resources',
      desc: 'Food, clothing, medical care, mental health support, ID recovery, legal aid, job training — all in one place.',
      page: 'resources',
    },
  ]

  const promises = [
    { icon: Shield, text: 'No background check required to use this app' },
    { icon: Globe, text: 'Available in 50 languages' },
    { icon: Phone, text: 'Works on any device, even low-end phones' },
    { icon: HeartHandshake, text: 'Always free — no account required to browse' },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-teal-600 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🌉</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            A bridge to a better life.<br />
            <span className="text-green-200">For everyone.</span>
          </h1>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Free jobs, housing, and support resources for people experiencing homelessness
            and members of underserved communities. No judgment. No barriers.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setPage('jobs')}
              className="bg-white text-green-700 font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Briefcase size={18} /> Find Work
            </button>
            <button
              onClick={() => setPage('housing')}
              className="bg-green-800 text-white font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Building2 size={18} /> Find Housing
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-green-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-green-700">{s.number}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">What Bridge does for you</h2>
        <p className="text-center text-gray-500 mb-10">Three pillars. One mission: stability.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
              <button
                onClick={() => setPage(f.page)}
                className="flex items-center gap-1 text-green-700 font-semibold text-sm hover:gap-2 transition-all"
              >
                Explore <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Our promises */}
      <div className="bg-green-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Our promises to you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promises.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="bg-green-100 text-green-700 rounded-lg p-2">
                  <p.icon size={20} />
                </div>
                <p className="text-gray-700 font-medium">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency numbers */}
      <div className="bg-red-50 border-t-4 border-red-400 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-bold text-red-700 mb-4">🚨 Emergency Hotlines — Always Free</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="font-bold text-gray-800">National Homelessness Hotline</div>
              <div className="text-red-600 font-bold text-lg mt-1">1-800-HOMELESS</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="font-bold text-gray-800">Crisis Text Line</div>
              <div className="text-red-600 font-bold text-lg mt-1">Text HOME to 741741</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="font-bold text-gray-800">211 — Social Services</div>
              <div className="text-red-600 font-bold text-lg mt-1">Dial 2-1-1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
