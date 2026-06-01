import React, { useState } from 'react'
import { Building2, MapPin, Users, DollarSign, Heart, CheckCircle } from 'lucide-react'

const SAMPLE_HOUSING = [
  { id: 1, title: 'Hope House Emergency Shelter', provider_name: 'Hope House Ministries', housing_type: 'Emergency Shelter', location_city: 'Chicago', location_state: 'IL', address: '1200 W. Madison St.', cost: 'Free', available_spots: 12, description: '90-day stay, three meals daily, case management, job placement assistance. Cots and lockers provided. Check-in by 7pm nightly.', requirements: 'Nonviolent background only. No active warrants.', accepts_pets: false, accepts_families: true, lgbtq_affirming: true, wheelchair_accessible: true, status: 'Available' },
  { id: 2, title: 'Sunrise Transitional Apartments', provider_name: 'Community Housing Partners', housing_type: 'Transitional Housing', location_city: 'Los Angeles', location_state: 'CA', address: '4500 S. Vermont Ave.', cost: '30% of income (income-based)', available_spots: 4, description: 'Private studio apartments for up to 24 months. Includes case management, life skills classes, and employment support. Path to permanent housing.', requirements: 'Income verification required. Clean record preferred but barriers considered.', accepts_pets: false, accepts_families: false, lgbtq_affirming: true, wheelchair_accessible: false, status: 'Available' },
  { id: 3, title: 'Family First Housing', provider_name: 'St. Vincent de Paul', housing_type: 'Transitional Housing', location_city: 'Phoenix', location_state: 'AZ', address: '215 N. 5th Ave.', cost: 'Free for first 30 days, sliding scale after', available_spots: 6, description: 'Housing specifically for families with children. Private rooms, shared kitchen, childcare support, and school enrollment assistance.', requirements: 'Families with minor children only. Nonviolent record required.', accepts_pets: false, accepts_families: true, lgbtq_affirming: true, wheelchair_accessible: true, status: 'Available' },
  { id: 4, title: 'New Leaf Sober Living', provider_name: 'Recovery Road Foundation', housing_type: 'Sober Living', location_city: 'Denver', location_state: 'CO', address: '890 Logan St.', cost: '$350/month (assistance available)', available_spots: 3, description: 'Clean and sober living environment with peer support, 12-step meetings, and employment assistance. Structured but supportive.', requirements: 'Sobriety commitment. 30-day minimum. Weekly drug screening.', accepts_pets: false, accepts_families: false, lgbtq_affirming: true, wheelchair_accessible: false, status: 'Available' },
  { id: 5, title: 'Room for Rent — Shared Housing', provider_name: 'Private Landlord (Community Match)', housing_type: 'Room for Rent', location_city: 'Atlanta', location_state: 'GA', address: 'Match-based (address shared upon placement)', cost: '$400/month, utilities included', available_spots: 2, description: 'Vetted private homeowners with spare rooms offering affordable rent to working individuals. Background checked but compassionate. Great stepping stone.', requirements: 'Employed or active job search. Non-smoker preferred.', accepts_pets: true, accepts_families: false, lgbtq_affirming: true, wheelchair_accessible: false, status: 'Available' },
  { id: 6, title: 'Tiny Home Village — Plot #7', provider_name: 'Dignity Village Alliance', housing_type: 'Tiny Home', location_city: 'Portland', location_state: 'OR', address: '3100 NE 82nd Ave.', cost: '$75/month maintenance fee', available_spots: 1, description: '120 sq ft private tiny home with locking door, electricity, and heating. Shared bathrooms and kitchen. Community-run, democratic governance.', requirements: 'Nonviolent. Willingness to contribute 8 hrs/month community service.', accepts_pets: true, accepts_families: false, lgbtq_affirming: true, wheelchair_accessible: false, status: 'Available' },
]

const TYPES = ['All', 'Emergency Shelter', 'Transitional Housing', 'Sober Living', 'Room for Rent', 'Subsidized Apartment', 'Tiny Home']

