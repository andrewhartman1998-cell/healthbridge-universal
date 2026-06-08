import React, { useState } from 'react'
import { Globe, MapPin, ExternalLink } from 'lucide-react'

const REGIONS = [
  { region:'North America', emoji:'🌎', orgs:[
    { name:'Feeding America', url:'feedingamerica.org', desc:'200+ food banks across the US' },
    { name:'Food Banks Canada', url:'foodbankscanada.ca', desc:'550+ food banks nationwide' },
    { name:'Banco de Alimentos Mexico', url:'bamx.org.mx', desc:'Mexican food bank network' },
  ]},
  { region:'South America', emoji:'🌎', orgs:[
    { name:'Banco de Alimentos (Brazil)', url:'alimentando.org.br', desc:'Largest food bank network in Brazil' },
    { name:'Red de Bancos de Alimentos Argentina', url:'bancodealimentos.org.ar', desc:'Argentine food bank network' },
    { name:'WFP South America', url:'wfp.org', desc:'UN food assistance across the region' },
  ]},
  { region:'Europe', emoji:'🌍', orgs:[
    { name:'The European Food Banks Federation', url:'eurofoodbank.org', desc:'400+ food banks across 29 countries' },
    { name:'FareShare (UK)', url:'fareshare.org.uk', desc:'Redistributes surplus food across the UK' },
    { name:'Tafel Deutschland', url:'tafel.de', desc:'960 food banks across Germany' },
  ]},
  { region:'Africa', emoji:'🌍', orgs:[
    { name:'African Food Banking Network', url:'foodbanking.org', desc:'Food banks across 40+ African countries' },
    { name:'WFP Africa', url:'wfp.org/africa', desc:'Emergency food aid and nutrition programs' },
    { name:'Food & Trees for Africa', url:'trees.org.za', desc:'Community gardens and food security in South Africa' },
  ]},
  { region:'Asia', emoji:'🌏', orgs:[
    { name:'Food Bank Singapore', url:'foodbank.sg', desc:'Singapore - the largest food distribution charity' },
    { name:'Robin Hood Army', url:'robinhoodarmy.com', desc:'Volunteer food rescue network across 17 Asian countries' },
    { name:'WFP Asia & Pacific', url:'wfp.org/asia-pacific', desc:'Food aid programs across the region' },
  ]},
  { region:'Middle East', emoji:'🌍', orgs:[
    { name:'UAE Food Bank', url:'uaefoodbank.ae', desc:'Food redistribution across the UAE' },
    { name:'UNRWA Food Aid', url:'unrwa.org', desc:'Food assistance for Palestinian refugees' },
    { name:'WFP Middle East', url:'wfp.org/middle-east', desc:'Emergency and development food programs' },
  ]},
  { region:'Oceania', emoji:'🌏', orgs:[
    { name:'Foodbank Australia', url:'foodbank.org.au', desc:'Largest hunger relief org in Australia' },
    { name:'KiwiHarvest', url:'kiwiharvest.org.nz', desc:'NZ food rescue and redistribution' },
    { name:'Pacific Community (SPC)', url:'spc.int', desc:'Food security programs across Pacific islands' },
  ]},
  { region:'Global Programs', emoji:'🌐', orgs:[
    { name:'World Food Programme', url:'wfp.org', desc:'UN agency — food aid in 120+ countries' },
    { name:'UNICEF Nutrition', url:'unicef.org/nutrition', desc:'Child nutrition in 190+ countries' },
    { name:'FAO — Food & Agriculture Org', url:'fao.org', desc:'UN agency addressing global food security' },
    { name:'Action Against Hunger', url:'actionagainsthunger.org', desc:'Emergency nutrition in 50+ countries' },
    { name:'Heifer International', url:'heifer.org', desc:'Livestock and farming support in 19 countries' },
  ]},
]

export default function GlobalMap() {
  const [selectedRegion, setSelectedRegion] = useState(null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🌍 Global Food Map</h1>
        <p className="text-gray-500">Food resources across every region of the world. Click any region to see organizations serving that area.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {REGIONS.map(r => (
          <button key={r.region} onClick={() => setSelectedRegion(selectedRegion?.region === r.region ? null : r)}
            className={`rounded-2xl p-4 text-center border-2 transition-all ${selectedRegion?.region === r.region ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white hover:border-green-300'}`}>
            <div className="text-3xl mb-2">{r.emoji}</div>
            <div className="text-sm font-bold text-gray-700">{r.region}</div>
            <div className="text-xs text-gray-400 mt-1">{r.orgs.length} resources</div>
          </button>
        ))}
      </div>

      {selectedRegion && (
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedRegion.emoji} {selectedRegion.region} — Food Resources</h2>
          <div className="grid gap-3">
            {selectedRegion.orgs.map((o, i) => (
              <div key={i} className="flex items-start justify-between gap-4 p-4 bg-green-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800 text-sm">{o.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{o.desc}</div>
                </div>
                <a href={`https://${o.url}`} target="_blank" rel="noopener noreferrer"
                  className="text-green-700 text-xs font-medium flex items-center gap-1 whitespace-nowrap hover:underline">
                  Visit <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedRegion && (
        <div className="text-center py-10 text-gray-400">
          <Globe size={48} className="mx-auto mb-3 opacity-30" />
          <p>Select a region above to see food resources in that area.</p>
        </div>
      )}

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">📍 Can't find your country?</h3>
        <p className="text-blue-700 text-sm leading-relaxed">
          Try calling <strong>your national emergency services (112 or 911)</strong> and asking to be connected to food assistance. 
          Or visit <a href="https://www.wfp.org" target="_blank" rel="noopener noreferrer" className="underline">wfp.org</a> or <a href="https://www.fao.org" target="_blank" rel="noopener noreferrer" className="underline">fao.org</a> — the UN operates food programs in virtually every country on Earth.
        </p>
      </div>
    </div>
  )
}
