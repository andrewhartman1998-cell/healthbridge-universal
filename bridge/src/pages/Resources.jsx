import React, { useState } from 'react'
import { HeartHandshake, MapPin, Phone, Globe, Clock } from 'lucide-react'

const SAMPLE_RESOURCES = [
  { id: 1, name: 'Feeding America — Food Bank Locator', category: 'Food', provider: 'Feeding America', city: 'Nationwide', state: 'US', phone: '1-800-771-2303', website: 'https://www.feedingamerica.org/find-your-local-foodbank', hours: 'Varies by location', description: 'Find your nearest food bank. Over 200 food banks nationwide serving 46 million people. No income verification required at most locations.', walk_in_welcome: true },
  { id: 2, name: '211 — Social Services Hotline', category: 'Other', provider: 'United Way', city: 'Nationwide', state: 'US', phone: '211', website: 'https://www.211.org', hours: '24/7', description: 'Call or text 211 for immediate help with food, housing, employment, mental health, childcare, and more. Free, confidential, available in 150+ languages.', walk_in_welcome: false },
  { id: 3, name: 'Crisis Text Line', category: 'Mental Health', provider: 'Crisis Text Line', city: 'Nationwide', state: 'US', phone: 'Text HOME to 741741', website: 'https://www.crisistextline.org', hours: '24/7', description: 'Free, confidential crisis counseling via text. No call required. Responds in minutes. Available everywhere.', walk_in_welcome: false },
  { id: 4, name: 'National Immigration Legal Services', category: 'Legal Aid', provider: 'CLINIC Network', city: 'Nationwide', state: 'US', phone: '301-565-4800', website: 'https://cliniclegal.org/resources/find-accredited-programs', hours: 'M–F 9am–5pm', description: 'Free and low-cost immigration legal services across the US. Find a local accredited representative near you.', walk_in_welcome: false },
  { id: 5, name: 'ID Recovery Assistance', category: 'ID Recovery', provider: 'ID Project', city: 'Minneapolis', state: 'MN', phone: '612-341-4325', website: 'https://www.idproject.org', hours: 'M–F 9am–4pm', description: 'Helps individuals experiencing homelessness obtain birth certificates, state IDs, and Social Security cards. Serves as a model — search for similar programs in your city.', walk_in_welcome: true },
  { id: 6, name: 'Good360 — Clothing & Household Goods', category: 'Clothing', provider: 'Good360', city: 'Nationwide', state: 'US', phone: '703-836-2121', website: 'https://good360.org', hours: 'Varies', description: 'Connects surplus clothing, furniture, and household goods from corporations to nonprofits distributing to people in need. Ask your shelter or case manager to submit a request.', walk_in_welcome: false },
  { id: 7, name: 'SAMHSA — Mental Health & Substance Recovery', category: 'Substance Recovery', provider: 'SAMHSA', city: 'Nationwide', state: 'US', phone: '1-800-662-4357', website: 'https://www.samhsa.gov/find-help/national-helpline', hours: '24/7', description: 'Free, confidential, 24/7 treatment referral and information service for mental health and substance use disorders. Available in English and Spanish.', walk_in_welcome: false },
  { id: 8, name: 'Job Corps — Free Job Training', category: 'Job Training', provider: 'US Dept. of Labor', city: 'Nationwide', state: 'US', phone: '1-800-733-5627', website: 'https://www.jobcorps.gov', hours: 'M–F 8am–6pm', description: 'Free education and job training for ages 16–24. Includes housing, meals, and healthcare while in the program. 100+ locations nationwide.', walk_in_welcome: false },
  { id: 9, name: 'LifeLine — Free Phone Program', category: 'Phone/Internet', provider: 'FCC Lifeline', city: 'Nationwide', state: 'US', phone: '1-800-234-9473', website: 'https://www.lifelinesupport.org', hours: 'Business hours', description: 'Free or deeply discounted phone service for low-income individuals. Qualify based on income or participation in SNAP, Medicaid, or other programs.', walk_in_welcome: false },
  { id: 10, name: 'HealthWell Foundation', category: 'Medical', provider: 'HealthWell Foundation', city: 'Nationwide', state: 'US', phone: '1-800-675-8416', website: 'https://www.healthwellfoundation.org', hours: 'M–F 9am–5pm ET', description: 'Assists underinsured patients with healthcare costs, including medication, insurance premiums, and copays. Over 65 disease-specific programs.', walk_in_welcome: false },
]

const CATEGORIES = ['All', 'Food', 'Clothing', 'Medical', 'Mental Health', 'Legal Aid', 'ID Recovery', 'Job Training', 'Financial Assistance', 'Phone/Internet', 'Substance Recovery', 'Other']

const CATEGORY_ICONS = {
  'Food': '🍽️', 'Clothing': '👕', 'Medical': '🏥', 'Mental Health': '🧠',
  'Legal Aid': '⚖️', 'ID Recovery': '🪪', 'Job Training': '🎓',
  'Financial Assistance': '💰', 'Phone/Internet': '📱', 'Substance Recovery': '💊',
  'Childcare': '👶', 'Transportation': '🚌', 'Faith-Based': '⛪', 'Other': '🤝'
}

export default function Resources() {
  const [catFilter, setCatFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = SAMPLE_RESOURCES.filter(r => {
    if (catFilter !== 'All' && r.category !== catFilter) return false
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🤝 Support Resources</h1>
        <p className="text-gray-500">Food, medical care, legal help, ID recovery, job training, and more — all in one place.</p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all ${catFilter === cat ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'}`}
          >
            {CATEGORY_ICONS[cat] || ''} {cat}
          </button>
        ))}
      </div>

      <input
        placeholder="Search resources..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 mb-6"
      />

      <div className="text-sm text-gray-400 mb-4">{filtered.length} resources found</div>

      <div className="grid gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(r)}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="text-base font-bold text-gray-800">{r.name}</h2>
                <p className="text-gray-500 text-sm">{r.provider}</p>
              </div>
              <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{CATEGORY_ICONS[r.category]} {r.category}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1"><MapPin size={12} />{r.city}, {r.state}</span>
              <span className="flex items-center gap-1"><Phone size={12} />{r.phone}</span>
              {r.hours && <span className="flex items-center gap-1"><Clock size={12} />{r.hours}</span>}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">{r.description}</p>
            {r.walk_in_welcome && <span className="mt-2 inline-block bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full">✅ Walk-ins welcome</span>}
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.name}</h2>
                <p className="text-gray-500 text-sm">{selected.provider}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><MapPin size={14} />{selected.city}, {selected.state}</div>
              <div className="flex items-center gap-2"><Phone size={14} />{selected.phone}</div>
              {selected.hours && <div className="flex items-center gap-2"><Clock size={14} />{selected.hours}</div>}
              {selected.website && <div className="flex items-center gap-2"><Globe size={14} /><a href={selected.website} target="_blank" rel="noopener noreferrer" className="text-green-700 underline" onClick={e => e.stopPropagation()}>{selected.website}</a></div>}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">{selected.description}</p>
            </div>

            {selected.walk_in_welcome && (
              <div className="p-3 bg-teal-50 rounded-xl">
                <p className="text-teal-800 text-sm font-medium">✅ Walk-ins are welcome — no appointment needed.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
