import React, { useState } from 'react'
import { Search, MapPin, Clock, Phone, Globe, CheckCircle } from 'lucide-react'

const RESOURCES = [
  { id:1, name:'Feeding America Network', type:'Food Bank', country:'United States', city:'Nationwide', phone:'1-800-771-2303', website:'feedingamerica.org', hours:'Varies by location', description:'200+ food banks across the US. Find your nearest location and get free groceries, no income verification at most sites.', accepts_snap:true, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:true },
  { id:2, name:'World Food Programme Food Assistance', type:'Emergency Food', country:'Global', city:'Multiple Countries', phone:'N/A', website:'wfp.org', hours:'Ongoing', description:'WFP operates in 120+ countries delivering emergency food assistance, school meals, and nutrition programs to the world\'s most vulnerable.', accepts_snap:false, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:true },
  { id:3, name:'Community Fridge Network', type:'Community Fridge', country:'United States', city:'Major Cities', phone:'N/A', website:'community-fridge.com', hours:'24/7', description:'Take what you need, leave what you can. Free community refrigerators stocked by neighbors. No registration, no ID, open 24/7.', accepts_snap:false, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:true },
  { id:4, name:'SNAP — Supplemental Nutrition Assistance', type:'Benefits Program', country:'United States', city:'Nationwide', phone:'1-800-221-5689', website:'fns.usda.gov/snap', hours:'M–F 8am–5pm', description:'Monthly benefits loaded onto an EBT card to buy groceries. Most households qualify. Apply online at your state\'s SNAP website.', accepts_snap:true, no_id_required:false, walk_in:false, serves_children:true, serves_seniors:true },
  { id:5, name:'WIC — Women, Infants & Children', type:'Benefits Program', country:'United States', city:'Nationwide', phone:'1-800-942-3678', website:'fns.usda.gov/wic', hours:'M–F 8am–5pm', description:'Free healthy foods, nutrition counseling, and support for pregnant women, new mothers, and children under 5. Walk-in clinics available.', accepts_snap:false, no_id_required:false, walk_in:true, serves_children:true, serves_seniors:false },
  { id:6, name:'Food Bank for the City of New York', type:'Food Bank', country:'United States', city:'New York, NY', phone:'212-566-7855', website:'foodbanknyc.org', hours:'M–F 9am–5pm', description:'Distributes 92M+ meals/year across 5 boroughs. Find community pantries, soup kitchens, and mobile food programs near you.', accepts_snap:true, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:true },
  { id:7, name:'Caritas International Food Aid', type:'Emergency Food', country:'Global', city:'160+ Countries', phone:'N/A', website:'caritas.org', hours:'Varies', description:'Caritas operates food distribution, emergency relief, and sustainable agriculture programs across 160+ countries worldwide.', accepts_snap:false, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:true },
  { id:8, name:'Meals on Wheels', type:'Home Delivery', country:'United States', city:'Nationwide', phone:'1-888-998-6325', website:'mealsonwheelsamerica.org', hours:'M–F (varies)', description:'Free or low-cost hot meal delivery to seniors and homebound individuals. Over 5,000 programs nationwide. No cost for those who cannot pay.', accepts_snap:false, no_id_required:true, walk_in:false, serves_children:false, serves_seniors:true },
  { id:9, name:'Second Harvest Food Bank', type:'Food Bank', country:'Canada', city:'Nationwide', phone:'416-408-2594', website:'secondharvest.ca', hours:'Varies', description:'Canada\'s largest food rescue organization. Redistributes surplus food to 2,000+ charities across Canada.', accepts_snap:false, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:true },
  { id:10, name:'UNICEF Nutrition Programs', type:'Global Nutrition', country:'Global', city:'190+ Countries', phone:'N/A', website:'unicef.org/nutrition', hours:'N/A', description:'UNICEF provides life-saving nutrition support to children under 5, pregnant mothers, and families in crisis across 190+ countries.', accepts_snap:false, no_id_required:true, walk_in:true, serves_children:true, serves_seniors:false },
]

const TYPES = ['All','Food Bank','Community Fridge','Benefits Program','Emergency Food','Home Delivery','Global Nutrition']

export default function FindFood() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [childrenFilter, setChildrenFilter] = useState(false)
  const [seniorsFilter, setSeniorsFilter] = useState(false)
  const [noIdFilter, setNoIdFilter] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = RESOURCES.filter(r => {
    if (typeFilter !== 'All' && r.type !== typeFilter) return false
    if (childrenFilter && !r.serves_children) return false
    if (seniorsFilter && !r.serves_seniors) return false
    if (noIdFilter && !r.no_id_required) return false
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.city.toLowerCase().includes(search.toLowerCase()) &&
        !r.country.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const typeColor = { 'Food Bank':'bg-orange-100 text-orange-700','Community Fridge':'bg-teal-100 text-teal-700','Benefits Program':'bg-blue-100 text-blue-700','Emergency Food':'bg-red-100 text-red-700','Home Delivery':'bg-purple-100 text-purple-700','Global Nutrition':'bg-green-100 text-green-700' }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Find Healthy Food</h1>
        <p className="text-gray-500">Food banks, meal programs, benefits, community fridges, and global food aid — search by location or need.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input placeholder="Search by name, city, or country..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" checked={childrenFilter} onChange={e => setChildrenFilter(e.target.checked)} className="accent-green-600 w-4 h-4" /> Serves children</label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" checked={seniorsFilter} onChange={e => setSeniorsFilter(e.target.checked)} className="accent-green-600 w-4 h-4" /> Serves seniors</label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" checked={noIdFilter} onChange={e => setNoIdFilter(e.target.checked)} className="accent-green-600 w-4 h-4" /> No ID required</label>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">{filtered.length} resources found</div>

      <div className="grid gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(r)}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{r.name}</h2>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5"><MapPin size={13} />{r.city}, {r.country}</div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColor[r.type] || 'bg-gray-100 text-gray-600'}`}>{r.type}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{r.description}</p>
            <div className="flex flex-wrap gap-2">
              {r.no_id_required && <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">✅ No ID required</span>}
              {r.walk_in && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">🚶 Walk-in welcome</span>}
              {r.serves_children && <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">👶 Serves children</span>}
              {r.serves_seniors && <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">👴 Serves seniors</span>}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div><h2 className="text-xl font-bold text-gray-800">{selected.name}</h2><p className="text-gray-500 text-sm">{selected.type}</p></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2"><MapPin size={14} />{selected.city}, {selected.country}</div>
              {selected.phone !== 'N/A' && <div className="flex items-center gap-2"><Phone size={14} />{selected.phone}</div>}
              <div className="flex items-center gap-2"><Clock size={14} />{selected.hours}</div>
              <div className="flex items-center gap-2"><Globe size={14} /><a href={`https://${selected.website}`} target="_blank" rel="noopener noreferrer" className="text-green-700 underline" onClick={e=>e.stopPropagation()}>{selected.website}</a></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl mb-4"><p className="text-gray-700 text-sm leading-relaxed">{selected.description}</p></div>
            <div className="flex flex-wrap gap-2">
              {selected.no_id_required && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> No ID required</span>}
              {selected.walk_in && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">🚶 Walk-in welcome</span>}
              {selected.serves_children && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">👶 Serves children</span>}
              {selected.serves_seniors && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">👴 Serves seniors</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