export default function Housing() {
  const [typeFilter, setTypeFilter] = useState('All')
  const [petsOk, setPetsOk] = useState(false)
  const [familyOk, setFamilyOk] = useState(false)
  const [lgbtq, setLgbtq] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = SAMPLE_HOUSING.filter(h => {
    if (typeFilter !== 'All' && h.housing_type !== typeFilter) return false
    if (petsOk && !h.accepts_pets) return false
    if (familyOk && !h.accepts_families) return false
    if (lgbtq && !h.lgbtq_affirming) return false
    if (search && !h.title.toLowerCase().includes(search.toLowerCase()) &&
        !h.location_city.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const typeColor = { 'Emergency Shelter': 'bg-red-100 text-red-700', 'Transitional Housing': 'bg-blue-100 text-blue-700', 'Sober Living': 'bg-teal-100 text-teal-700', 'Room for Rent': 'bg-yellow-100 text-yellow-700', 'Tiny Home': 'bg-green-100 text-green-700', 'Subsidized Apartment': 'bg-purple-100 text-purple-700' }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🏠 Find Housing</h1>
        <p className="text-gray-500">Safe, stable places to stay — from emergency shelters to permanent homes. Filtered for your needs.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            placeholder="Search city or listing..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={petsOk} onChange={e => setPetsOk(e.target.checked)} className="accent-green-600 w-4 h-4" /> Pets welcome
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={familyOk} onChange={e => setFamilyOk(e.target.checked)} className="accent-green-600 w-4 h-4" /> Families welcome
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={lgbtq} onChange={e => setLgbtq(e.target.checked)} className="accent-green-600 w-4 h-4" /> LGBTQ+ affirming
          </label>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">{filtered.length} listings found</div>

      <div className="grid gap-4">
        {filtered.map(h => (
          <div key={h.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(h)}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{h.title}</h2>
                <p className="text-gray-500 text-sm">{h.provider_name}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColor[h.housing_type] || 'bg-gray-100 text-gray-600'}`}>{h.housing_type}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1"><MapPin size={14} />{h.location_city}, {h.location_state}</span>
              <span className="flex items-center gap-1"><DollarSign size={14} />{h.cost}</span>
              {h.available_spots > 0 && <span className="flex items-center gap-1 text-green-600"><Users size={14} />{h.available_spots} spot{h.available_spots !== 1 ? 's' : ''} available</span>}
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{h.description}</p>

            <div className="flex flex-wrap gap-2">
              {h.lgbtq_affirming && <span className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">🏳️‍🌈 LGBTQ+ Affirming</span>}
              {h.accepts_families && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">👨‍👩‍👧 Families Welcome</span>}
              {h.accepts_pets && <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">🐾 Pets OK</span>}
              {h.wheelchair_accessible && <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">♿ Accessible</span>}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Building2 size={40} className="mx-auto mb-4 opacity-30" />
            <p>No listings match your filters. Try adjusting them.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.title}</h2>
                <p className="text-gray-500">{selected.provider_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><MapPin size={14} />{selected.location_city}, {selected.location_state}</div>
              {selected.address && <div className="flex items-center gap-2"><MapPin size={14} />{selected.address}</div>}
              <div className="flex items-center gap-2"><DollarSign size={14} />{selected.cost}</div>
              <div className="flex items-center gap-2"><Users size={14} />{selected.available_spots} spot(s) available</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl mb-3">
              <p className="text-gray-700 text-sm leading-relaxed">{selected.description}</p>
            </div>

            {selected.requirements && (
              <div className="p-3 bg-yellow-50 rounded-xl mb-3">
                <p className="text-yellow-800 text-sm"><strong>Requirements:</strong> {selected.requirements}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {selected.lgbtq_affirming && <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">🏳️‍🌈 LGBTQ+ Affirming</span>}
              {selected.accepts_families && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">👨‍👩‍👧 Families Welcome</span>}
              {selected.accepts_pets && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">🐾 Pets OK</span>}
              {selected.wheelchair_accessible && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">♿ Accessible</span>}
            </div>

            <div className="p-4 bg-green-700 rounded-xl text-white text-center">
              <p className="font-bold mb-1">How to get a spot</p>
              <p className="text-sm text-green-100">Contact {selected.provider_name} directly, visit in person, or call 2-1-1 for local placement assistance.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
