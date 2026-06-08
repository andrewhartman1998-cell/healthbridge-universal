import React, { useState } from 'react'

const PILLARS = [
  { emoji: '💵', title: 'Universal', sub: 'Everyone, no exceptions', desc: 'UBI goes to every adult citizen — rich, poor, employed, unemployed, able-bodied, disabled. No one is excluded. No means-testing. No shame. Just a check, every month, automatically.' },
  { emoji: '🔓', title: 'Unconditional', sub: 'No strings attached', desc: 'Recipients can spend it on whatever they choose. Research from every UBI pilot shows people make smart decisions — more food, healthcare, education. Trust people with their own money.' },
  { emoji: '📅', title: 'Regular', sub: 'Monthly, like a paycheck', desc: 'Paid on a predictable schedule — monthly or bi-weekly — so people can plan, budget, and build toward a future. Consistency is what makes UBI transformative, not just helpful.' },
  { emoji: '💰', title: 'Cash', sub: 'Real money, not vouchers', desc: 'Cash is the most efficient and respectful form of assistance. Studies show cash transfers outperform in-kind aid in nearly every metric. People know their own needs.' },
]

const FUNDING = [
  { method: 'Value-Added Tax (VAT)', desc: 'A small tax on goods and services at each stage of production. Andrew Yang\'s proposal: a 10% VAT generating ~$800B/year. Common in Europe. Broadens the tax base to include the digital economy.', pros: ['Captures value from Amazon, Google, Facebook', 'Broad base, relatively low rate', 'Already used in 160+ countries'], cons: ['Mildly regressive without UBI offset', 'Consumer prices may rise slightly'] },
  { method: 'Wealth Tax', desc: 'Annual tax on net worth above a threshold (e.g., 1–2% on wealth above $50M). Elizabeth Warren and Bernie Sanders proposals. Would generate $200–400B/year.', pros: ['Directly reduces inequality', 'Large revenue potential', 'Targets accumulated wealth, not work'], cons: ['Capital flight risk', 'Valuation complexity', 'May require constitutional amendment'] },
  { method: 'Financial Transaction Tax', desc: 'Small tax (0.1–0.5%) on stock, bond, and derivatives trades. Would generate $50–150B/year while reducing speculative trading.', pros: ['Reduces harmful speculation', 'Progressive — mostly paid by wealthy', 'Global precedent (UK, France, Sweden)'], cons: ['Could reduce market liquidity', 'May move trading offshore'] },
  { method: 'Carbon Tax', desc: 'Tax on CO2 emissions, returned directly to citizens as a dividend. British Columbia\'s model. Canada\'s Carbon Rebate. Fights climate change while funding UBI.', pros: ['Addresses climate crisis simultaneously', 'Revenue recycled to citizens', 'Economic efficiency'], cons: ['Political resistance from fossil fuel industry', 'Regressive without dividend'] },
]

const PILOTS = [
  { name: 'Finland Basic Income Experiment', years: '2017–2019', country: '🇫🇮', amount: '€560/month', participants: '2,000 unemployed adults', result: 'Recipients reported higher wellbeing, more trust in institutions, better mental health, and were more likely to work and volunteer.' },
  { name: 'Stockton SEED', years: '2019–2021', country: '🇺🇸', amount: '$500/month', participants: '125 residents', result: 'Full-time employment doubled (28% → 40%). Recipients spent on food, utilities, and auto repairs. Mental health improved significantly.' },
  { name: 'GiveDirectly Kenya', years: '2016–2030', country: '🇰🇪', amount: '$22/month (12-year program)', participants: '21,000 people', result: 'Early results: increased assets, earnings, food security, and psychological wellbeing. No significant increase in alcohol or tobacco spending.' },
  { name: 'Manitoba Mincome', years: '1974–1979', country: '🇨🇦', amount: 'Varies (income-tested)', participants: '10,000+ residents', result: 'Hospitalization rates fell 8.5%. High school completion rates rose. Mothers stayed home longer with newborns. Work hours fell only modestly.' },
  { name: 'Maricá, Brazil', years: '2013–present', country: '🇧🇷', amount: '130 Mumbuca/month (~$26)', participants: '42,000+ residents', result: 'Local economy strengthened. Poverty reduced. The city created its own digital currency (Mumbuca) for the UBI program.' },
  { name: 'Alaska Permanent Fund', years: '1982–present', country: '🇺🇸', amount: '$1,000–$2,072/year (varies)', participants: 'Every Alaska resident', result: 'Alaska has the lowest income inequality in the US. The dividend is universally popular — supported by both Republicans and Democrats.' },
]

