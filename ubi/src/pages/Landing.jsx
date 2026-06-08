import React from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { useTranslation } from '../i18n/translations.js'
import { ArrowRight, DollarSign, Globe, Users, TrendingUp, Heart, FileText, Zap } from 'lucide-react'

const FACTS = [
  { icon: Users, stat: '700M+', label: 'People living in extreme poverty worldwide' },
  { icon: DollarSign, stat: '$1,000/mo', label: 'Andrew Yang\'s Freedom Dividend proposal' },
  { icon: TrendingUp, stat: '40+', label: 'Countries experimenting with UBI pilots' },
  { icon: Globe, stat: '8B+', label: 'Human beings who deserve a foundation' },
]

const WHY = [
  { emoji: '🤖', title: 'Automation is replacing jobs', desc: 'By 2030, up to 800 million jobs could be displaced by automation. UBI provides a foundation as the economy changes.' },
  { emoji: '🏥', title: 'Healthcare & mental health', desc: 'UBI reduces chronic stress. Studies show recipients spend more on food, healthcare, and education — and less on alcohol and tobacco.' },
  { emoji: '🎓', title: 'Education & opportunity', desc: 'When basic needs are met, people invest in their futures. UBI enables more people to go back to school, start businesses, and create art.' },
  { emoji: '👶', title: 'Child poverty eliminated', desc: 'Child poverty has an $800B/year cost to the US alone. UBI would effectively eliminate child poverty overnight.' },
  { emoji: '🌾', title: 'Supports caregivers & farmers', desc: 'Unpaid caregiving work is worth trillions globally. UBI recognizes and supports this invisible economy.' },
  { emoji: '🗽', title: 'Real freedom', desc: 'Freedom from abusive employers. Freedom to leave bad relationships. Freedom to take risks. UBI is the foundation of real liberty.' },
]

export default function Landing({ setPage }) {
  const { lang } = useLang()
  const t = useTranslation(lang)

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 50%, #7c3aed 0%, transparent 60%), radial-gradient(circle at 70% 20%, #2563eb 0%, transparent 50%)'}} />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-7xl mb-6">💡</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              {t.hero}
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setPage('calculator')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-purple-900 transition-all flex items-center gap-2">
              <DollarSign size={18} /> {t.nav.calculator}
            </button>
            <button onClick={() => setPage('policy')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2">
              <ArrowRight size={18} /> {t.nav.policy}
            </button>
          </div>
        </div>
      </div>

      {/* Andrew Yang Quote */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-semibold text-white italic leading-relaxed">
            {t.yangQuote}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 py-12 px-4 border-b border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {FACTS.map((f, i) => (
            <div key={i} className="text-center">
              <f.icon size={28} className="text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-white">{f.stat}</div>
              <div className="text-gray-400 text-sm mt-1">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What is UBI */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-black text-white mb-4">{t.whatIsUBI}</h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">{t.ubiDef}</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[['✅','No means testing','Everyone qualifies — automatically'],['✅','No bureaucracy','Direct cash, no strings attached'],['✅','Every month','Consistent, reliable, permanent']].map(([e,h,d],i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <div className="text-2xl mb-2">{e}</div>
              <div className="font-bold text-white mb-1">{h}</div>
              <div className="text-gray-400 text-xs">{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why UBI */}
      <div className="bg-gray-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-white mb-2">Why the world needs UBI now</h2>
          <p className="text-gray-400 text-center mb-10">Six urgent reasons the time is today — not someday.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-purple-600 transition-all">
                <div className="text-3xl mb-3">{w.emoji}</div>
                <h3 className="font-bold text-white mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yang section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-3xl p-8 border border-purple-700">
          <div className="text-5xl mb-4">🇺🇸</div>
          <h2 className="text-2xl font-black text-white mb-3">Andrew Yang & the Freedom Dividend</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Andrew Yang ran for President of the United States in 2020 on a platform centered on Universal Basic Income — the Freedom Dividend — $1,000/month for every American adult. He brought UBI from a fringe academic concept to the center of American political conversation.
          </p>
          <p className="text-gray-300 leading-relaxed">
            This platform exists to carry that conversation forward — and expand it to every human being on Earth. UBI is not left or right. It is human.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => setPage('policy')} className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all flex items-center gap-2">
              <FileText size={15} /> Read the Policy
            </button>
            <button onClick={() => setPage('advocate')} className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all flex items-center gap-2">
              <Zap size={15} /> Take Action
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-14 px-4 text-center">
        <h2 className="text-3xl font-black text-white mb-3">The time is now.</h2>
        <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto">Calculate your UBI impact. Read the research. Take action. Every human deserves a foundation.</p>
        <button onClick={() => setPage('calculator')} className="bg-white text-purple-900 font-black px-10 py-3 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto">
          <DollarSign size={20} /> Try the Calculator
        </button>
      </div>
    </div>
  )
}

