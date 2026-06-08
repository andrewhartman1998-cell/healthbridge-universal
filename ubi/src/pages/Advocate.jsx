import React, { useState } from 'react'
import { Megaphone, Mail, Share2, Download, CheckCircle } from 'lucide-react'

const SCRIPTS = [
  { title: 'Call Your Senator (US)', icon: '📞', script: `"Hi, my name is [NAME] and I'm a constituent calling from [CITY, STATE]. I'm calling to urge Senator [NAME] to support Universal Basic Income legislation, including the [relevant bill]. UBI would provide economic security to every American, support caregivers and workers displaced by automation, and stimulate local economies. I'm asking the Senator to co-sponsor UBI legislation and prioritize this issue. Can you tell me the Senator's current position? Thank you."` },
  { title: 'Email Your Representative', icon: '✉️', script: `Subject: Please Support Universal Basic Income Legislation\n\nDear Representative [NAME],\n\nI am writing as your constituent from [CITY, STATE] to urge your support for Universal Basic Income.\n\nAs automation continues to reshape our economy, millions of American workers face an uncertain future. UBI — a monthly cash payment to every adult citizen — would provide a foundation of economic security that stimulates local economies, supports caregivers, and recognizes the dignity of every American.\n\nPilot programs in Stockton, California and across the globe have demonstrated measurable improvements in employment, mental health, and economic mobility.\n\nI urge you to support UBI legislation and lead on this critical issue.\n\nThank you for your service,\n[YOUR NAME]\n[CITY, STATE]\n[EMAIL]` },
  { title: 'Social Media Post', icon: '📱', script: `💡 What if every person on Earth received a monthly check — no strings attached?\n\nThat's Universal Basic Income. And it works.\n\n✅ Finland: Recipients found MORE work, reported better mental health\n✅ Stockton, CA: Full-time employment DOUBLED among recipients\n✅ Kenya: Crime fell, kids stayed in school, food security improved\n✅ Alaska: Lowest income inequality in the US — for 40 years\n\nUBI isn't a handout. It's a foundation.\n\nLearn more and calculate your impact: https://andrewhartman1998-cell.github.io/healthbridge-universal/ubi/\n\n#UBI #UniversalBasicIncome #FreedomDividend #AndrewYang #TechForGood` },
  { title: 'Letter to the Editor', icon: '📰', script: `To the Editor:\n\nAs communities across our country face rising automation, housing costs, and economic anxiety, I urge your readers to consider a powerful, evidence-backed solution: Universal Basic Income.\n\nUBI — a regular, unconditional cash payment to every citizen — is not utopian. It is already working. Finland's two-year experiment showed improved employment and mental health. Stockton, California's pilot doubled full-time employment rates. Alaska has paid residents an annual dividend since 1982, and the state consistently has the lowest income inequality in the nation.\n\nAndrew Yang's Freedom Dividend — $1,000/month to every American adult — would cost less than current military spending increases while lifting millions out of poverty, supporting caregivers, and preparing our workforce for an automated future.\n\nThe evidence is in. The time to act is now.\n\n[YOUR NAME]\n[CITY, STATE]` },
]

const ORGS = [
  { name: 'Basic Income Earth Network (BIEN)', url: 'bien.info', desc: 'The global UBI advocacy and research network. Annual congress. Academic publications.' },
  { name: 'Economic Security Project', url: 'economicsecurityproject.org', desc: 'US-focused UBI advocacy. Funded the Stockton SEED experiment.' },
  { name: 'GiveDirectly', url: 'givedirectly.org', desc: 'Direct cash transfers in Kenya, Rwanda, and elsewhere. Donate to fund real UBI for families in need.' },
  { name: 'Andrew Yang\'s Forward Party', url: 'forwardparty.com', desc: 'Yang\'s political movement continuing the UBI conversation in American politics.' },
  { name: 'Stanford Basic Income Lab', url: 'basicincome.stanford.edu', desc: 'Academic research hub for UBI policy design and evaluation.' },
  { name: 'Humanity Forward', url: 'movehumanityforward.com', desc: 'Yang\'s nonprofit advancing UBI research and direct cash assistance.' },
]

export default function Advocate() {
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(null)

  const copy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">📣 Take Action for UBI</h1>
        <p className="text-gray-400">Scripts, templates, and organizations to help you advocate for Universal Basic Income in your country.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {SCRIPTS.map((s, i) => (
          <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-5 hover:border-purple-600 transition-all cursor-pointer" onClick={() => setSelected(selected?.title === s.title ? null : s)}>
            <div className="text-3xl mb-2">{s.icon}</div>
            <h2 className="font-black text-white mb-1">{s.title}</h2>
            <p className="text-gray-400 text-sm line-clamp-2">{s.script.slice(0, 100)}...</p>
            <button className="mt-3 text-purple-400 text-sm font-semibold hover:underline">View script →</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="bg-gray-900 rounded-2xl border border-purple-600 p-6 mb-10">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-black text-white text-lg">{selected.icon} {selected.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => copy(selected.script, selected.title)}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-bold transition-all ${copied === selected.title ? 'bg-green-700 text-white' : 'bg-purple-700 text-white hover:bg-purple-600'}`}>
                {copied === selected.title ? <><CheckCircle size={14} /> Copied!</> : <><Share2 size={14} /> Copy</>}
              </button>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl font-bold px-2">×</button>
            </div>
          </div>
          <pre className="bg-gray-800 rounded-xl p-4 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{selected.script}</pre>
        </div>
      )}

      <h2 className="text-2xl font-black text-white mb-4">🌐 Organizations to Support</h2>
      <div className="grid gap-3">
        {ORGS.map((o, i) => (
          <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-white">{o.name}</h3>
              <p className="text-gray-400 text-sm mt-0.5">{o.desc}</p>
            </div>
            <a href={`https://${o.url}`} target="_blank" rel="noopener noreferrer"
              className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all">
              Visit →
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gradient-to-br from-purple-900/60 to-blue-900/60 rounded-2xl border border-purple-600 p-6 text-center">
        <div className="text-4xl mb-3">🗳️</div>
        <h2 className="text-xl font-black text-white mb-2">Your voice matters.</h2>
        <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto">
          UBI went from a fringe academic concept to national political conversation in one presidential campaign. Every conversation, every call, every social media post moves the needle. The question is not whether UBI will happen — it's when.
        </p>
      </div>
    </div>
  )
}