export default function Policy() {
  const [tab, setTab] = useState('what')

  const tabs = [
    { id: 'what', label: '📋 The Four Pillars' },
    { id: 'funding', label: '💰 How to Fund It' },
    { id: 'pilots', label: '🧪 Real-World Pilots' },
    { id: 'yang', label: '🇺🇸 Yang\'s Plan' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">📋 UBI Policy Center</h1>
        <p className="text-gray-400">The research, proposals, and real-world evidence for Universal Basic Income.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.id ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'what' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILLARS.map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
              <div className="text-4xl mb-3">{p.emoji}</div>
              <h2 className="text-xl font-black text-white">{p.title}</h2>
              <p className="text-purple-400 text-sm font-semibold mb-2">{p.sub}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'funding' && (
        <div className="space-y-5">
          {FUNDING.map((f, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-lg font-black text-white mb-2">{f.method}</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{f.desc}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-green-400 text-xs font-bold mb-2">✅ PROS</div>
                  {f.pros.map((p, j) => <div key={j} className="text-gray-300 text-xs mb-1">• {p}</div>)}
                </div>
                <div>
                  <div className="text-red-400 text-xs font-bold mb-2">⚠️ CONS</div>
                  {f.cons.map((c, j) => <div key={j} className="text-gray-300 text-xs mb-1">• {c}</div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'pilots' && (
        <div className="space-y-4">
          {PILOTS.map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-black text-white">{p.country} {p.name}</h2>
                  <p className="text-gray-400 text-sm">{p.years} · {p.amount} · {p.participants}</p>
                </div>
              </div>
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-3">
                <p className="text-green-300 text-sm"><span className="font-bold">Results: </span>{p.result}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'yang' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-2xl border border-purple-600 p-6">
            <h2 className="text-2xl font-black text-white mb-4">🇺🇸 The Freedom Dividend — Andrew Yang's Proposal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[['Amount','$1,000/month ($12,000/year) per adult American'],['Who qualifies','Every US citizen 18 and older'],['Opt-in','Recipients choose UBI or existing benefits — not both'],['Funding','10% VAT + $500B in consolidated programs + new tax revenue from economic growth'],['Cost','~$2.8 trillion/year'],['Net new cost','~$1.3 trillion/year after consolidation and new revenue']].map(([k,v]) => (
                <div key={k} className="bg-gray-800/50 rounded-xl p-3">
                  <div className="text-purple-300 text-xs font-bold mb-0.5">{k}</div>
                  <div className="text-white text-sm">{v}</div>
                </div>
              ))}
            </div>
            <h3 className="font-bold text-white mb-2">Yang's key arguments:</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Automation will eliminate millions of jobs in trucking, retail, food service, and manufacturing within the next decade</li>
              <li>• The US economy is the most productive in history — citizens deserve to share in that productivity</li>
              <li>• UBI stimulates local economies — money spent at local businesses, not hoarded in offshore accounts</li>
              <li>• Current welfare is inefficient, demeaning, and full of gaps — UBI replaces bureaucracy with trust</li>
              <li>• Mental health crisis, addiction, and despair are rooted in economic anxiety — UBI addresses the root cause</li>
            </ul>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
            <h3 className="font-bold text-white mb-3">📚 Learn more</h3>
            <div className="grid gap-2 text-sm">
              {[['The War on Normal People (book)', 'Andrew Yang — the case for UBI in the age of automation'],['yang2020.com archives', 'The full Freedom Dividend policy proposal'],['Stanford Basic Income Lab', 'basicincome.stanford.edu — global UBI research'],['Basic Income Earth Network', 'bien.info — international UBI advocacy'],['GiveDirectly', 'givedirectly.org — UBI in action in Kenya']].map(([n,d]) => (
                <div key={n} className="bg-gray-800 rounded-xl p-3">
                  <div className="font-semibold text-purple-300">{n}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
