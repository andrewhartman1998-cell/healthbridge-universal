import React, { useState } from 'react'
import { Search, DollarSign, Calendar, ExternalLink, BookOpen } from 'lucide-react'

const GRANTS = [
  { id:1, name:'USDA Community Facilities Grant', funder:'US Dept. of Agriculture', type:'Federal', cause:['Health','Education','Community Development'], amount:'Up to $25,000', deadline:'Rolling', eligibility:'Nonprofits in rural areas (population under 20,000)', description:'Funds essential community facilities including health clinics, schools, childcare centers, and community buildings in rural communities.', url:'rd.usda.gov/programs-services/community-facilities', difficulty:'Moderate', competition:'Medium' },
  { id:2, name:'Community Development Block Grant (CDBG)', funder:'HUD — US Dept. of Housing', type:'Federal', cause:['Housing','Community Development','Poverty'], amount:'$50,000 – $2M+', deadline:'Varies by city/county', eligibility:'Nonprofits serving low-to-moderate income communities', description:'One of the largest federal grant programs. Funds housing, economic development, and community services. Apply through your local city or county government.', url:'hud.gov/program_offices/comm_planning/cdbg', difficulty:'High', competition:'High' },
  { id:3, name:'AmeriCorps Volunteer Generation Fund', funder:'AmeriCorps', type:'Federal', cause:['Community Development','Education','Poverty'], amount:'$50,000 – $500,000', deadline:'Annual (spring)', eligibility:'501(c)(3) nonprofits with volunteer programs', description:'Supports organizations that recruit, manage, and support volunteers. Perfect for nonprofits that rely on volunteers to deliver their mission.', url:'americorps.gov/partner/funding/volunteer-generation-fund', difficulty:'Moderate', competition:'Medium' },
  { id:4, name:'Bank of America Charitable Foundation Grant', funder:'Bank of America', type:'Corporate', cause:['Economic Mobility','Housing','Workforce Development'], amount:'$5,000 – $100,000', deadline:'Rolling / LOI required', eligibility:'US-based 501(c)(3) organizations', description:'Focuses on economic mobility, affordable housing, and workforce development. Submit a Letter of Intent (LOI) first — full application by invitation.', url:'about.bankofamerica.com/en/making-an-impact/charitable-foundation-financing', difficulty:'Moderate', competition:'High' },
  { id:5, name:'W.K. Kellogg Foundation Grant', funder:'W.K. Kellogg Foundation', type:'Foundation', cause:['Education','Health','Food & Agriculture','Racial Equity'], amount:'$100,000 – $1M+', deadline:'Rolling (LOI first)', eligibility:'US nonprofits focused on children and families', description:'One of the largest US foundations. Focuses on thriving children, working families, and equitable communities. Prefers multi-year funding relationships.', url:'wkkf.org/grants', difficulty:'High', competition:'High' },
  { id:6, name:'Google.org Impact Challenge', funder:'Google.org', type:'Corporate', cause:['Technology','Education','Economic Opportunity'], amount:'$250,000 – $2M', deadline:'Annual (varies)', eligibility:'Nonprofits using technology for social impact', description:'Funds tech-forward nonprofits using innovative solutions. Bonus: winners get Google product donations and volunteer support from Googlers.', url:'google.org/our-work/the-google-org-impact-challenge', difficulty:'High', competition:'Very High' },
  { id:7, name:'Robert Wood Johnson Foundation Grant', funder:'RWJF', type:'Foundation', cause:['Health','Healthcare Access','Public Health'], amount:'$50,000 – $500,000', deadline:'Varies by program', eligibility:'Nonprofits and research organizations', description:'Largest US health-focused foundation. Funds health equity, public health systems, and community health programs.', url:'rwjf.org/en/grants', difficulty:'High', competition:'High' },
  { id:8, name:'USDA SNAP Outreach Grants', funder:'USDA Food & Nutrition Service', type:'Federal', cause:['Food & Agriculture','Poverty','Health'], amount:'$5,000 – $250,000', deadline:'Annual', eligibility:'Nonprofits doing SNAP enrollment outreach', description:'Funds organizations that help eligible people apply for SNAP food benefits. Great for food banks, legal aid orgs, and community centers.', url:'fns.usda.gov/snap/outreach-grants', difficulty:'Low', competition:'Low' },
  { id:9, name:'MacArthur Foundation 100&Change', funder:'MacArthur Foundation', type:'Foundation', cause:['Any — must be transformative'], amount:'$100,000,000 (one grant)', deadline:'Every 3 years', eligibility:'Any nonprofit or for-profit with a transformative solution', description:'A single $100M grant to one organization with the best plan to solve a critical problem. Highly competitive but open to all.', url:'macfound.org/programs/100change', difficulty:'Very High', competition:'Extremely High' },
  { id:10, name:'Local Community Foundation Grants', funder:'Your Local Community Foundation', type:'Foundation', cause:['All causes'], amount:'$1,000 – $50,000', deadline:'Varies', eligibility:'Local nonprofits in the foundation\'s service area', description:'Every major US city has a community foundation offering grants to local nonprofits. These are often EASIER to win because competition is local. Search "[your city] community foundation grants."', url:'cof.org/foundation-type/community-foundations-taxonomy', difficulty:'Low–Moderate', competition:'Low–Moderate' },
]

