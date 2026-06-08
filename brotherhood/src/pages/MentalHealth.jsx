import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOPICS = [
  { id:'depression', emoji:'🌑', title:'Depression', color:'indigo',
    overview:"Depression in men often looks different than the textbook version. Anger, irritability, overworking, drinking too much, withdrawing — these are the male masks of depression. It's not sadness. It's numbness. It's not caring about things you used to love.",
    signs:['Persistent anger or irritability (not sadness)', 'Withdrawing from friends and family', 'Overworking or staying "busy" to avoid feeling', 'Increased alcohol or substance use', 'Physical symptoms: headaches, back pain, fatigue', 'Loss of interest in things you used to love', 'Feeling empty, not sad'],
    what:["Talk to one person — a friend, doctor, or therapist. You don't have to explain everything. Just say 'I'm not doing well.'", 'See your doctor. Depression has a physical component. Get bloodwork done.', 'Reduce alcohol — it amplifies depressive episodes.', 'Move your body, even a short walk. The research is overwhelming.', 'If you have thoughts of suicide, call 988 right now.'],
    stat:"1 in 5 men will experience depression in their lifetime. Most never seek help." },
  { id:'anxiety', emoji:'⚡', title:'Anxiety', color:'yellow',
    overview:"Men's anxiety often shows up as constant worry, perfectionism, overplanning, or physical symptoms — racing heart, tight chest, trouble sleeping. We call it 'stress' because anxiety sounds weak. It's not weak. It's your nervous system under load.",
    signs:['Constant worry you can\'t shut off', 'Trouble sleeping — mind won\'t stop', 'Physical symptoms: chest tightness, shortness of breath', 'Avoiding situations that might cause embarrassment', 'Irritability and snapping at people you care about', 'Overthinking decisions, even small ones', 'Needing everything to be "controlled"'],
    what:['Slow your breathing — 4 counts in, hold 4, out 6. This is not woo-woo. It activates your parasympathetic nervous system.', 'Name what you\'re anxious about specifically. Vague dread is worse than a defined problem.', 'Exercise is one of the most effective anxiety treatments available.', 'Limit caffeine — it directly worsens anxiety.', 'Cognitive Behavioral Therapy (CBT) has the strongest research backing for anxiety. Find a therapist.'],
    stat:"Men are far less likely to be diagnosed with anxiety — not because they have it less, but because they mask it better." },
  { id:'burnout', emoji:'🔥', title:'Burnout', color:'orange',
    overview:"Burnout is what happens when you run on empty for too long. Men are especially prone because we're rewarded for overwork and conditioned to ignore our limits. By the time most men recognize burnout, they've been running on fumes for years.",
    signs:['Exhaustion that sleep doesn\'t fix', 'Cynicism — nothing feels meaningful', 'Reduced performance at things you\'re good at', 'Emotional detachment from people you love', 'Dreading things you used to look forward to', 'Physical illness more frequently', 'Feeling like a machine, not a person'],
    what:['Take actual time off — not "sort of off." Real disconnection.', 'Identify what\'s draining vs. what\'s restoring you. Cut the drain where possible.', 'Set a boundary at work. One real boundary.', 'Talk to your doctor — burnout can look like depression and thyroid issues simultaneously.', 'This one often requires structural change, not just coping strategies. Don\'t just "push through."'],
    stat:'Burnout is now recognized by the WHO as a legitimate occupational phenomenon.' },
  { id:'grief', emoji:'💔', title:'Grief & Loss', color:'blue',
    overview:"Men grieve differently. We tend to grieve through action — staying busy, fixing things, helping others — rather than sitting in the pain. Neither is wrong, but unprocessed grief finds you eventually. It comes out as anger, numbness, or addiction.",
    signs:['Inability to concentrate months after a loss', 'Anger that seems out of proportion', 'Guilt — replaying what you could have done differently', 'Avoiding things that remind you of what you lost', 'Using work, alcohol, or sex to stay numb', 'Physical exhaustion with no clear cause'],
    what:['Give yourself permission to grieve. There is no timeline and no right way.', 'Talk about the person/thing you lost. Saying their name keeps them real.', "Don't mistake numbness for healing. If it hasn't come out in months, it's waiting.", 'Grief groups work — especially for loss of a parent, child, or spouse.', 'If grief is interfering with daily functioning after 6+ months, talk to a professional.'],
    stat:'Men\'s grief is chronically underdiagnosed and undertreated. We don\'t give ourselves permission to fall apart.' },
  { id:'isolation', emoji:'🏝️', title:'Loneliness & Isolation', color:'teal',
    overview:"There is a male loneliness epidemic and almost nobody is talking about it. Men over 30 are losing friends faster than they're making them. Fewer close relationships. Less physical touch. Less emotional support. This is a public health crisis.",
    signs:['No one you\'d call in a genuine emergency', 'Feeling invisible in social situations', 'Your relationship (if you have one) is your only emotional outlet', 'Weeks pass without a real conversation', 'You don\'t know your neighbors', 'You\'ve stopped making plans'],
    what:['Reach out to one person from your past. One text. Just start.', 'Join something with regular attendance — a gym class, a league, a group. Consistency builds connection.', 'Be the one who reaches out first. Most men are waiting for someone else to do it.', 'If you\'re in a relationship, don\'t put all your emotional weight on your partner. That\'s too much.', 'Therapy is also social connection. Don\'t dismiss it.'],
    stat:'According to a 2021 Survey Center on American Life study, 15% of men have no close friends — up from 3% in 1990.' },
]

