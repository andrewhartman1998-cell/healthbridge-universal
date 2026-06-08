import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CHALLENGES = [
  { id:'cold', emoji:'🧊', title:'30-Day Cold Shower Challenge', difficulty:'Medium', category:'Physical', participants:2341,
    description:"End every shower with 60 seconds of cold water. Sounds brutal. Is brutal. Also one of the fastest ways to train mental toughness and reduce anxiety.",
    days:['Day 1–3: 30 seconds cold at the end of your normal shower','Day 4–7: 45 seconds','Day 8–14: 60 seconds full cold','Day 15–21: 90 seconds','Day 22–30: 2 minutes — finish every shower cold, every day'],
    why:"Cold exposure has solid research backing for mood, alertness, and resilience. But the real benefit is proving to yourself that you can do hard things." },
  { id:'phone', emoji:'📵', title:'No Phone Before 9AM', difficulty:'Hard', category:'Mental', participants:3892,
    description:"Your phone is the first thing you reach for. Stop. The first hour of your day belongs to you — not an algorithm, not your notifications, not someone else's emergency.",
    days:['Week 1: Leave your phone in another room overnight','Week 2: Add a morning routine before you touch it (water, stretch, 5 min outside)','Week 3: Journal for 5 minutes before you check anything','Week 4: Extend to 9am. Notice what changes.'],
    why:"The first thing you consume in the morning sets your mental state for hours. You're choosing to start your day with someone else's agenda." },
  { id:'gratitude', emoji:'🙏', title:'5 Brothers, 5 Days', difficulty:'Easy', category:'Brotherhood', participants:1234,
    description:"Text or call 5 different men in your life over 5 days. Tell each one specifically what they mean to you or what you appreciate about them. That's it.",
    days:['Day 1: Text your oldest friend','Day 2: Text your dad, or someone who was like a dad to you','Day 3: Text a brother or cousin you haven\'t talked to in a while','Day 4: Text someone who helped you during a hard time','Day 5: Text someone you\'ve been meaning to reach out to'],
    why:"Male friendships die from neglect. This won't fix everything, but it will remind both of you that someone's thinking about you." },
  { id:'gym', emoji:'💪', title:'Move Every Day for 30 Days', difficulty:'Medium', category:'Physical', participants:5621,
    description:"You don't have to crush it. You just have to move. 20 minutes minimum. Walk, lift, swim, bike, push-ups in your bedroom. Doesn't matter. Show up for your body.",
    days:['Days 1–5: 20 min walk or basic home workout','Days 6–10: Add resistance — bodyweight squats, push-ups, rows','Days 11–15: Increase to 30 min','Days 16–25: Find one thing you actually enjoy doing physically','Days 26–30: Don\'t miss. This is a habit now.'],
    why:"Exercise is the most evidence-backed intervention for depression, anxiety, and cognitive function. It's not optional. It's medicine." },
  { id:'journal', emoji:'✍️', title:'5-Minute Journal', difficulty:'Easy', category:'Mental', participants:1876,
    description:"Write 3 sentences every night before bed. What happened today. What you felt. One thing you're grateful for. That's the whole challenge.",
    days:['Night 1–7: Just 3 sentences. Don\'t overthink it.','Night 8–14: Add one thing you\'re proud of from the day','Night 15–21: Add one hard thing you want to say out loud','Night 22–30: Read back over the month. See how much changed.'],
    why:"Men don't process emotions — we bury them. Writing externalizes what's internal. You'll be surprised how much lighter you feel." },
  { id:'sober', emoji:'🚫', title:'Sober Month', difficulty:'Hard', category:'Health', participants:987,
    description:"30 days without alcohol. Full stop. Not 'mostly.' Not weekends only. Thirty days to find out who you are when you're not numbing anything.",
    days:['Week 1: Remove it from your home. Replace the habit with something else.','Week 2: Tell one person — accountability matters','Week 3: Notice what you were drinking to avoid feeling','Week 4: Decide at the end what your relationship with alcohol should actually be'],
    why:"Most men drinking regularly are using it to manage anxiety, avoid difficult feelings, or fill social gaps. A month off tells you which one it is." },
]

export default function Challenges() {
  const nav = useNavigate()
  const [selected, setSelected] = useState(null)
  const [joined, setJoined] = useState({})
  const challenge = CHALLENGES.find(c => c.id === selected)

  const join = (id) => {
    setJoined(j => ({ ...j, [id]: true }))
  }

  const diffColor = { Easy: 'text-green-400 bg-green-900/20 border-green-800', Medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-800', Hard: 'text-red-400 bg-red-900/20 border-red-800' }

  return (
    <div className="min-h-screen bg-steel-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => nav('/')} className="text-steel-400 hover:text-white">← Back</button>
          <div>
            <h1 className="text-3xl font-black text-white">⚔️ Brotherhood Challenges</h1>
            <p className="text-steel-400 text-sm">30-day commitments. Do them alone. Do them better together.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {CHALLENGES.map(c => (
            <div key={c.id} className={`bg-steel-900 border rounded-2xl overflow-hidden transition-all cursor-pointer ${selected === c.id ? 'border-blue-600' : 'border-steel-700 hover:border-steel-500'}`}
              onClick={() => setSelected(selected === c.id ? null : c.id)}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{c.emoji}</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-full border ${diffColor[c.difficulty]}`}>{c.difficulty}</span>
                </div>
                <h3 className="font-black text-white text-base mb-1">{c.title}</h3>
                <p className="text-steel-400 text-sm mb-3">{c.description.slice(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <span className="text-steel-500 text-xs">👥 {c.participants.toLocaleString()} brothers in</span>
                  <button
                    onClick={e => { e.stopPropagation(); join(c.id) }}
                    className={`text-xs font-black px-4 py-1.5 rounded-xl transition-all ${joined[c.id] ? 'bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                    {joined[c.id] ? '✓ Joined' : 'I\'m in'}
                  </button>
                </div>
              </div>

              {selected === c.id && (
                <div className="border-t border-steel-700 p-5 bg-steel-900/50">
                  <p className="text-steel-300 text-sm leading-relaxed mb-4">{c.description}</p>
                  <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3">The plan</h4>
                  <ul className="space-y-2 mb-4">
                    {c.days.map((d,i) => (
                      <li key={i} className="flex items-start gap-2 text-steel-300 text-sm">
                        <span className="text-blue-400 flex-shrink-0 font-black">→</span>{d}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="text-blue-300 text-xs font-bold">💡 Why it works: {c.why}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