const CAUSES = ['All','Health','Education','Housing','Food & Agriculture','Community Development','Technology','Economic Opportunity','Poverty','Racial Equity','Workforce Development','Public Health']
const TYPES = ['All','Federal','Foundation','Corporate']
const DIFFICULTIES = ['All','Low','Low–Moderate','Moderate','High','Very High']

export default function FindGrants() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [causeFilter, setCauseFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = GRANTS.filter(g => {
    if (typeFilter !== 'All' && g.type !== typeFilter) return false
    if (causeFilter !== 'All' && !g.cause.includes(causeFilter)) return false
    if (diffFilter !== 'All' && g.difficulty !== diffFilter) return false
    if (search && !g.name.toLowerCase().includes(search.toLowerCase()) &&
        !g.funder.toLowerCase().includes(search.toLowerCase()) &&
        !g.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const typeColor = { Federal:'bg-blue-100 text-blue-700', Foundation:'bg-purple-100 text-purple-700', Corporate:'bg-green-100 text-green-700' }
  const diffColor = { Low:'text-green-600', 'Low–Moderate':'text-teal-600', Moderate:'text-yellow-600', High:'text-orange-600', 'Very High':'text-red-600', 'Extremely High':'text-red-800' }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Find Grants</h1>
        <p className="text-gray-500">Federal, foundation, and corporate grants — filtered by your cause, budget, and experience level.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input placeholder="Search grants, funders, or keywords..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={causeFilter} onChange={e => setCauseFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {CAUSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.filter(d=>d!=='All').map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">{filtered.length} grants found</div>

      <div className="grid gap-4">
        {filtered.map(g => (
          <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(g)}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{g.name}</h2>
                <p className="text-gray-500 text-sm">{g.funder}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColor[g.type] || 'bg-gray-100 text-gray-600'}`}>{g.type}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1"><DollarSign size={14} />{g.amount}</span>
              <span className="flex items-center gap-1"><Calendar size={14} />Deadline: {g.deadline}</span>
              <span className={`font-medium ${diffColor[g.difficulty]}`}>Difficulty: {g.difficulty}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{g.description}</p>
            <div className="flex flex-wrap gap-2">
              {g.cause.slice(0,3).map(c => <span key={c} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">{c}</span>)}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Search size={40} className="mx-auto mb-4 opacity-30" /><p>No grants match your filters.</p></div>}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div><h2 className="text-xl font-bold text-gray-800">{selected.name}</h2><p className="text-gray-500 text-sm">{selected.funder}</p></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-indigo-50 rounded-xl p-3"><div className="text-xs text-gray-500">Award Amount</div><div className="font-bold text-indigo-700">{selected.amount}</div></div>
              <div className="bg-indigo-50 rounded-xl p-3"><div className="text-xs text-gray-500">Deadline</div><div className="font-bold text-indigo-700">{selected.deadline}</div></div>
              <div className="bg-indigo-50 rounded-xl p-3"><div className="text-xs text-gray-500">Difficulty</div><div className={`font-bold ${diffColor[selected.difficulty]}`}>{selected.difficulty}</div></div>
              <div className="bg-indigo-50 rounded-xl p-3"><div className="text-xs text-gray-500">Competition</div><div className="font-bold text-gray-700">{selected.competition}</div></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl mb-3"><p className="text-gray-700 text-sm leading-relaxed">{selected.description}</p></div>
            <div className="p-3 bg-yellow-50 rounded-xl mb-4"><p className="text-yellow-800 text-sm"><strong>Eligibility:</strong> {selected.eligibility}</p></div>
            <div className="flex flex-wrap gap-2 mb-4">{selected.cause.map(c => <span key={c} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{c}</span>)}</div>
            <a href={`https://${selected.url}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full bg-indigo-700 text-white font-bold py-3 rounded-xl hover:bg-indigo-800 transition-all">
              Apply / Learn More <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
