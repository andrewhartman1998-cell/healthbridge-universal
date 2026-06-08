import React, { useState } from 'react'
import { Search } from 'lucide-react'

const COUNTRIES = [
  { flag:'🇺🇸', name:'United States', status:'Proposed', amount:'$1,000/mo', program:'Freedom Dividend (Yang 2020)', notes:'Alaska Permanent Fund ongoing. Multiple city pilots (Stockton, Chicago, LA). Federal proposal by Andrew Yang.' },
  { flag:'🇫🇮', name:'Finland', status:'Piloted', amount:'€560/mo', program:'Basic Income Experiment 2017–2019', notes:'2,000 unemployed adults received €560/month for 2 years. Improved wellbeing, trust, and employment outcomes.' },
  { flag:'🇰🇪', name:'Kenya', status:'Active', amount:'~$22/mo', program:'GiveDirectly Long-Term UBI', notes:'21,000 people in rural Kenya receiving UBI for 12 years (2016–2030). Largest long-term UBI study in the world.' },
  { flag:'🇧🇷', name:'Brazil', status:'Active', amount:'~$26/mo', program:'Maricá Citizen Basic Income', notes:'Maricá city provides basic income in a local digital currency (Mumbuca). National Citizen Basic Income law passed 2022.' },
  { flag:'🇨🇦', name:'Canada', status:'Piloted', amount:'Varies', program:'Manitoba Mincome + Ontario Pilot', notes:'Manitoba 1974–1979 pilot showed health improvements. Ontario 2017–2019 pilot cancelled early by new government.' },
  { flag:'🇬🇧', name:'United Kingdom', status:'Piloting', amount:'£1,600/mo', program:'UK Basic Income Pilot 2022–2024', notes:'30 participants received £1,600/month for 2 years. Positive early results on wellbeing and employment flexibility.' },
  { flag:'🇩🇪', name:'Germany', status:'Piloting', amount:'€1,200/mo', program:'Mein Grundeinkommen', notes:'122 people received €1,200/month for 3 years. Study by German Institute for Economic Research (DIW).' },
  { flag:'🇮🇳', name:'India', status:'Proposed', amount:'₹2,000/mo', program:'Universal Basic Income (Economic Survey 2017)', notes:'India Economic Survey 2017 formally proposed UBI. Sikkim state committed to UBI by 2022. National debate ongoing.' },
  { flag:'🇿🇼', name:'Zimbabwe', status:'Piloted', amount:'Varies', program:'Harmonized Cash Transfer', notes:'UNICEF and government cash transfers to vulnerable families. Evidence of improved nutrition and school enrollment.' },
  { flag:'🇮🇷', name:'Iran', status:'Active', amount:'~$96/family/mo', program:'Subsidy Reform Cash Transfer', notes:'Since 2011, Iran has provided monthly cash to virtually all citizens — replacing energy subsidies. Largest UBI program in the world by share of population.' },
  { flag:'🇲🇽', name:'Mexico', status:'Active', amount:'Varies', program:'Sembrando Vida / Bienestar', notes:'Multiple cash transfer programs reaching millions. Bienestar (Welfare) provides monthly payments to elderly and young people.' },
  { flag:'🇳🇦', name:'Namibia', status:'Piloted', amount:'N$100/mo', program:'Otjivero-Omitara BIG Pilot', notes:'2008–2009 pilot. Crime fell 42%. Poverty fell dramatically. School enrollment rose. Malnutrition fell from 42% to 10%.' },
  { flag:'🇸🇪', name:'Sweden', status:'Discussed', amount:'Varies', program:'Policy discussions ongoing', notes:'Sweden has a robust safety net. Various municipalities have explored UBI as a supplement to existing programs.' },
  { flag:'🇯🇵', name:'Japan', status:'Discussed', amount:'¥70,000/mo', program:'Academic and party proposals', notes:'Japan Communist Party has proposed a form of UBI. Academic interest growing as automation threatens manufacturing jobs.' },
  { flag:'🇲🇳', name:'Mongolia', status:'Active', amount:'~$7/mo', program:'Human Development Fund', notes:'Mongolia distributes a share of its mineral wealth directly to citizens — a sovereign wealth-funded basic income.' },
]

const STATUS_COLORS = {
  'Active': 'bg-green-900 text-green-300 border-green-700',
  'Piloted': 'bg-blue-900 text-blue-300 border-blue-700',
  'Piloting': 'bg-yellow-900 text-yellow-300 border-yellow-700',
  'Proposed': 'bg-purple-900 text-purple-300 border-purple-700',
  'Discussed': 'bg-gray-700 text-gray-300 border-gray-600',
}

export default function Countries() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = COUNTRIES.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.program.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">🌍 UBI Around the World</h1>
        <p className="text-gray-400">Every country experimenting with, proposing, or actively running Universal Basic Income programs.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search countries or programs..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        {['All', 'Active', 'Piloting', 'Piloted', 'Proposed', 'Discussed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${statusFilter === s ? 'bg-purple-700 text-white border-purple-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 mb-4">{filtered.length} countries</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c, i) => (
          <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-5 hover:border-purple-600 transition-all cursor-pointer" onClick={() => setSelected(c)}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{c.flag}</span>
                <div>
                  <div className="font-black text-white">{c.name}</div>
                  <div className="text-purple-400 text-xs">{c.amount}</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[c.status]}`}>{c.status}</span>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">{c.program}</p>
            <p className="text-gray-500 text-xs line-clamp-2">{c.notes}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{selected.flag}</span>
                <div>
                  <h2 className="text-xl font-black text-white">{selected.name}</h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl font-bold">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-xl p-3"><div className="text-gray-500 text-xs">Amount</div><div className="text-white font-bold">{selected.amount}</div></div>
              <div className="bg-gray-800 rounded-xl p-3"><div className="text-gray-500 text-xs">Status</div><div className="text-white font-bold">{selected.status}</div></div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 mb-3"><p className="text-purple-300 text-sm font-bold mb-1">{selected.program}</p><p className="text-gray-300 text-sm leading-relaxed">{selected.notes}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
