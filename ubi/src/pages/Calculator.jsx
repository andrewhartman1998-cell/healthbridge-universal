import React, { useState } from 'react'
import { DollarSign, TrendingUp, Home, Heart, BookOpen, Zap } from 'lucide-react'

const COUNTRY_DATA = {
  'United States': { currency: 'USD', symbol: '$', monthly: 1000, annual: 12000, funded_by: 'Value-Added Tax (VAT) + consolidating existing welfare programs', population: '258M adults', cost: '$2.8 trillion/year', source: 'Andrew Yang Freedom Dividend proposal' },
  'United Kingdom': { currency: 'GBP', symbol: '£', monthly: 800, annual: 9600, funded_by: 'Carbon Tax + Wealth Tax + consolidating benefits', population: '52M adults', cost: '£500 billion/year', source: 'RSA Basic Income proposal' },
  'Canada': { currency: 'CAD', symbol: 'CA$', monthly: 1100, annual: 13200, funded_by: 'Financial Transaction Tax + Carbon Tax', population: '30M adults', cost: 'CA$390 billion/year', source: 'Basic Income Canada Network' },
  'Germany': { currency: 'EUR', symbol: '€', monthly: 1200, annual: 14400, funded_by: 'VAT reform + wealth redistribution', population: '69M adults', cost: '€995 billion/year', source: 'Mein Grundeinkommen pilots' },
  'Finland': { currency: 'EUR', symbol: '€', monthly: 560, annual: 6720, funded_by: 'Progressive taxation', population: '4.4M adults', cost: '€29 billion/year', source: 'Finland 2017–2018 Basic Income Experiment' },
  'Kenya': { currency: 'USD', symbol: '$', monthly: 22, annual: 264, funded_by: 'International aid + GiveDirectly program', population: '29M adults', cost: '$7.6 billion/year', source: 'GiveDirectly long-term UBI study' },
  'India': { currency: 'INR', symbol: '₹', monthly: 2000, annual: 24000, funded_by: 'Consolidating existing subsidies', population: '900M adults', cost: '₹21.6 trillion/year', source: 'India Policy Forum UBI proposal' },
  'Brazil': { currency: 'BRL', symbol: 'R$', monthly: 600, annual: 7200, funded_by: 'Progressive income tax reform', population: '150M adults', cost: 'R$1.1 trillion/year', source: 'Bolsa Família expansion model' },
}

const CATEGORIES = [
  { icon: Home, label: 'Housing', color: 'text-blue-400', tip: 'Never miss rent again. Build a security deposit. Move to a better neighborhood.' },
  { icon: Heart, label: 'Healthcare', color: 'text-red-400', tip: 'Afford prescriptions, dental, mental health therapy, and preventive care.' },
  { icon: BookOpen, label: 'Education', color: 'text-yellow-400', tip: 'Take a course, finish a degree, pay down student loans, save for your kids.' },
  { icon: Zap, label: 'Start a Business', color: 'text-purple-400', tip: 'UBI is the ultimate startup grant. Take the risk. Launch your dream.' },
  { icon: TrendingUp, label: 'Savings & Investment', color: 'text-green-400', tip: 'Emergency fund. Retirement account. First time in your life — a cushion.' },
  { icon: DollarSign, label: 'Pay Off Debt', color: 'text-orange-400', tip: 'Credit cards. Medical bills. Student loans. Get free, faster.' },
]

export default function Calculator() {
  const [income, setIncome] = useState(40000)
  const [household, setHousehold] = useState(1)
  const [country, setCountry] = useState('United States')
  const [adults, setAdults] = useState(1)

  const data = COUNTRY_DATA[country] || COUNTRY_DATA['United States']
  const monthlyUBI = data.monthly * adults
  const annualUBI = data.annual * adults
  const newIncome = income + annualUBI
  const pctIncrease = income > 0 ? Math.round((annualUBI / income) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">💰 UBI Impact Calculator</h1>
        <p className="text-gray-400">See exactly how Universal Basic Income would change your life — and the economics of your country.</p>
      </div>

      {/* Inputs */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="font-bold text-white mb-4">Your situation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your country</label>
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              {Object.keys(COUNTRY_DATA).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Adults in household</label>
            <input type="number" min="1" max="10" value={adults} onChange={e => setAdults(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">Your current annual income: <span className="text-white font-bold">{data.symbol}{income.toLocaleString()}</span></label>
            <input type="range" min="0" max="200000" step="1000" value={income} onChange={e => setIncome(Number(e.target.value))}
              className="w-full accent-purple-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>{data.symbol}0</span><span>{data.symbol}200,000+</span></div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-5 border border-purple-600 text-center">
          <div className="text-gray-300 text-sm mb-1">Monthly UBI Payment</div>
          <div className="text-4xl font-black text-white">{data.symbol}{monthlyUBI.toLocaleString()}</div>
          <div className="text-purple-300 text-xs mt-1">per month, per adult</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-5 border border-blue-600 text-center">
          <div className="text-gray-300 text-sm mb-1">Annual UBI</div>
          <div className="text-4xl font-black text-white">{data.symbol}{annualUBI.toLocaleString()}</div>
          <div className="text-blue-300 text-xs mt-1">per year for your household</div>
        </div>
        <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-2xl p-5 border border-teal-600 text-center">
          <div className="text-gray-300 text-sm mb-1">Income Increase</div>
          <div className="text-4xl font-black text-white">+{pctIncrease}%</div>
          <div className="text-teal-300 text-xs mt-1">your income goes from {data.symbol}{income.toLocaleString()} → {data.symbol}{newIncome.toLocaleString()}</div>
        </div>
      </div>

      {/* Spend it on */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
        <h2 className="font-bold text-white mb-4">What would you do with {data.symbol}{monthlyUBI.toLocaleString()}/month?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((c, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-purple-600 transition-all cursor-default">
              <c.icon size={22} className={`${c.color} mb-2`} />
              <div className="font-bold text-white text-sm mb-1">{c.label}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{c.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Country policy box */}
      <div className="bg-gray-900 rounded-2xl border border-purple-700 p-6">
        <h2 className="font-bold text-white mb-4">📊 {country} — UBI Policy Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            ['Monthly payment', `${data.symbol}${data.monthly.toLocaleString()}/adult`],
            ['Eligible population', data.population],
            ['Estimated total cost', data.cost],
            ['How to fund it', data.funded_by],
            ['Proposal / Source', data.source],
          ].map(([k, v]) => (
            <div key={k} className="bg-gray-800 rounded-xl p-3">
              <div className="text-gray-500 text-xs mb-0.5">{k}</div>
              <div className="text-white font-medium">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
