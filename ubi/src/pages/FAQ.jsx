import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  { q: "Won't people just stop working?", a: "The evidence says no. In every major UBI pilot — Finland, Stockton, Kenya, Manitoba — work hours fell only slightly or not at all. In Stockton, full-time employment actually doubled. People don't stop working when they have security. They become more selective, more entrepreneurial, and more willing to take career risks. They also do more unpaid work — caregiving, volunteering, community building — that has enormous social value." },
  { q: "How would we pay for it?", a: "Multiple credible mechanisms exist: a Value-Added Tax (Andrew Yang's proposal — a 10% VAT would generate ~$800B/year), a carbon dividend, a financial transaction tax on stock trades, a wealth tax, or consolidating existing welfare programs. The US already spends $700B+/year on means-tested welfare programs — UBI would replace many of them with a simpler, more effective system. For context: the 2017 Trump tax cuts cost ~$1.9 trillion over 10 years. UBI is a political choice, not a mathematical impossibility." },
  { q: "Won't it cause inflation?", a: "The concern is legitimate but largely overstated. UBI replaces existing income for many recipients — it's not all new money in the economy. For those in poverty, additional spending goes to basic goods and local businesses, not luxury imports. The Alaska Permanent Fund has paid dividends since 1982 with no inflationary effect. VAT-funded UBI actually recirculates money through the economy rather than printing new currency." },
  { q: "Should it replace all existing welfare programs?", a: "This is a critical design question. Andrew Yang's proposal allows recipients to choose: take the $1,000/month OR keep their existing benefits (SSDI, housing assistance, etc.) — not both. This ensures no one is worse off. Most UBI advocates do not propose eliminating Medicare, Medicaid, or Social Security. UBI is best understood as a floor — other programs remain for those with greater needs." },
  { q: "What about people who misuse the money?", a: "Research consistently shows the opposite of what critics fear. Recipients in Kenya, Finland, Stockton, and Manitoba spent more on food, healthcare, education, and housing — and less on alcohol and tobacco. When people have economic security, they make long-term decisions. The 'irresponsible poor' narrative is not supported by evidence. We trust wealthy recipients of tax cuts, Social Security, and mortgage deductions to manage their money. We should extend the same trust to everyone." },
  { q: "How is this different from welfare?", a: "Three key differences: (1) Universality — welfare is means-tested, UBI is universal. No application, no eligibility review, no stigma. (2) Unconditional — welfare often has work requirements, marriage penalties, and drug tests. UBI has none. (3) Efficiency — means-tested programs have massive administrative overhead. UBI has almost none. You pay taxes; you receive UBI. Simple." },
  { q: "What about immigration?", a: "Most UBI proposals limit eligibility to citizens and long-term legal residents — similar to how Social Security works today. The design details matter, but citizenship-based UBI is the most common proposal and has strong precedent." },
  { q: "Has UBI ever actually worked?", a: "Yes. Iran's universal cash transfer (since 2011) reaches virtually every citizen. Alaska's Permanent Fund has paid annual dividends to every resident since 1982 — Alaska consistently has the lowest income inequality in the US. Kenya's GiveDirectly program is in year 10 of a 12-year study with strong positive results. Finland, Stockton, Germany, and the UK have all run successful pilots. The evidence base is substantial and growing." },
  { q: "Will automation really eliminate that many jobs?", a: "McKinsey Global Institute estimates 375–800 million jobs could be displaced by automation by 2030. Truck driving alone employs 3.5 million Americans — autonomous vehicles may eliminate most of those jobs within 15 years. Retail, food service, accounting, legal research, customer service — AI and automation are reshaping all of these. The question isn't whether disruption is coming. It's whether we have a plan." },
  { q: "Is UBI left-wing or right-wing?", a: "Both. UBI has been supported across the political spectrum. Milton Friedman (libertarian economist) proposed a Negative Income Tax — a form of UBI. Richard Nixon proposed a basic income in 1969. Martin Luther King Jr. championed guaranteed income. Andrew Yang ran as a Democrat. Charles Murray (conservative) has proposed a form of UBI. The Alaska Permanent Fund was created by a Republican governor and is beloved by conservatives and liberals alike. UBI is not ideological — it is pragmatic." },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">❓ Frequently Asked Questions</h1>
        <p className="text-gray-400">Every common objection to UBI — answered with evidence.</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className={`bg-gray-900 rounded-2xl border transition-all ${open === i ? 'border-purple-600' : 'border-gray-700 hover:border-gray-600'}`}>
            <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpen(open === i ? null : i)}>
              <span className="font-bold text-white pr-4">{f.q}</span>
              <ChevronDown size={18} className={`text-purple-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-gray-300 text-sm leading-relaxed">{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-purple-900/40 border border-purple-700 rounded-2xl p-6 text-center">
        <h2 className="font-black text-white text-xl mb-2">Still have questions?</h2>
        <p className="text-gray-300 text-sm mb-4">The research is deep and the conversation is ongoing. Explore the Policy Center and Countries sections for more evidence.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="https://basicincome.stanford.edu" target="_blank" rel="noopener noreferrer"
            className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            Stanford Basic Income Lab →
          </a>
          <a href="https://bien.info" target="_blank" rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            BIEN Global Network →
          </a>
        </div>
      </div>
    </div>
  )
}