export default function MentalHealth() {
  const nav = useNavigate()
  const [selected, setSelected] = useState(null)
  const topic = TOPICS.find(t => t.id === selected)

  const colorMap = { indigo:'border-indigo-600 bg-indigo-900/20', yellow:'border-yellow-600 bg-yellow-900/10', orange:'border-orange-600 bg-orange-900/10', blue:'border-blue-600 bg-blue-900/10', teal:'border-teal-600 bg-teal-900/10' }

  return (
    <div className="min-h-screen bg-steel-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => nav('/')} className="text-steel-400 hover:text-white">← Back</button>
          <div>
            <h1 className="text-3xl font-black text-white">🧠 Mind Check</h1>
            <p className="text-steel-400 text-sm">Real talk on the things men deal with but rarely say out loud.</p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 rounded-2xl p-5 mb-8">
          <p className="text-blue-200 font-bold">This isn't a diagnosis tool. It's a conversation starter. If something here resonates, that's information worth acting on.</p>
        </div>

        {/* Topic cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setSelected(selected === t.id ? null : t.id)}
              className={`text-left p-5 rounded-2xl border transition-all ${selected === t.id ? colorMap[t.color] : 'bg-steel-900 border-steel-700 hover:border-steel-500'}`}>
              <div className="text-4xl mb-3">{t.emoji}</div>
              <h3 className="font-black text-white text-lg">{t.title}</h3>
              <p className="text-steel-500 text-xs mt-1 italic">"{t.stat.slice(0,60)}..."</p>
            </button>
          ))}
        </div>

        {/* Expanded topic */}
        {topic && (
          <div className={`rounded-2xl border p-6 mb-8 ${colorMap[topic.color]}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{topic.emoji}</span>
              <h2 className="text-2xl font-black text-white">{topic.title}</h2>
            </div>
            <p className="text-steel-300 leading-relaxed mb-6">{topic.overview}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-black text-white mb-3 text-sm uppercase tracking-widest">Signs in men</h3>
                <ul className="space-y-2">
                  {topic.signs.map((s,i) => (
                    <li key={i} className="flex items-start gap-2 text-steel-300 text-sm">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-black text-white mb-3 text-sm uppercase tracking-widest">What actually helps</h3>
                <ul className="space-y-2">
                  {topic.what.map((w,i) => (
                    <li key={i} className="flex items-start gap-2 text-steel-300 text-sm">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-black/20 rounded-xl p-4">
              <p className="text-blue-300 text-sm font-bold italic">📊 {topic.stat}</p>
            </div>
          </div>
        )}

        {/* Quick check-in */}
        <div className="bg-steel-900 border border-steel-700 rounded-2xl p-6">
          <h2 className="font-black text-white text-xl mb-4">⚡ Quick Check-In</h2>
          <p className="text-steel-400 text-sm mb-4">On a scale of 1–10, how are you actually doing right now?</p>
          <div className="flex gap-2 flex-wrap">
            {[1,2,3,4,5,6,7,8,9,10].map(n => {
              const color = n <= 3 ? 'bg-red-800 hover:bg-red-700' : n <= 6 ? 'bg-yellow-800 hover:bg-yellow-700' : 'bg-green-800 hover:bg-green-700'
              return (
                <button key={n} className={`w-10 h-10 rounded-xl font-black text-white text-sm transition-all ${color}`}>{n}</button>
              )
            })}
          </div>
          <p className="text-steel-600 text-xs mt-3">If you're below a 4, consider telling one person — or call 988.</p>
        </div>
      </div>
    </div>
  )
}
