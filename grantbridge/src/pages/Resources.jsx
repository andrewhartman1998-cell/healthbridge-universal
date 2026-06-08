import React, { useState } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'

const RESOURCES = [
  { id:1, emoji:'📋', title:'The Grant Writing Formula', category:'Writing Guide', desc:'The proven structure every successful grant proposal follows — with examples from funded applications.', content:`**The 5-Part Grant Proposal Formula:**\n\n1. **Need Statement / Problem Statement**\n   - Open with data: statistics that prove the problem is real and urgent\n   - Make it local: national statistics + local impact\n   - End with your organization's unique position to solve it\n\n2. **Goals & Objectives**\n   - Goals = broad outcomes ("reduce food insecurity")\n   - Objectives = specific, measurable, time-bound ("provide 500 families with monthly food boxes by December 31")\n   - Use SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound\n\n3. **Project Description / Methods**\n   - What exactly will you do? Step by step.\n   - Who does what? (staff, volunteers, partners)\n   - Where and when?\n   - Why this approach vs. alternatives?\n\n4. **Evaluation Plan**\n   - How will you know you succeeded?\n   - What data will you collect and how?\n   - Who is responsible for evaluation?\n\n5. **Budget & Budget Narrative**\n   - Every dollar must be justified\n   - Keep overhead/indirect under 15–20%\n   - Show leverage: other funding sources\n   - Narrative explains WHY each item is needed\n\n**Pro Tips:**\n• Read the RFP at least 3 times before writing\n• Answer exactly what they ask — not what you want to say\n• Start with the executive summary last\n• Have a non-expert read your draft — if they're confused, the funder will be too` },
  { id:2, emoji:'📊', title:'Budget Template — Grant Ready', category:'Templates', desc:'A ready-to-use grant budget template with all standard line items, plus tips on what funders look for.', content:`**Standard Grant Budget Line Items:**\n\nPERSONNEL\n• Program Director (% of FTE × annual salary)\n• Program Coordinator (% of FTE × annual salary)\n• Fringe Benefits (typically 20–30% of salaries)\n\nNON-PERSONNEL — DIRECT COSTS\n• Supplies & Materials\n• Equipment (over $5,000 usually needs justification)\n• Printing & Copying\n• Postage & Shipping\n• Transportation / Mileage ($0.67/mile in 2024)\n• Participant Incentives (keep under 10% of budget)\n• Contracted Services / Consultants\n• Training & Professional Development\n• Rent / Facility Costs (for project-specific space)\n\nINDIRECT COSTS / OVERHEAD\n• Standard rate: 10–15% of direct costs\n• Many funders cap at 15%\n• Some require a federally negotiated indirect rate (larger grants)\n\n**Budget Narrative Template:**\n\n"[Line item]: [Amount]\n[Staff name/role] will dedicate [X% / X hours/week] to this project at [annual salary of $X], resulting in a grant-funded portion of $[amount]. This position is responsible for [specific duties]."\n\n**Red Flags That Get Budgets Rejected:**\n• Overhead over 20% without justification\n• Vague line items ("miscellaneous" — never use this)\n• Costs that don't match the project description\n• Missing fringe benefits\n• No matching funds when required` },
  { id:3, emoji:'✉️', title:'Letter of Intent (LOI) Template', category:'Templates', desc:'Most foundation grants require a Letter of Intent first. Use this template to write a compelling LOI in under an hour.', content:`**LETTER OF INTENT TEMPLATE**\n\n[Date]\n\n[Funder Name]\n[Program Officer Name]\n[Address]\n\nDear [Program Officer Name],\n\n[PARAGRAPH 1 — WHO YOU ARE]\n[Organization Name] is a [year]-founded 501(c)(3) nonprofit serving [population] in [geographic area]. Our mission is to [mission statement in one sentence]. Last year, we served [number] people through [key programs].\n\n[PARAGRAPH 2 — THE PROBLEM]\nIn [city/region], [problem statement with data]. Despite [existing resources], [gap that still exists]. [Local statistic]. Our organization is uniquely positioned to address this because [your strengths/track record].\n\n[PARAGRAPH 3 — YOUR PROPOSED PROJECT]\nWe are requesting $[amount] to [project title]. This project will [what it does] and will directly benefit [number] [population] in [location/timeframe]. Key activities include [3 activities].\n\n[PARAGRAPH 4 — ALIGNMENT & OUTCOMES]\nThis project aligns with [Funder]'s priority areas of [their priorities]. By the end of the grant period, we expect to [2–3 measurable outcomes]. We will track success through [evaluation methods].\n\n[PARAGRAPH 5 — CLOSE]\nWe would welcome the opportunity to submit a full proposal. Please contact [name] at [email] or [phone] with any questions. Thank you for your consideration and for your commitment to [their mission area].\n\nSincerely,\n[Executive Director Name]\n[Title]\n[Organization]\n[Contact Info]` },
  { id:4, emoji:'🔗', title:'Top Grant Databases (Free)', category:'Research Tools', desc:'Where to find grants — the best free databases for nonprofits of every size and cause.', content:`**Free Grant Databases:**\n\n🇺🇸 FEDERAL GRANTS\n• Grants.gov — ALL federal grants (grants.gov)\n• SAM.gov — Required registration for federal grants\n• USDA Grants — rd.usda.gov/programs-services\n• HHS Grants — grants.hhs.gov\n• DOJ Grants — ojp.gov/funding\n• NEA Grants — arts.gov/grants\n\n🏛️ FOUNDATION GRANTS\n• Foundation Directory Online (limited free) — foundationdirectoryonline.org\n• GrantStation (limited free) — grantstation.com\n• Instrumentl — instrumentl.com (free trial)\n• GrantWatch — grantwatch.com\n• CFDA — cfda.gov\n\n🏙️ LOCAL RESOURCES\n• Your city/county government website → search "nonprofit grants"\n• Your state's nonprofit association (e.g. Forefront in IL)\n• Your local community foundation (search "[city] community foundation")\n• United Way local chapter\n• Local chambers of commerce\n\n📧 GRANT NEWSLETTERS (free)\n• NonprofitReady.org — free training + grant alerts\n• GrantStation Insider (weekly)\n• Foundation Center Newsletter\n• Your state's nonprofit association newsletter\n\n💡 PRO TIP: The easiest grants to win are local community foundation grants because competition is only within your city. Start there before applying to national funders.` },
  { id:5, emoji:'🎓', title:'Free Grant Writing Training', category:'Training', desc:'Free courses, webinars, and certifications for nonprofit grant writers of all experience levels.', content:`**Free Grant Writing Training Resources:**\n\n📚 FREE COURSES\n• NonprofitReady.org — Comprehensive free courses on grant writing, nonprofit management\n• Coursera — "Introduction to Grant Writing" (free to audit)\n• Philanthropy News Digest — webinars and resources\n• GrantSpace (by Candid) — grantspace.org/resources\n\n🎓 FREE CERTIFICATIONS\n• Nonprofit Ready Certificate Programs (nonprofitready.org)\n• TechSoup Training — techsoup.org/learning\n\n📺 FREE WEBINARS\n• Grants.gov webinars (for federal grants)\n• Foundation Center webinars — online.foundationcenter.org\n• Association of Fundraising Professionals (AFP) — afpglobal.org\n\n📖 RECOMMENDED READING (free via your library)\n• "Grant Writing For Dummies" by Beverly Browning\n• "Winning Grants Step by Step" by Mim Carlson\n• "The Foundation Center's Guide to Proposal Writing"\n\n💡 THE FASTEST WAY TO LEARN:\n1. Find a successfully funded grant in your cause area (some are public)\n2. Study its structure, language, and budget\n3. Adapt the formula for your own organization\n4. Apply for small, local grants first to build your track record\n5. Use each application as a template for the next one` },
]

const CATEGORIES = ['All', 'Writing Guide', 'Templates', 'Research Tools', 'Training']

export default function Resources() {
  const [catFilter, setCatFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = catFilter === 'All' ? RESOURCES : RESOURCES.filter(r => r.category === catFilter)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Grant Resources</h1>
        <p className="text-gray-500">Free guides, templates, databases, and training — everything you need to write winning grant proposals.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all ${catFilter === c ? 'bg-indigo-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(r)}>
            <div className="text-3xl mb-3">{r.emoji}</div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-full">{r.category}</span>
            <h2 className="font-bold text-gray-800 text-base mt-2 mb-1">{r.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            <button className="mt-3 text-indigo-700 text-sm font-semibold hover:underline">Read Guide →</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div><div className="text-3xl mb-1">{selected.emoji}</div><h2 className="text-xl font-bold text-gray-800">{selected.title}</h2></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl">
              <pre className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">{selected.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
