import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROMPTS = [
  "What are you carrying right now that nobody knows about?",
  "What's the thing you never say out loud?",
  "What would you tell your younger self?",
  "What are you actually angry about?",
  "What do you wish someone would ask you?",
  "What are you most afraid of right now?",
  "What does 'being a man' cost you?",
  "What would you do if you weren't afraid of what people thought?",
]

const VENTS = [
  { id:1, time:'3h ago', text:"I've been pretending to be okay for so long I don't even know what not okay looks like anymore. My wife thinks I'm fine. My boss thinks I'm fine. I'm not fine.", hearts:67 },
  { id:2, time:'5h ago', text:"Lost my job 6 weeks ago. Haven't told my dad yet. I call him every Sunday and just... lie. I don't know why. Maybe I don't want to see the disappointment.", hearts:134 },
  { id:3, time:'8h ago', text:"My best friend of 20 years stopped calling after his divorce. I've reached out 10 times. Nothing. I genuinely don't know if he's okay and I'm scared to find out.", hearts:89 },
  { id:4, time:'1d ago', text:"I cried in my car after work for the first time in maybe 15 years. Didn't even know I still could. Felt embarrassed about it and I don't even know why — nobody saw.", hearts:201 },
  { id:5, time:'1d ago', text:"I'm 42 and I have zero close friends. Not one person I could call at 2am. I built a career, raised kids, stayed married — and somehow ended up completely alone.", hearts:312 },
  { id:6, time:'2d ago', text:"Started therapy last month. Hadn't told anyone. Telling you all now because someone here probably needs to hear that it's okay to go.", hearts:445 },
]

export default function Vent() {
  const nav = useNavigate()
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [vents, setVents] = useState(VENTS)
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [hearts, setHearts] = useState({})

  const submit = () => {
    if (!text.trim()) return
    setVents(prev => [{ id: Date.now(), time: 'just now', text: text.trim(), hearts: 0 }, ...prev])
    setText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const heart = (id) => {
    setVents(v => v.map(x => x.id === id ? { ...x, hearts: x.hearts + 1 } : x))
    setHearts(h => ({ ...h, [id]: true }))
  }

  return (
    <div className="min-h-screen bg-steel-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => nav('/')} className="text-steel-400 hover:text-white">← Back</button>
          <div>
            <h1 className="text-3xl font-black text-white">🎙️ Vent It Out</h1>
            <p className="text-steel-400 text-sm">Anonymous. Safe. Just men reading and listening. No judgment here.</p>
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-gradient-to-br from-blue-900/40 to-steel-900 border border-blue-700 rounded-2xl p-6 mb-6">
          <p className="text-steel-400 text-xs uppercase tracking-widest mb-2">Tonight's prompt</p>
          <p className="text-blue-200 text-xl font-bold leading-relaxed">"{prompt}"</p>
          <p className="text-steel-500 text-xs mt-3">You don't have to answer this. Say whatever you need to say.</p>
        </div>

        {/* Write box */}
        <div className="bg-steel-900 border border-steel-700 rounded-2xl p-5 mb-8">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Say it. Whatever it is. Nobody knows who you are."
            rows={5}
            className="w-full bg-steel-800 border border-steel-700 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-steel-500 leading-relaxed"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="text-steel-600 text-xs space-y-0.5">
              <p>🔒 100% anonymous — no names, no accounts, no tracking</p>
              <p>👁️ Only brothers in this space can read this</p>
            </div>
            <button onClick={submit}
              className={`font-black px-6 py-2.5 rounded-xl text-sm transition-all ${submitted ? 'bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {submitted ? '✓ Let it go' : 'Send it'}
            </button>
          </div>
        </div>

        {submitted && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-300 font-bold">You said it. That took guts. Brothers are reading.</p>
          </div>
        )}

        {/* Feed */}
        <h2 className="text-lg font-black text-white mb-4">What brothers are carrying</h2>
        <div className="space-y-4">
          {vents.map(v => (
            <div key={v.id} className="bg-steel-900 border border-steel-800 rounded-2xl p-5">
              <p className="text-steel-200 leading-relaxed mb-4">{v.text}</p>
              <div className="flex justify-between items-center">
                <span className="text-steel-600 text-xs">{v.time}</span>
                <button onClick={() => heart(v.id)} disabled={hearts[v.id]}
                  className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-lg transition-all ${hearts[v.id] ? 'text-red-400 bg-red-900/20' : 'text-steel-500 hover:text-red-400 hover:bg-red-900/20'}`}>
                  ❤️ {v.hearts}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
