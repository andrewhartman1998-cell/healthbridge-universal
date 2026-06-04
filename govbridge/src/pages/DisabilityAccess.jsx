import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const disabilityPrograms = [
  { country: 'United States', programs: [
    { name: 'SSDI', full: 'Social Security Disability Insurance', amount: 'Up to $3,627/mo', who: 'Workers with disabilities who paid into SS', url: 'https://www.ssa.gov/disability/', step1: 'Apply online at SSA.gov or call 1-800-772-1213', step2: 'Provide medical evidence and work history', step3: 'Average processing: 3–6 months' },
    { name: 'SSI', full: 'Supplemental Security Income', amount: 'Up to $943/mo', who: 'Low income disabled, blind, or 65+', url: 'https://www.ssa.gov/ssi/', step1: 'Apply at local SSA office or online', step2: 'Provide income, resource, and medical info', step3: 'Decision typically within 3–5 months' },
    { name: 'VA Disability', full: 'Veterans Affairs Disability Compensation', amount: 'Up to $3,621/mo', who: 'Veterans with service-connected conditions', url: 'https://www.va.gov/disability/', step1: 'File a claim at VA.gov or in person', step2: 'Submit medical records and service history', step3: 'VA rates disability from 0–100%' },
  ]},
  { country: 'United Kingdom', programs: [
    { name: 'PIP', full: 'Personal Independence Payment', amount: 'Up to £172.75/wk', who: 'Age 16–64 with daily living/mobility difficulties', url: 'https://www.gov.uk/pip', step1: 'Call 0800 917 2222 to start your claim', step2: 'Complete "How your disability affects you" form', step3: 'Face-to-face or phone assessment follows' },
    { name: 'DLA', full: 'Disability Living Allowance (children)', amount: 'Up to £108.55/wk', who: 'Disabled children under 16', url: 'https://www.gov.uk/disability-living-allowance-children', step1: 'Apply online or by post via GOV.UK', step2: 'Provide medical and care needs evidence', step3: 'Decision within 40 working days' },
  ]},
  { country: 'Canada', programs: [
    { name: 'CPP-D', full: 'Canada Pension Plan Disability', amount: 'Up to $1,606.78/mo', who: 'Workers with severe & prolonged disability', url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-disability-benefit.html', step1: 'Apply online through My Service Canada Account', step2: 'Medical practitioner completes health report', step3: 'Processing: 4+ months' },
    { name: 'CDB', full: 'Canada Disability Benefit', amount: 'Up to $2,400/yr', who: 'Working-age Canadians with DTC certification', url: 'https://www.canada.ca/en/employment-social-development/programs/canada-disability-benefit.html', step1: 'Obtain Disability Tax Credit (DTC) certification', step2: 'Apply through CRA My Account', step3: 'Payments begin within 90 days' },
  ]},
  { country: 'Australia', programs: [
    { name: 'DSP', full: 'Disability Support Pension', amount: 'Up to $1,116.30/fortnight', who: 'Permanent disability preventing work', url: 'https://www.servicesaustralia.gov.au/disability-support-pension', step1: 'Create myGov account and link Centrelink', step2: 'Complete online claim with medical evidence', step3: 'Job capacity assessment may be required' },
    { name: 'NDIS', full: 'National Disability Insurance Scheme', amount: 'Individualized funding plan', who: 'Under 65 with permanent significant disability', url: 'https://www.ndis.gov.au', step1: 'Check eligibility at NDIS.gov.au', step2: 'Submit access request with supporting evidence', step3: 'Planning meeting to determine funded supports' },
  ]},
];

export default function DisabilityAccess() {
  const { lang, setLang, languages } = useLang();
  const nav = useNavigate();
  const [selected, setSelected] = useState('United States');
  const [expanded, setExpanded] = useState(null);

  const country = disabilityPrograms.find(c => c.country === selected);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => nav('/')} className="text-slate-400 hover:text-white">← Back</button>
            <h1 className="text-2xl font-black text-violet-300">♿ Disability Access Center</h1>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        <div className="bg-violet-900/20 border border-violet-700 rounded-2xl p-6 mb-8">
          <h2 className="font-black text-xl text-violet-300 mb-2">♿ Disability Benefits Worldwide</h2>
          <p className="text-slate-400 text-sm leading-relaxed">If you have a disability, long-term health condition, or are caring for someone who does — you may be entitled to significant financial support. Use this guide to find the right program for your situation, understand the eligibility requirements, and get step-by-step application guidance.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {disabilityPrograms.map(c => (
            <button key={c.country} onClick={() => { setSelected(c.country); setExpanded(null); }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selected === c.country ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {c.country}
            </button>
          ))}
        </div>

        {country && (
          <div className="space-y-4">
            {country.programs.map(p => (
              <div key={p.name} className={`border rounded-2xl overflow-hidden transition-all ${expanded === p.name ? 'border-violet-500' : 'border-slate-700 hover:border-slate-500'}`}>
                <button className="w-full text-left p-6 bg-slate-900/60" onClick={() => setExpanded(expanded === p.name ? null : p.name)}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-black text-xl text-white">{p.name}</h3>
                        <span className="text-sm text-slate-400">{p.full}</span>
                      </div>
                      <p className="text-green-400 font-bold text-lg">{p.amount}</p>
                      <p className="text-slate-400 text-sm mt-1">{p.who}</p>
                    </div>
                    <span className="text-slate-400 text-xl">{expanded === p.name ? '▲' : '▼'}</span>
                  </div>
                </button>

                {expanded === p.name && (
                  <div className="px-6 pb-6 bg-slate-900/30 border-t border-slate-800">
                    <h4 className="font-bold text-violet-300 mt-4 mb-3 text-sm uppercase tracking-widest">How to Apply — Step by Step</h4>
                    <div className="space-y-3 mb-6">
                      {[p.step1, p.step2, p.step3].map((step, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-sm font-black flex-shrink-0">{i + 1}</div>
                          <p className="text-slate-300 text-sm pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-black px-8 py-3 rounded-xl transition-all">
                      Apply for {p.name} →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
