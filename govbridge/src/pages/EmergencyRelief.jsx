import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const emergencies = [
  { id: 'homeless', label: 'I have no stable housing', icon: '🏠', color: 'from-orange-600 to-red-700',
    resources: [
      { name: '211 Helpline (US)', desc: 'Free 24/7 hotline for housing, food, and crisis support', contact: 'Call or text 211', url: 'https://www.211.org' },
      { name: 'HUD Homeless Assistance', desc: 'Emergency shelter and housing programs', contact: 'hud.gov/homelessness', url: 'https://www.hud.gov/topics/homelessness' },
      { name: 'Shelter Finder', desc: 'Find emergency shelters near you', contact: 'shelterlistings.org', url: 'https://www.shelterlistings.org' },
    ]},
  { id: 'food', label: 'I need food assistance right now', icon: '🍽️', color: 'from-yellow-600 to-orange-700',
    resources: [
      { name: 'Feeding America', desc: 'Food bank network — find food near you today', contact: 'feedingamerica.org', url: 'https://www.feedingamerica.org/find-your-local-foodbank' },
      { name: 'SNAP Emergency Application', desc: 'Apply for emergency food stamps', contact: 'fns.usda.gov/snap', url: 'https://www.fns.usda.gov/snap/how-to-apply' },
      { name: 'World Food Programme', desc: 'International emergency food relief', contact: 'wfp.org', url: 'https://www.wfp.org' },
    ]},
  { id: 'disaster', label: 'I\'ve been affected by a disaster', icon: '🌪️', color: 'from-blue-600 to-indigo-700',
    resources: [
      { name: 'FEMA Disaster Assistance (US)', desc: 'Apply for disaster relief funds after declared disasters', contact: 'disasterassistance.gov', url: 'https://www.disasterassistance.gov' },
      { name: 'Red Cross', desc: 'Immediate disaster relief, shelter, and support worldwide', contact: '1-800-RED-CROSS', url: 'https://www.redcross.org' },
      { name: 'UNHCR Emergency Relief', desc: 'UN refugee and disaster relief internationally', contact: 'unhcr.org', url: 'https://www.unhcr.org/emergencies' },
    ]},
  { id: 'domestic', label: 'I am experiencing domestic violence', icon: '🛡️', color: 'from-purple-600 to-violet-700',
    resources: [
      { name: 'National DV Hotline (US)', desc: '24/7 confidential support and safety planning', contact: '1-800-799-7233 or text START to 88788', url: 'https://www.thehotline.org' },
      { name: 'VAWA Housing Assistance', desc: 'Emergency housing protection for DV survivors', contact: 'justice.gov/ovw', url: 'https://www.justice.gov/ovw/housing' },
      { name: 'UN Women Safe Spaces', desc: 'International support for women in crisis', contact: 'unwomen.org', url: 'https://www.unwomen.org/en/what-we-do/ending-violence-against-women' },
    ]},
  { id: 'refugee', label: 'I am a refugee or asylum seeker', icon: '🌍', color: 'from-teal-600 to-cyan-700',
    resources: [
      { name: 'UNHCR Refugee Portal', desc: 'Register for refugee status and access protection', contact: 'unhcr.org/register', url: 'https://www.unhcr.org/refugee-statistics' },
      { name: 'IRC (International Rescue Committee)', desc: 'Resettlement, legal aid, and immediate assistance', contact: 'rescue.org', url: 'https://www.rescue.org' },
      { name: 'USCIS Asylum (US)', desc: 'Apply for asylum protection in the United States', contact: 'uscis.gov/asylum', url: 'https://www.uscis.gov/humanitarian/refugees-and-asylum/asylum' },
    ]},
  { id: 'mental', label: 'I am in a mental health crisis', icon: '💙', color: 'from-sky-600 to-blue-700',
    resources: [
      { name: '988 Suicide & Crisis Lifeline (US)', desc: '24/7 free crisis support — call or text', contact: 'Call or text 988', url: 'https://988lifeline.org' },
      { name: 'Crisis Text Line', desc: 'Text-based crisis support, available 24/7', contact: 'Text HOME to 741741', url: 'https://www.crisistextline.org' },
      { name: 'WHO Mental Health Resources', desc: 'International mental health crisis support', contact: 'who.int/mental_health', url: 'https://www.who.int/health-topics/mental-health' },
    ]},
];

export default function EmergencyRelief() {
  const { lang, setLang, languages } = useLang();
  const nav = useNavigate();
  const [selected, setSelected] = useState(null);

  const em = emergencies.find(e => e.id === selected);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => nav('/')} className="text-slate-400 hover:text-white">← Back</button>
            <h1 className="text-2xl font-black text-red-300">🆘 Emergency Relief</h1>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        <div className="bg-red-900/20 border border-red-700 rounded-2xl p-5 mb-8">
          <p className="text-red-300 font-bold text-sm">⚠️ If you are in immediate danger, call your local emergency number (911 in the US, 999 in the UK, 112 in the EU) immediately.</p>
        </div>

        <h2 className="text-lg font-black text-white mb-6">What kind of help do you need right now?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {emergencies.map(e => (
            <button key={e.id} onClick={() => setSelected(e.id === selected ? null : e.id)}
              className={`bg-gradient-to-br ${e.color} rounded-2xl p-5 text-left font-bold text-lg hover:scale-102 transition-all shadow-lg border-2 ${selected === e.id ? 'border-white' : 'border-transparent'}`}>
              <span className="text-3xl mr-3">{e.icon}</span>{e.label}
            </button>
          ))}
        </div>

        {em && (
          <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
            <h3 className="font-black text-xl text-white mb-6">{em.icon} Immediate Resources</h3>
            <div className="space-y-4">
              {em.resources.map(r => (
                <div key={r.name} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="font-black text-white mb-1">{r.name}</h4>
                      <p className="text-slate-400 text-sm mb-2">{r.desc}</p>
                      <p className="text-yellow-400 font-bold text-sm">📞 {r.contact}</p>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all">
                      Get Help →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
