import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const PROGRAMS = [
  { id: 'ssdi', name: 'SSDI', country: 'United States', category: 'Disability', docs: ['Medical records from your doctor', 'Work history (last 15 years)', 'Social Security card', 'Birth certificate', 'Recent tax returns (W-2s)'], steps: ['Create a my Social Security account at ssa.gov', 'Complete the online disability application (takes ~1 hour)', 'Upload or mail supporting medical documentation', 'Attend consultative exam if SSA requests it', 'Receive decision by mail (avg 3–6 months)', 'Appeal within 60 days if denied (most are approved on appeal)'], tips: ['Apply as soon as your disability begins — benefits have a 5-month waiting period', 'Keep detailed records of all medical visits', 'Consider hiring a disability attorney (they only get paid if you win)', 'Do not stop seeing doctors while your claim is pending'], url: 'https://www.ssa.gov/applyfordisability/' },
  { id: 'ssi', name: 'SSI', country: 'United States', category: 'Disability', docs: ['Social Security card', 'Birth certificate or proof of age', 'Proof of residence', 'Bank account statements', 'Medical records'], steps: ['Call SSA at 1-800-772-1213 or visit your local office', 'Complete application with income and resource information', 'Provide medical evidence of disability', 'SSA reviews your finances and medical condition', 'Decision within 3–5 months'], tips: ['SSI has strict asset limits ($2,000 individual / $3,000 couple)', 'Report any income changes immediately to SSA', 'Many states add a supplement on top of federal SSI'], url: 'https://www.ssa.gov/ssi/' },
  { id: 'snap', name: 'SNAP (Food Stamps)', country: 'United States', category: 'Food', docs: ['Photo ID', 'Proof of address', 'Proof of income (pay stubs, benefit letters)', 'Social Security numbers for all household members', 'Bank statements'], steps: ['Apply online at your state\'s SNAP portal or in person', 'Complete the application with household and income details', 'Attend an interview (phone or in-person)', 'Receive EBT card within 30 days (expedited if urgent need)', 'Recertify every 6–12 months'], tips: ['You may qualify for expedited benefits within 7 days if income is very low', 'Apply even if you think you earn too much — limits are higher than many expect', 'SNAP benefits do not count as income for other programs'], url: 'https://www.fns.usda.gov/snap/how-to-apply' },
  { id: 'pip', name: 'PIP', country: 'United Kingdom', category: 'Disability', docs: ['National Insurance number', 'Medical evidence from GP or specialist', 'Details of how your condition affects daily life', 'Bank account details'], steps: ['Call 0800 917 2222 to start your claim', 'DWP sends you "How your disability affects you" form (PIP2)', 'Complete and return form within 1 month', 'Attend a face-to-face or telephone assessment', 'Receive decision letter (can take 4+ months)', 'Appeal with tribunal if refused'], tips: ['Focus on your worst days when completing the form', 'Get help from Citizens Advice to fill out the form', 'You can ask for a Mandatory Reconsideration before appealing'], url: 'https://www.gov.uk/pip/how-to-claim' },
  { id: 'universal_credit', name: 'Universal Credit', country: 'United Kingdom', category: 'Multiple', docs: ['National Insurance number', 'Bank account details', 'Email address', 'Housing cost details', 'Income information'], steps: ['Create a Universal Credit online account at gov.uk', 'Complete the online application', 'Verify your identity online or at a Jobcentre', 'Attend an initial interview at your Jobcentre Plus', 'First payment arrives after 5-week wait', 'Manage your claim and journal online monthly'], tips: ['Apply immediately — the 5-week wait is non-negotiable (advance payment available)', 'Report all changes in circumstances within 14 days', 'Ask for an Advance Payment on day one if you need money urgently'], url: 'https://www.gov.uk/apply-universal-credit' },
  { id: 'ndis', name: 'NDIS', country: 'Australia', category: 'Disability', docs: ['Evidence of disability from treating professional', 'Identity documents (passport or birth certificate)', 'Medicare card', 'Specialist reports if available'], steps: ['Check eligibility at ndis.gov.au (under 65, permanent disability)', 'Submit an Access Request Form online or by phone (1800 800 110)', 'NDIS reviews your access request', 'If approved, a Local Area Coordinator contacts you', 'Attend a planning meeting to develop your NDIS Plan', 'Implement your plan using approved providers'], tips: ['Gather strong medical evidence before applying', 'Bring a support person to your planning meeting', 'You can request a plan review if your needs change', 'Plans are usually funded annually'], url: 'https://www.ndis.gov.au/applying-access-ndis/how-apply' },
];

export default function ApplyWizard() {
  const { lang, setLang, languages } = useLang();
  const nav = useNavigate();
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('steps');

  const prog = PROGRAMS.find(p => p.id === selected);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => nav('/')} className="text-slate-400 hover:text-white">← Back</button>
            <h1 className="text-2xl font-black text-emerald-300">📝 Application Assistant</h1>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        <p className="text-slate-400 mb-8">Choose a benefit program below to get a complete step-by-step application guide with required documents and insider tips.</p>

        {/* Program selector */}
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {PROGRAMS.map(p => (
            <button key={p.id} onClick={() => { setSelected(p.id); setActiveTab('steps'); }}
              className={`text-left p-4 rounded-2xl border transition-all ${selected === p.id ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-700 bg-slate-900/40 hover:border-slate-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-white">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.country} · {p.category}</p>
                </div>
                <span className="text-slate-500 text-lg">{selected === p.id ? '✓' : '→'}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Guide */}
        {prog && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-2xl font-black text-white">{prog.name} — Application Guide</h2>
              <p className="text-slate-400 text-sm mt-1">{prog.country} · {prog.category}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              {[['steps', '📋 Steps'], ['docs', '📄 Documents'], ['tips', '💡 Tips']].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold text-sm transition-all ${activeTab === tab ? 'text-emerald-300 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'steps' && (
                <div className="space-y-4">
                  {prog.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-black flex-shrink-0">{i + 1}</div>
                      <p className="text-slate-300 pt-1 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'docs' && (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm mb-4">Gather these documents before you start your application:</p>
                  {prog.docs.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-800/60 rounded-xl px-4 py-3">
                      <span className="text-emerald-400 font-black">☐</span>
                      <p className="text-slate-300 text-sm">{doc}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'tips' && (
                <div className="space-y-3">
                  {prog.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-900/10 border border-amber-800/40 rounded-xl px-4 py-3">
                      <span className="text-amber-400">💡</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              <a href={prog.url} target="_blank" rel="noopener noreferrer"
                className="mt-8 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl transition-all">
                Start {prog.name} Application →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
