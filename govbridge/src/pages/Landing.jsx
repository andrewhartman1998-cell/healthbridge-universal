import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const benefits = [
  { icon: '♿', label: 'Disability', desc: 'SSI, SSDI, PIP, NDIS & global equivalents', color: 'from-blue-600 to-blue-800', path: '/disability' },
  { icon: '🏠', label: 'Housing', desc: 'Section 8, social housing, rental assistance', color: 'from-emerald-600 to-emerald-800', path: '/finder' },
  { icon: '🍽️', label: 'Food Support', desc: 'SNAP, food vouchers, nutrition programs', color: 'from-orange-600 to-orange-800', path: '/finder' },
  { icon: '🏥', label: 'Healthcare', desc: 'Medicaid, NHS, universal health subsidies', color: 'from-red-600 to-red-800', path: '/finder' },
  { icon: '💼', label: 'Unemployment', desc: 'Job loss benefits & retraining programs', color: 'from-violet-600 to-violet-800', path: '/finder' },
  { icon: '🎖️', label: 'Veterans', desc: 'VA benefits, pensions, service programs', color: 'from-slate-600 to-slate-800', path: '/finder' },
  { icon: '👶', label: 'Child & Family', desc: 'Child tax credits, parental leave, WIC', color: 'from-pink-600 to-pink-800', path: '/finder' },
  { icon: '🎓', label: 'Education', desc: 'Pell grants, student loan relief, scholarships', color: 'from-cyan-600 to-cyan-800', path: '/finder' },
  { icon: '👴', label: 'Senior Care', desc: 'Social Security, pension, elder assistance', color: 'from-amber-600 to-amber-800', path: '/finder' },
  { icon: '🆘', label: 'Emergency Relief', desc: 'Disaster aid, crisis support, refugee help', color: 'from-rose-600 to-rose-800', path: '/emergency' },
];

export default function Landing() {
  const { tr, lang, setLang, languages } = useLang();
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏛️</span>
          <div>
            <h1 className="font-black text-xl text-white leading-none">{tr.appName}</h1>
            <p className="text-xs text-slate-400">Citizen Benefits Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {[['finder', tr.nav.finder], ['eligibility', tr.nav.eligibility], ['disability', tr.nav.disability], ['emergency', tr.nav.emergency]].map(([path, label]) => (
            <button key={path} onClick={() => nav(`/${path}`)} className="text-sm text-slate-300 hover:text-white transition-colors hidden md:block">{label}</button>
          ))}
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700 text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
          🌍 Available in 50 Languages · Free Forever
        </div>
        <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6"
          style={{ background: 'linear-gradient(135deg, #60a5fa, #34d399, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {tr.hero}
        </h2>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">{tr.sub}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => nav('/finder')} className="bg-blue-600 hover:bg-blue-700 font-black text-lg px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl">
            🔍 {tr.cta}
          </button>
          <button onClick={() => nav('/eligibility')} className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold text-lg px-10 py-4 rounded-full transition-all">
            📋 Check Eligibility
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 border-t border-slate-800 pt-12">
          {[['195', 'Countries Covered'], ['2,400+', 'Benefit Programs'], ['50', 'Languages']].map(([val, label]) => (
            <div key={label}>
              <p className="text-4xl font-black text-blue-400">{val}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefit Categories */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h3 className="text-center text-slate-400 text-sm uppercase tracking-widest mb-8">What benefits are you looking for?</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {benefits.map(b => (
            <button key={b.label} onClick={() => nav(b.path)}
              className={`bg-gradient-to-br ${b.color} rounded-2xl p-4 text-left hover:scale-105 transition-all shadow-lg group`}>
              <div className="text-3xl mb-2">{b.icon}</div>
              <p className="font-black text-sm text-white">{b.label}</p>
              <p className="text-xs text-white/60 mt-1 leading-tight hidden group-hover:block">{b.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-slate-900/50 border-t border-slate-800 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-black text-white mb-12">How GovBridge Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              ['🌍', 'Select Your Country', 'Choose your country and region to see programs available to you.'],
              ['📋', 'Check Eligibility', 'Answer a few simple questions. We match you to programs instantly.'],
              ['📝', 'Apply With Guidance', 'Step-by-step application help with document checklists.'],
              ['✅', 'Track Your Status', 'Monitor your applications and deadlines in one place.'],
            ].map(([icon, title, desc]) => (
              <div key={title}>
                <div className="text-4xl mb-4">{icon}</div>
                <h4 className="font-black text-white mb-2">{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-800 py-8 px-6 text-center">
        <p className="text-slate-600 text-sm">GovBridge Global · Built by Andrew Hartman · Free for every citizen on Earth · 50 languages</p>
      </footer>
    </div>
  );
}
