import { useNavigate } from 'react-router-dom'

const modules = [
  { path: '/locker-room', emoji: '🏈', title: 'The Locker Room', desc: 'Talk sports, life, work, whatever. No topic off-limits.' },
  { path: '/vent', emoji: '🎙️', title: 'Vent It Out', desc: 'Say what you actually feel. Anonymous. No judgment. Just men listening.' },
  { path: '/mental-health', emoji: '🧠', title: 'Mind Check', desc: "Real talk on depression, anxiety, stress, and burnout. Because it's not weakness — it's human." },
  { path: '/challenges', emoji: '⚔️', title: 'Brotherhood Challenges', desc: '30-day challenges: fitness, gratitude, cold showers, no-phone mornings. Do it together.' },
  { path: '/stories', emoji: '📖', title: 'Real Stories', desc: 'Men sharing what they actually went through. Raw. Honest. Powerful.' },
  { path: '/resources', emoji: '🆘', title: 'Crisis Resources', desc: 'If you or a brother needs help right now. Real lines. Real people.' },
]

export default function Landing() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-steel-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-steel-900 via-steel-950 to-black"/>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}}/>
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-blue-900/40 border border-blue-700 text-blue-300 text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            💪 Men's Mental Health Month — June 2026
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-none">
            THE<br/>
            <span className="text-blue-400">BROTHER</span>HOOD
          </h1>
          <p className="text-xl text-steel-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            The digital locker room. A men's-only space to laugh, vent, connect, and actually talk.
          </p>
          <p className="text-steel-400 max-w-xl mx-auto mb-10">
            No filters. No judgment. No performance. Just men being real with each other — the way we used to be before the world told us we couldn't.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => nav('/locker-room')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-xl text-lg transition-all shadow-xl shadow-blue-900/40">
              Enter The Locker Room →
            </button>
            <button onClick={() => nav('/mental-health')}
              className="border border-steel-600 hover:border-steel-400 text-steel-300 font-bold px-8 py-4 rounded-xl text-lg transition-all">
              Mind Check
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-steel-900 border-y border-steel-800">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '1 in 8', label: 'Men have a mental health problem' },
            { num: '75%', label: 'Suicides are male' },
            { num: '40%', label: 'Of men never talk about mental health' },
            { num: 'June', label: "Men's Mental Health Month" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black text-blue-400">{s.num}</div>
              <div className="text-steel-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-steel-900 to-steel-950 border border-steel-700 rounded-3xl p-10 mb-16">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-3xl font-black text-white mb-4">Why The Brotherhood exists</h2>
          <p className="text-steel-300 text-lg leading-relaxed mb-4">
            Men are in a crisis that nobody talks about. Depression. Isolation. Suicide. Addiction. The collapse of male friendship. Men are told to "man up" — and so they suffer in silence.
          </p>
          <p className="text-steel-300 text-lg leading-relaxed mb-4">
            The Brotherhood is a space built specifically for men to do what we used to do naturally — talk to each other. Not therapy (though that's great). Not Instagram. The old-school locker room where you could say the real thing and have a brother say "yeah, me too."
          </p>
          <p className="text-blue-300 text-lg font-bold">
            No filters. No judgment. No pretending everything is fine. Just brotherhood.
          </p>
        </div>

        {/* Modules grid */}
        <h2 className="text-3xl font-black text-white mb-8">What's inside</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {modules.map(m => (
            <button key={m.path} onClick={() => nav(m.path)}
              className="bg-steel-900 hover:bg-steel-800 border border-steel-700 hover:border-blue-600 rounded-2xl p-6 text-left transition-all group">
              <div className="text-4xl mb-3">{m.emoji}</div>
              <h3 className="font-black text-white text-lg mb-2 group-hover:text-blue-300 transition-colors">{m.title}</h3>
              <p className="text-steel-400 text-sm leading-relaxed">{m.desc}</p>
            </button>
          ))}
        </div>

        {/* Code of conduct */}
        <div className="bg-steel-900 border border-steel-700 rounded-3xl p-8">
          <h2 className="text-2xl font-black text-white mb-6">⚔️ The Code</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { rule: 'Men only', desc: 'This space is for men. Period.' },
              { rule: 'Real talk only', desc: 'No posturing. No showing off. Be real.' },
              { rule: 'What\'s said here stays here', desc: 'Brotherhood means trust.' },
              { rule: 'Lift each other up', desc: 'We don\'t tear down. We build up.' },
              { rule: 'No judgment', desc: 'Whatever you\'re going through, you\'re not alone.' },
              { rule: 'If a brother\'s hurting, say something', desc: 'Watch out for each other.' },
            ].map(r => (
              <div key={r.rule} className="flex items-start gap-3">
                <span className="text-blue-400 font-black mt-0.5">✓</span>
                <div>
                  <span className="text-white font-bold">{r.rule}</span>
                  <span className="text-steel-400"> — {r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-steel-800 py-8 text-center text-steel-600 text-sm">
        <p>The Brotherhood — Built for Men's Mental Health Month, June 2026</p>
        <p className="mt-1">Part of the <a href="https://andrewhartman1998-cell.github.io/healthbridge-universal/" className="text-blue-500 hover:text-blue-400">Andrew Hartman Social Impact Portfolio</a></p>
      </div>
    </div>
  )
}
