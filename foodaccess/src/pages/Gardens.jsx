import React, { useState } from 'react'
import { Sprout, MapPin, Users, Sun } from 'lucide-react'

const GARDENS = [
  { id:1, name:'American Community Gardening Association', country:'United States', city:'Nationwide', type:'Network', website:'communitygarden.org', description:'Find community garden plots, seed libraries, and urban farming projects across the US. Connects 18,000+ gardens.', has_plots:true, has_seeds:true, free:true },
  { id:2, name:'The Incredible Edible Network', country:'United Kingdom / Global', city:'International', type:'Movement', website:'incredibleedible.org.uk', description:'A grassroots movement turning public spaces into productive food gardens. 1,000+ groups in 30+ countries. Anyone can start one.', has_plots:true, has_seeds:false, free:true },
  { id:3, name:'Urban Harvest Houston', country:'United States', city:'Houston, TX', type:'Urban Farm', website:'urbanharvest.org', description:'Community gardens, school gardens, and farmers markets. Free plot applications available. Offers organic gardening workshops.', has_plots:true, has_seeds:true, free:true },
  { id:4, name:'GrowNYC Community Gardens', country:'United States', city:'New York, NY', type:'City Program', website:'grownyc.org', description:'550+ community gardens across NYC boroughs. Free membership and plot access. Seed swaps and composting programs available.', has_plots:true, has_seeds:true, free:true },
  { id:5, name:'The National Seed Library', country:'United States', city:'Online / Nationwide', type:'Seed Library', website:'seedlibrary.org', description:'Borrow seeds free from your public library. Over 700 seed libraries nationwide. Return seeds at end of season to keep the cycle going.', has_plots:false, has_seeds:true, free:true },
  { id:6, name:'Food Not Lawns', country:'Global', city:'International', type:'Movement', website:'foodnotlawns.com', description:'A global movement to replace ornamental lawns with edible gardens. Free guides on starting your own garden and sharing food with neighbors.', has_plots:false, has_seeds:true, free:true },
]

export default function Gardens() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🌿 Community Gardens</h1>
        <p className="text-gray-500">Grow your own food, join a community plot, or borrow seeds — all free. Find gardens and seed libraries near you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GARDENS.map(g => (
          <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(g)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-800 text-base">{g.name}</h2>
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5"><MapPin size={13} />{g.city}, {g.country}</div>
              </div>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">{g.type}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{g.description}</p>
            <div className="flex flex-wrap gap-2">
              {g.has_plots && <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full">🌱 Garden plots</span>}
              {g.has_seeds && <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">🌾 Seeds available</span>}
              {g.free && <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">✅ Free</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-green-50 rounded-2xl p-6 border border-green-200">
        <h2 className="font-bold text-green-800 text-lg mb-3">🌻 How to Start a Community Garden</h2>
        <ol className="text-sm text-green-700 space-y-2 list-decimal list-inside leading-relaxed">
          <li>Find unused land in your neighborhood — parks, church lots, school grounds</li>
          <li>Talk to your neighbors — 5–10 people is enough to start</li>
          <li>Contact your city parks department for a permit or partnership</li>
          <li>Apply for a free plot or tool grants from your local extension office</li>
          <li>Use the American Community Gardening Association's free startup guide</li>
          <li>Start small, grow big — even a single raised bed feeds a family</li>
        </ol>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div><h2 className="text-xl font-bold text-gray-800">{selected.name}</h2><p className="text-gray-500 text-sm">{selected.city}, {selected.country}</p></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl mb-4"><p className="text-gray-700 text-sm leading-relaxed">{selected.description}</p></div>
            <a href={`https://${selected.website}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-green-700 text-white text-center font-bold py-3 rounded-xl hover:bg-green-800 transition-all">Visit Website →</a>
          </div>
        </div>
      )}
    </div>
  )
}
