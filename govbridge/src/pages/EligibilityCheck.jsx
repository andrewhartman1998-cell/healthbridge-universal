import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const questions = [
  { id: 'country', label: 'What country do you live in?', type: 'select', options: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Other'] },
  { id: 'age', label: 'How old are you?', type: 'select', options: ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'] },
  { id: 'status', label: 'What is your current employment status?', type: 'select', options: ['Employed full-time', 'Employed part-time', 'Unemployed (laid off)', 'Self-employed', 'Unable to work / Disabled', 'Student', 'Retired', 'Caregiver'] },
  { id: 'income', label: 'What is your approximate annual household income?', type: 'select', options: ['Under $15,000', '$15,000–$30,000', '$30,000–$50,000', '$50,000–$75,000', 'Over $75,000', 'Prefer not to say'] },
  { id: 'disability', label: 'Do you have a disability or long-term health condition?', type: 'select', options: ['Yes — physical disability', 'Yes — mental health condition', 'Yes — multiple conditions', 'No'] },
  { id: 'housing', label: 'What is your current housing situation?', type: 'select', options: ['Own my home', 'Renting', 'Living with family/friends', 'Unhoused / no stable housing', 'Temporary shelter'] },
  { id: 'children', label: 'Do you have children under 18?', type: 'select', options: ['No', 'Yes — 1 child', 'Yes — 2 children', 'Yes — 3 or more children'] },
  { id: 'veteran', label: 'Are you a military veteran?', type: 'select', options: ['Yes', 'No'] },
];

function getMatches(answers) {
  const matches = [];
  const { country, age, status, income, disability, housing, children, veteran } = answers;
  const isUS = country === 'United States';
  const isUK = country === 'United Kingdom';
  const isCA = country === 'Canada';
  const lowIncome = ['Under $15,000', '$15,000–$30,000', '$30,000–$50,000'].includes(income);
  const hasDisability = disability && disability.startsWith('Yes');
  const isSenior = age === '65+';
  const isUnemployed = status === 'Unemployed (laid off)';
  const isStudent = status === 'Student';
  const hasKids = children && children !== 'No';
  const isVet = veteran === 'Yes';

  if (isUS) {
    if (hasDisability) { matches.push({ name: 'SSDI / SSI', desc: 'Social Security disability benefits', amount: 'Up to $3,627/mo', priority: 'HIGH', url: 'https://www.ssa.gov/disability/', icon: '♿' }); }
    if (lowIncome) { matches.push({ name: 'Medicaid', desc: 'Free or low-cost health coverage', amount: 'Full coverage', priority: 'HIGH', url: 'https://www.medicaid.gov', icon: '🏥' }); }
    if (lowIncome) { matches.push({ name: 'SNAP', desc: 'Monthly food assistance', amount: 'Up to $291/mo', priority: 'HIGH', url: 'https://www.fns.usda.gov/snap', icon: '🍽️' }); }
    if (isUnemployed) { matches.push({ name: 'Unemployment Insurance', desc: 'Wage replacement while job searching', amount: 'Up to 60% of wages', priority: 'HIGH', url: 'https://www.dol.gov/general/topic/unemployment-insurance', icon: '💼' }); }
    if (lowIncome && housing !== 'Own my home') { matches.push({ name: 'Section 8 Housing Voucher', desc: 'Rental assistance', amount: 'Subsidy varies', priority: 'MEDIUM', url: 'https://www.hud.gov/topics/housing_choice_voucher_program_section_8', icon: '🏠' }); }
    if (isSenior) { matches.push({ name: 'Social Security Retirement', desc: 'Monthly retirement income', amount: 'Avg $1,907/mo', priority: 'HIGH', url: 'https://www.ssa.gov/retirement/', icon: '👴' }); }
    if (isSenior) { matches.push({ name: 'Medicare', desc: 'Health insurance for seniors', amount: 'Health coverage', priority: 'HIGH', url: 'https://www.medicare.gov', icon: '🏥' }); }
    if (hasKids && lowIncome) { matches.push({ name: 'TANF', desc: 'Cash assistance for families', amount: 'Varies by state', priority: 'MEDIUM', url: 'https://www.acf.hhs.gov/ofa/programs/tanf', icon: '👶' }); }
    if (hasKids) { matches.push({ name: 'Child Tax Credit', desc: 'Up to $2,000 per child tax reduction', amount: 'Up to $2,000/child', priority: 'MEDIUM', url: 'https://www.irs.gov/credits-deductions/individuals/child-tax-credit', icon: '👶' }); }
    if (isStudent && lowIncome) { matches.push({ name: 'Pell Grant', desc: 'Federal college grant — no repayment needed', amount: 'Up to $7,395/yr', priority: 'HIGH', url: 'https://studentaid.gov/understand-aid/types/grants/pell', icon: '🎓' }); }
    if (isVet) { matches.push({ name: 'VA Disability Benefits', desc: 'Compensation for service-connected conditions', amount: 'Up to $3,621/mo', priority: 'HIGH', url: 'https://www.va.gov/disability/', icon: '🎖️' }); }
    if (housing === 'Unhoused / no stable housing' || housing === 'Temporary shelter') { matches.push({ name: 'HUD Emergency Housing', desc: 'Emergency housing and shelter assistance', amount: 'Emergency support', priority: 'URGENT', url: 'https://www.hud.gov/topics/homelessness', icon: '🏠' }); }
  }
  if (isUK) {
    if (hasDisability) { matches.push({ name: 'PIP (Personal Independence Payment)', desc: 'Support for long-term health conditions', amount: 'Up to £172.75/wk', priority: 'HIGH', url: 'https://www.gov.uk/pip', icon: '♿' }); }
    if (lowIncome || isUnemployed) { matches.push({ name: 'Universal Credit', desc: 'Monthly support for low income or unemployed', amount: 'Varies', priority: 'HIGH', url: 'https://www.gov.uk/universal-credit', icon: '💷' }); }
    if (isSenior) { matches.push({ name: 'State Pension', desc: 'Weekly retirement income', amount: 'Up to £221.20/wk', priority: 'HIGH', url: 'https://www.gov.uk/new-state-pension', icon: '👴' }); }
  }
  if (isCA) {
    if (hasDisability) { matches.push({ name: 'Canada Disability Benefit', desc: 'Annual financial support for Canadians with disabilities', amount: 'Up to $2,400/yr', priority: 'HIGH', url: 'https://www.canada.ca/en/employment-social-development/programs/canada-disability-benefit.html', icon: '♿' }); }
    if (isUnemployed) { matches.push({ name: 'Employment Insurance (EI)', desc: 'Temporary income while seeking work', amount: '55% of earnings', priority: 'HIGH', url: 'https://www.canada.ca/en/services/benefits/ei.html', icon: '💼' }); }
    if (hasKids) { matches.push({ name: 'Canada Child Benefit (CCB)', desc: 'Monthly tax-free payments for children', amount: 'Up to $7,437/yr/child', priority: 'HIGH', url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html', icon: '👶' }); }
    if (isSenior) { matches.push({ name: 'Old Age Security (OAS)', desc: 'Monthly pension for seniors 65+', amount: 'Up to $713.34/mo', priority: 'HIGH', url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html', icon: '👴' }); }
  }
  if (matches.length === 0) {
    matches.push({ name: 'Benefits Finder', desc: 'Search our full database for programs in your country', amount: 'Varies', priority: 'INFO', url: '/finder', icon: '🔍' });
  }
  return matches;
}

const priorityColors = { URGENT: 'border-red-500 bg-red-900/20', HIGH: 'border-green-500 bg-green-900/10', MEDIUM: 'border-blue-500 bg-blue-900/10', INFO: 'border-slate-500 bg-slate-900/10' };
const priorityBadge = { URGENT: 'bg-red-900 text-red-300', HIGH: 'bg-green-900 text-green-300', MEDIUM: 'bg-blue-900 text-blue-300', INFO: 'bg-slate-800 text-slate-300' };

export default function EligibilityCheck() {
  const { lang, setLang, languages } = useLang();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  function answer(val) {
    const q = questions[step];
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResults(getMatches(newAnswers));
    }
  }

  const q = questions[step];
  const progress = ((step) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => nav('/')} className="text-slate-400 hover:text-white">← Back</button>
            <h1 className="text-2xl font-black text-green-300">📋 Eligibility Check</h1>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {!results ? (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="bg-slate-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-8">{q.label}</h2>
              <div className="space-y-3">
                {q.options.map(opt => (
                  <button key={opt} onClick={() => answer(opt)}
                    className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 rounded-xl px-5 py-4 font-bold text-white transition-all">
                    {opt}
                  </button>
                ))}
              </div>
              {step > 0 && <button onClick={() => setStep(s => s - 1)} className="mt-6 text-slate-500 hover:text-white text-sm">← Previous question</button>}
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-green-900/20 border border-green-700 rounded-2xl p-6 mb-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-black text-green-300">You may qualify for {results.length} program{results.length !== 1 ? 's' : ''}!</h2>
              <p className="text-slate-400 mt-2 text-sm">Based on your answers for {answers.country}. Always verify eligibility directly with the program.</p>
            </div>

            <div className="space-y-4 mb-8">
              {results.map(r => (
                <div key={r.name} className={`border rounded-2xl p-5 ${priorityColors[r.priority]}`}>
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{r.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-black text-white">{r.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${priorityBadge[r.priority]}`}>{r.priority}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{r.desc}</p>
                        <p className="text-green-400 font-bold text-sm mt-1">{r.amount}</p>
                      </div>
                    </div>
                    <a href={r.url.startsWith('http') ? r.url : undefined}
                      onClick={!r.url.startsWith('http') ? () => nav(r.url) : undefined}
                      target={r.url.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all cursor-pointer">
                      Apply Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => { setStep(0); setAnswers({}); setResults(null); }}
              className="w-full border border-slate-600 hover:border-slate-400 text-slate-300 font-bold py-3 rounded-xl transition-all">
              🔄 Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
