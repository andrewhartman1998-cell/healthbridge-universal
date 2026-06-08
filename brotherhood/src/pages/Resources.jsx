import { useNavigate } from 'react-router-dom'

const CRISIS = [
  { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', desc: '24/7 free, confidential crisis support in the US', url: 'https://988lifeline.org', urgent: true },
  { name: 'Crisis Text Line', contact: 'Text HOME to 741741', desc: '24/7 text-based crisis support', url: 'https://www.crisistextline.org', urgent: true },
  { name: 'Veterans Crisis Line', contact: 'Call 988, press 1 | Text 838255', desc: 'For veterans, service members, and their families', url: 'https://www.veteranscrisisline.net', urgent: true },
]

const RESOURCES = [
  { category: 'Finding a Therapist', emoji: '🧑‍⚕️', items: [
    { name: 'Psychology Today Therapist Finder', desc: 'The largest therapist directory. Filter by gender, specialty, insurance, and cost.', url: 'https://www.psychologytoday.com/us/therapists' },
    { name: 'Open Path Collective', desc: 'Affordable therapy ($30–$80/session) for those without insurance coverage.', url: 'https://openpathcollective.org' },
    { name: 'BetterHelp', desc: 'Online therapy — text, phone, or video. More accessible for men who don\'t want to go in person.', url: 'https://www.betterhelp.com' },
    { name: 'SAMHSA Helpline', desc: 'Free treatment locator for mental health and substance use. 1-800-662-4357.', url: 'https://www.samhsa.gov/find-help/national-helpline' },
  ]},
  { category: "Men's Mental Health", emoji: '🧠', items: [
    { name: 'Movember Foundation', desc: 'The global leader in men\'s mental health research, education, and advocacy.', url: 'https://us.movember.com' },
    { name: 'Man Therapy', desc: 'A no-BS resource for men who won\'t usually seek help. Developed with clinical backing.', url: 'https://mantherapy.org' },
    { name: 'HeadsUpGuys', desc: 'A resource center specifically for men fighting depression.', url: 'https://headsupguys.org' },
    { name: 'Men\'s Health Network', desc: 'Education and advocacy for men\'s health and wellness.', url: 'https://www.menshealthnetwork.org' },
  ]},
  { category: 'Substance Use', emoji: '🚫', items: [
    { name: 'Alcoholics Anonymous', desc: 'AA meetings worldwide. Meeting finder at aa.org.', url: 'https://www.aa.org' },
    { name: 'SMART Recovery', desc: 'Science-based alternative to 12-step. In-person and online meetings.', url: 'https://www.smartrecovery.org' },
    { name: 'Sober Grid', desc: 'Social recovery app — community support 24/7.', url: 'https://sobergrid.com' },
  ]},
  { category: 'Grief & Loss', emoji: '💔', items: [
    { name: 'GriefShare', desc: 'Grief recovery support groups. Find one near you at griefshare.org.', url: 'https://www.griefshare.org' },
    { name: 'What\'s Your Grief', desc: 'Free grief education, community, and resources.', url: 'https://whatsyourgrief.com' },
    { name: 'Alliance of Hope (Suicide Loss)', desc: 'Specifically for those who have lost someone to suicide.', url: 'https://allianceofhope.org' },
  ]},
  { category: 'Fatherhood', emoji: '👨‍👦', items: [
    { name: 'City Dads Group', desc: 'Community for stay-at-home and engaged fathers. Local chapters nationwide.', url: 'https://citydadsgroup.com' },
    { name: 'National Fatherhood Initiative', desc: 'Resources and community for fathers. Especially for at-risk and re-entry dads.', url: 'https://www.fatherhood.org' },
  ]},
  { category: 'Veterans', emoji: '🎖️', items: [
    { name: 'VA Mental Health Services', desc: 'Free mental health care for all veterans. No cost.', url: 'https://www.mentalhealth.va.gov' },
    { name: 'Mission 22', desc: 'Veteran suicide prevention — treatment programs and peer support.', url: 'https://mission22.com' },
    { name: 'Team Red White & Blue', desc: 'Community and physical/social activity programs for veterans.', url: 'https://www.teamrwb.org' },
  ]},
]

export default function Resources() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-steel-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => nav('/')} className="text-steel-400 hover:text-white">← Back</button>
          <div>
            <h1 className="text-3xl font-black text-white">🆘 Crisis Resources</h1>
            <p className="text-steel-400 text-sm">If you or a brother needs help right now — real lines, real people.</p>
          </div>
        </div>

        {/* Emergency banner */}
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-5 mb-8">
          <p className="text-red-300 font-black text-sm mb-3">⚠️ If you are in immediate danger — call 911 (US), 999 (UK), or 112 (EU) immediately.</p>
          <div className="space-y-3">
            {CRISIS.map(c => (
              <div key={c.name} className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-black text-white">{c.name}</p>
                  <p className="text-yellow-400 font-bold text-sm">{c.contact}</p>
                  <p className="text-steel-400 text-xs">{c.desc}</p>
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-5 py-2 rounded-xl transition-all">
                  Get Help Now →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Resource categories */}
        <div className="space-y-8">
          {RESOURCES.map(cat => (
            <div key={cat.category}>
              <h2 className="text-xl font-black text-white mb-4">{cat.emoji} {cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map(item => (
                  <div key={item.name} className="bg-steel-900 border border-steel-700 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-black text-white">{item.name}</p>
                      <p className="text-steel-400 text-sm mt-0.5">{item.desc}</p>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all flex-shrink-0">
                      Visit →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 bg-steel-900 border border-steel-700 rounded-2xl p-6 text-center">
          <p className="text-steel-300 font-bold mb-2">You reached out by being here. That matters.</p>
          <p className="text-steel-500 text-sm">The Brotherhood was built for June 2026 — Men's Mental Health Month — but it's here every month. Share it with a brother who needs it.</p>
        </div>
      </div>
    </div>
  )
}
