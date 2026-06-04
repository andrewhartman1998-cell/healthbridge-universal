import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Brazil', 'India', 'South Africa', 'Mexico', 'Japan', 'South Korea', 'Sweden', 'Norway', 'Denmark', 'Netherlands', 'Spain', 'Italy', 'Poland', 'Ukraine', 'Nigeria', 'Kenya', 'Ethiopia', 'Egypt', 'Saudi Arabia', 'Indonesia', 'Philippines', 'Vietnam', 'Thailand', 'Pakistan', 'Bangladesh', 'Argentina', 'Colombia', 'Chile', 'Peru', 'New Zealand', 'Ireland', 'Portugal', 'Greece', 'Czech Republic'];

const PROGRAMS = {
  'United States': [
    { name: 'Social Security Disability (SSDI)', category: 'Disability', agency: 'SSA', amount: 'Up to $3,627/mo', eligibility: 'Work history + medical disability', url: 'https://www.ssa.gov/disability/', icon: '♿' },
    { name: 'Supplemental Security Income (SSI)', category: 'Disability', agency: 'SSA', amount: 'Up to $943/mo', eligibility: 'Low income, disabled, blind, or 65+', url: 'https://www.ssa.gov/ssi/', icon: '♿' },
    { name: 'Medicaid', category: 'Healthcare', agency: 'CMS', amount: 'Full health coverage', eligibility: 'Low income households', url: 'https://www.medicaid.gov', icon: '🏥' },
    { name: 'Medicare', category: 'Healthcare', agency: 'CMS', amount: 'Health insurance', eligibility: 'Age 65+ or disabled', url: 'https://www.medicare.gov', icon: '🏥' },
    { name: 'SNAP (Food Stamps)', category: 'Food', agency: 'USDA', amount: 'Up to $291/mo', eligibility: 'Low income households', url: 'https://www.fns.usda.gov/snap', icon: '🍽️' },
    { name: 'Section 8 Housing Voucher', category: 'Housing', agency: 'HUD', amount: 'Rental subsidy', eligibility: 'Low income families', url: 'https://www.hud.gov/topics/housing_choice_voucher_program_section_8', icon: '🏠' },
    { name: 'Unemployment Insurance (UI)', category: 'Unemployment', agency: 'DOL', amount: 'Up to 60% of wages', eligibility: 'Recently laid off workers', url: 'https://www.dol.gov/general/topic/unemployment-insurance', icon: '💼' },
    { name: 'Veterans Benefits (VA)', category: 'Veterans', agency: 'VA', amount: 'Various', eligibility: 'US military veterans', url: 'https://www.va.gov/disability/', icon: '🎖️' },
    { name: 'TANF (Cash Assistance)', category: 'Family', agency: 'HHS', amount: 'Varies by state', eligibility: 'Low income families with children', url: 'https://www.acf.hhs.gov/ofa/programs/tanf', icon: '👶' },
    { name: 'Pell Grant', category: 'Education', agency: 'Dept of Education', amount: 'Up to $7,395/yr', eligibility: 'Low income college students', url: 'https://studentaid.gov/understand-aid/types/grants/pell', icon: '🎓' },
    { name: 'WIC (Women, Infants, Children)', category: 'Food', agency: 'USDA', amount: 'Food & nutrition support', eligibility: 'Pregnant women, infants, children under 5', url: 'https://www.fns.usda.gov/wic', icon: '🍼' },
    { name: 'Social Security Retirement', category: 'Senior', agency: 'SSA', amount: 'Avg $1,907/mo', eligibility: 'Age 62+ with work history', url: 'https://www.ssa.gov/retirement/', icon: '👴' },
  ],
  'United Kingdom': [
    { name: 'Personal Independence Payment (PIP)', category: 'Disability', agency: 'DWP', amount: 'Up to £172.75/wk', eligibility: 'Long-term health condition or disability', url: 'https://www.gov.uk/pip', icon: '♿' },
    { name: 'Universal Credit', category: 'Multiple', agency: 'DWP', amount: 'Varies', eligibility: 'Low income or out of work', url: 'https://www.gov.uk/universal-credit', icon: '💷' },
    { name: 'NHS (National Health Service)', category: 'Healthcare', agency: 'NHS', amount: 'Free healthcare', eligibility: 'All UK residents', url: 'https://www.nhs.uk', icon: '🏥' },
    { name: 'Housing Benefit', category: 'Housing', agency: 'Local Council', amount: 'Rental support', eligibility: 'Low income renters', url: 'https://www.gov.uk/housing-benefit', icon: '🏠' },
    { name: 'Jobseeker\'s Allowance', category: 'Unemployment', agency: 'DWP', amount: 'Up to £84.80/wk', eligibility: 'Unemployed, seeking work', url: 'https://www.gov.uk/jobseekers-allowance', icon: '💼' },
    { name: 'State Pension', category: 'Senior', agency: 'DWP', amount: 'Up to £221.20/wk', eligibility: 'State pension age with NI contributions', url: 'https://www.gov.uk/new-state-pension', icon: '👴' },
  ],
  'Canada': [
    { name: 'Canada Disability Benefit', category: 'Disability', agency: 'ESDC', amount: 'Up to $2,400/yr', eligibility: 'Working-age Canadians with disabilities', url: 'https://www.canada.ca/en/employment-social-development/programs/canada-disability-benefit.html', icon: '♿' },
    { name: 'Employment Insurance (EI)', category: 'Unemployment', agency: 'ESDC', amount: '55% of earnings', eligibility: 'Recently unemployed workers', url: 'https://www.canada.ca/en/services/benefits/ei.html', icon: '💼' },
    { name: 'Canada Child Benefit (CCB)', category: 'Family', agency: 'CRA', amount: 'Up to $7,437/yr per child', eligibility: 'Families with children under 18', url: 'https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview.html', icon: '👶' },
    { name: 'Old Age Security (OAS)', category: 'Senior', agency: 'ESDC', amount: 'Up to $713.34/mo', eligibility: 'Age 65+ residents', url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html', icon: '👴' },
    { name: 'Guaranteed Income Supplement (GIS)', category: 'Senior', agency: 'ESDC', amount: 'Up to $1,065.47/mo', eligibility: 'Low income OAS recipients', url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html', icon: '👴' },
  ],
};

const CATEGORIES = ['All', 'Disability', 'Healthcare', 'Housing', 'Food', 'Unemployment', 'Veterans', 'Family', 'Education', 'Senior', 'Multiple'];

export default function BenefitsFinder() {
  const { lang, setLang, languages } = useLang();
  const nav = useNavigate();
  const [country, setCountry] = useState('United States');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const programs = PROGRAMS[country] || [];
  const filtered = programs.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => nav('/')} className="text-slate-400 hover:text-white">← Back</button>
            <h1 className="text-2xl font-black text-blue-300">🔍 Benefits Finder</h1>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Search</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search programs..."
              className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-6">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found in <span className="text-white font-bold">{country}</span></p>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">No programs found for this selection.</p>
            <p className="text-sm mt-2">Try selecting a different country or category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(p => (
              <div key={p.name} className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 hover:border-blue-600 transition-all">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="text-2xl">{p.icon}</span>
                      <h3 className="font-black text-lg text-white">{p.name}</h3>
                      <span className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded-full font-bold">{p.category}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                      <div><p className="text-xs text-slate-500">Agency</p><p className="text-sm text-white font-bold">{p.agency}</p></div>
                      <div><p className="text-xs text-slate-500">Benefit Amount</p><p className="text-sm text-green-400 font-bold">{p.amount}</p></div>
                      <div><p className="text-xs text-slate-500">Eligibility</p><p className="text-sm text-slate-300">{p.eligibility}</p></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 rounded-xl transition-all text-center">
                      Apply Now →
                    </a>
                    <button onClick={() => nav('/eligibility')} className="border border-slate-600 hover:border-slate-400 text-slate-300 font-bold text-sm px-5 py-2 rounded-xl transition-all">
                      Check Eligibility
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
