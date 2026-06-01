import React, { useState, useEffect } from 'react'
import { Briefcase, MapPin, DollarSign, Clock, Filter, CheckCircle, Phone } from 'lucide-react'

const SAMPLE_JOBS = [
  { id: 1, title: 'Warehouse Associate', employer_name: 'City Logistics Co.', job_type: 'Full-Time', pay_rate: '$18/hr', location_city: 'Chicago', location_state: 'IL', description: 'Loading and unloading freight, inventory management. No experience needed — full training provided.', is_barrier_friendly: true, accepts_no_fixed_address: true, accepts_no_id: false, benefits: 'Health insurance after 90 days, paid time off', status: 'Open', tags: ['No Experience', 'Physical', 'Benefits'] },
  { id: 2, title: 'Day Laborer — Construction', employer_name: 'Build Right LLC', job_type: 'Day Labor', pay_rate: '$17–22/hr', location_city: 'Los Angeles', location_state: 'CA', description: 'Daily construction work — painting, clean-up, materials handling. Show up at 6am, paid same day in cash.', is_barrier_friendly: true, accepts_no_fixed_address: true, accepts_no_id: true, benefits: 'Cash same day', status: 'Open', tags: ['Same Day Pay', 'No ID Required', 'Physical'] },
  { id: 3, title: 'Food Service Worker', employer_name: 'Community Kitchen Network', job_type: 'Part-Time', pay_rate: '$16/hr', location_city: 'New York', location_state: 'NY', description: 'Prep cooking, serving, and clean-up at our community kitchen. Flexible hours, supportive team, meals included.', is_barrier_friendly: true, accepts_no_fixed_address: true, accepts_no_id: false, benefits: 'Free meals on shift', status: 'Open', tags: ['Flexible Hours', 'Food Included', 'Social Mission'] },
  { id: 4, title: 'Landscaping Crew Member', employer_name: 'GreenThumb Services', job_type: 'Seasonal', pay_rate: '$16/hr', location_city: 'Denver', location_state: 'CO', description: 'Mowing, trimming, planting for residential and commercial clients. Outdoor work, team environment.', is_barrier_friendly: true, accepts_no_fixed_address: true, accepts_no_id: false, benefits: 'Equipment provided', status: 'Open', tags: ['Outdoor', 'Team Work', 'No Experience'] },
  { id: 5, title: 'Remote Data Entry Specialist', employer_name: 'TechBridge Solutions', job_type: 'Remote', pay_rate: '$15/hr', location_city: 'Remote', location_state: 'Anywhere', description: 'Enter and verify data from home or library computer. Flexible hours. Need basic typing skills only.', is_barrier_friendly: true, accepts_no_fixed_address: true, accepts_no_id: false, benefits: 'Work from anywhere', status: 'Open', tags: ['Remote', 'Flexible', 'Computer Skills'] },
  { id: 6, title: 'Janitorial Staff', employer_name: 'CleanCo Building Services', job_type: 'Full-Time', pay_rate: '$17/hr + benefits', location_city: 'Houston', location_state: 'TX', description: 'Evening cleaning shifts for office buildings. Steady hours, stable employer, advancement opportunities.', is_barrier_friendly: true, accepts_no_fixed_address: true, accepts_no_id: false, benefits: 'Health + dental after 60 days', status: 'Open', tags: ['Evening Shift', 'Benefits', 'Stable'] },
]

const JOB_TYPES = ['All', 'Full-Time', 'Part-Time', 'Temporary', 'Seasonal', 'Day Labor', 'Remote']

export default function Jobs() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS)
  const [typeFilter, setTypeFilter] = useState('All')
  const [noIdOnly, setNoIdOnly] = useState(false)
  const [noAddressOnly, setNoAddressOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = jobs.filter(j => {
    if (typeFilter !== 'All' && j.job_type !== typeFilter) return false
    if (noIdOnly && !j.accepts_no_id) return false
    if (noAddressOnly && !j.accepts_no_fixed_address) return false
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) &&
        !j.employer_name.toLowerCase().includes(search.toLowerCase()) &&
        !j.location_city.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const typeColors = { 'Full-Time': 'bg-blue-100 text-blue-700', 'Part-Time': 'bg-purple-100 text-purple-700', 'Day Labor': 'bg-orange-100 text-orange-700', 'Remote': 'bg-teal-100 text-teal-700', 'Seasonal': 'bg-yellow-100 text-yellow-700', 'Temporary': 'bg-gray-100 text-gray-700' }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">💼 Find Work</h1>
        <p className="text-gray-500">Jobs that welcome you — regardless of your situation. No judgment here.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            placeholder="Search jobs or employers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
            <input type="checkbox" checked={noIdOnly} onChange={e => setNoIdOnly(e.target.checked)} className="accent-green-600 w-4 h-4" />
            No ID required
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
            <input type="checkbox" checked={noAddressOnly} onChange={e => setNoAddressOnly(e.target.checked)} className="accent-green-600 w-4 h-4" />
            No fixed address needed
          </label>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">{filtered.length} jobs found</div>

      {/* Job cards */}
      <div className="grid gap-4">
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(job)}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>
                <p className="text-gray-500 text-sm">{job.employer_name}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[job.job_type] || 'bg-gray-100 text-gray-600'}`}>{job.job_type}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1"><MapPin size={14} />{job.location_city}, {job.location_state}</span>
              <span className="flex items-center gap-1"><DollarSign size={14} />{job.pay_rate}</span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2">
              {job.accepts_no_fixed_address && <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">✅ No fixed address required</span>}
              {job.accepts_no_id && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">✅ No ID required</span>}
              {job.tags?.map(t => <span key={t} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">{t}</span>)}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
            <p>No jobs match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.title}</h2>
                <p className="text-gray-500">{selected.employer_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><MapPin size={15} />{selected.location_city}, {selected.location_state}</div>
              <div className="flex items-center gap-2 text-gray-600"><DollarSign size={15} />{selected.pay_rate}</div>
              <div className="flex items-center gap-2 text-gray-600"><Clock size={15} />{selected.job_type}</div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">{selected.description}</p>
            </div>

            {selected.benefits && (
              <div className="mt-3 p-3 bg-green-50 rounded-xl">
                <p className="text-green-800 text-sm"><strong>Benefits:</strong> {selected.benefits}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {selected.accepts_no_fixed_address && <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"><CheckCircle size={12} /> No fixed address required</span>}
              {selected.accepts_no_id && <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"><CheckCircle size={12} /> No ID required</span>}
            </div>

            <div className="mt-6 p-4 bg-green-700 rounded-xl text-white text-center">
              <p className="font-bold mb-1">Ready to apply?</p>
              <p className="text-sm text-green-100">Contact {selected.employer_name} directly or visit your nearest workforce center and mention this listing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
