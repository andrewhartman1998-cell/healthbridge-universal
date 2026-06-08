import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STORIES = [
  { id:1, title:"I lost everything at 44 — and it was the best thing that ever happened to me", tag:'Resilience', read:'8 min', emoji:'🔥',
    preview:"Divorce, job loss, DUI — all in the same year. My kids stopped talking to me. I'm not going to pretend there was some moment of grace that fixed it. There wasn't. There was just one morning I didn't drink, and then another.",
    full:`I was a regional sales director making good money, married 17 years, two kids in high school. From the outside it looked right.

Inside I hadn't been okay in a decade.

The divorce blindsided me even though it shouldn't have. She'd been telling me for years. I heard the words but I couldn't feel them landing. I was so checked out that I didn't even process what I was losing until the house was sold.

The DUI came six months later. I drove myself home from a bar because I thought I was fine. I wasn't fine. I haven't been fine in a long time.

My kids were 15 and 17. They found out the same night it happened. My son called me and said "Dad I can't talk to you right now" and hung up.

That call did what nothing else had done.

I went to AA not because I believed in it but because I had nothing else. I sat in those rooms and listened to men say the exact things I'd been pretending weren't true about me. I started talking back. I got a sponsor. I got honest.

It took 14 months before my son answered my calls consistently. 22 months before my daughter would have dinner with me. I showed up every time they'd let me. Not to fix it. Just to show up.

I'm 48 now. Four years sober. I have a smaller job and a smaller apartment and more actual peace than I've ever had in my life.

I'm not saying losing everything was worth it. Some of what I lost I'll never get back. But the man I am now is someone my kids can actually know. That's worth more than everything I had before.

If you're reading this and you recognize yourself — the checking out, the numbness, the staying busy so you don't have to feel it — you don't have to wait until it all falls apart. I'm telling you from the other side: the thing you're avoiding is the door.` },
  { id:2, title:"I almost didn't make it to 30", tag:'Mental Health', read:'6 min', emoji:'💙',
    preview:"I'm writing this at 34, which means I had four more years than I thought I was going to get. I spent most of 29 actively planning to not be here. I didn't tell anyone.",
    full:`There's a version of this story where I talk about what brought me to that point — the childhood stuff, the relationships, the job. But honestly that's not what I want to say.

What I want to say is: I was a man who everyone thought was doing fine.

I had friends. I had a social life. I was funny. I showed up. Nobody had any idea.

That's the part that almost killed me — the isolation inside the performance. I got so good at seeming okay that I couldn't find a way to stop and say "I'm not okay."

I finally said it to my doctor at a routine physical. I don't even know why that day. He referred me to a therapist. She didn't fix me. But she gave me a place where I didn't have to perform.

Six months of therapy and medication later I didn't want to die anymore. That sounds simple. It took everything.

I'm 34 now. I coach youth basketball on Saturday mornings. I have a dog named Carl. I still have bad stretches. But I know how to find help now, and I know that the stretches end.

If you're where I was: your people would rather have the real, struggling version of you than not have you at all. I promise you that.

988. Call or text. Do it.` },
  { id:3, title:"My dad never said I love you. I say it to my son every single day.", tag:'Fatherhood', read:'5 min', emoji:'👨‍👦',
    preview:"My father was a good man by most measures. Worked hard. Didn't drink. Stayed. But I cannot remember one time in my life that he told me he loved me. I didn't realize how much that cost me until I had a son of my own.",
    full:`He showed love by doing. Fixed your car. Drove you anywhere. Was there. But the words? Never.

I'm 39. I've spent years in therapy unpacking what that silence cost me — the constant need for external validation, the inability to sit in vulnerability, the reflexive shutting down when things got emotional.

When my son was born I made a decision. I said it on day one. I've said it every day since. He's 7 now.

The funny thing is it still feels slightly uncomfortable sometimes. That's the inheritance — my dad's emotional constipation living in my nervous system. I do it anyway.

Last month he told me unprompted: "Dad, you're my best friend."

I went to the bathroom so he wouldn't see me cry.

That right there is what breaking a cycle looks like. It doesn't require a grand gesture. It requires showing up differently than you were shown, every single day, even when it feels unnatural, even when nobody taught you how.

Tell your kids you love them. Tell your dad you love him if you can. Tell your brothers.

We're all starving for something we were never taught to ask for.` },
  { id:4, title:"I went to therapy and it saved my career, my marriage, and probably my life", tag:'Therapy', read:'7 min', emoji:'🧠',
    preview:"I resisted for five years. 'I don't need to talk to a stranger about my feelings.' I was 36, two kids, married 8 years, a job that was eating me alive. My wife gave me an ultimatum. I went. Here's what I found.",
    full:`I want to be honest about why I resisted: I thought therapy was for people who couldn't handle their problems. I thought it meant weakness. I thought I was managing.

My wife saw what I couldn't. She said: "You're here but you're not here. Your kids are going to grow up and remember a dad who was physically present and emotionally absent. I'm not going to do this anymore."

She wasn't wrong.

My therapist is a 58-year-old man who has this way of saying nothing while you figure out what you're actually trying to say. First three sessions I thought it was useless. I was talking, he was listening, nothing was happening.

Then in session four I said something out loud that I'd never said to anyone, and I started crying in a way I hadn't cried since I was a kid. And he said: "That's been in there a long time."

Two years of weekly sessions. I'm not the same person.

I handle conflict differently. I can be present with my kids in a way I couldn't before. My marriage went from functional-but-dying to genuinely good. I do better work because I'm not running on anxiety and adrenaline.

The ROI on therapy is extraordinary. I wish someone had told me that at 25.

If you've been resisting — your reasons are probably the same as mine. They're also probably not the real reason. The real reason is it's scary to look at what's actually there.

It's worth it. Go.` },
]

export default function Stories() {
  const nav = useNavigate()
  const [reading, setReading] = useState(null)

  const story = STORIES.find(s => s.id === reading)

  return (
    <div className="min-h-screen bg-steel-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={reading ? () => setReading(null) : () => nav('/')} className="text-steel-400 hover:text-white">← {reading ? 'Back to stories' : 'Back'}</button>
          {!reading && (
            <div>
              <h1 className="text-3xl font-black text-white">📖 Real Stories</h1>
              <p className="text-steel-400 text-sm">Men sharing what they actually went through. Raw. Honest. No polish.</p>
            </div>
          )}
        </div>

        {!reading ? (
          <div className="space-y-5">
            {STORIES.map(s => (
              <div key={s.id} onClick={() => setReading(s.id)}
                className="bg-steel-900 hover:bg-steel-800 border border-steel-700 hover:border-blue-600 rounded-2xl p-6 cursor-pointer transition-all group">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{s.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-bold">{s.tag}</span>
                      <span className="text-steel-600 text-xs">{s.read} read</span>
                    </div>
                    <h3 className="font-black text-white text-lg group-hover:text-blue-300 transition-colors mb-2">{s.title}</h3>
                    <p className="text-steel-400 text-sm leading-relaxed">{s.preview}</p>
                    <p className="text-blue-500 text-sm mt-3 font-bold group-hover:text-blue-400">Read the full story →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="text-xs bg-blue-900 text-blue-300 px-3 py-1 rounded-full font-bold mb-3 inline-block">{story.tag}</span>
              <h1 className="text-2xl font-black text-white mb-2">{story.title}</h1>
              <p className="text-steel-400 text-sm">{story.read} · Anonymous</p>
            </div>
            <div className="prose prose-invert max-w-none">
              {story.full.split('\n\n').map((para, i) => (
                <p key={i} className="text-steel-300 leading-relaxed mb-5 text-base">{para}</p>
              ))}
            </div>
            <div className="mt-8 bg-steel-900 border border-steel-700 rounded-2xl p-5 text-center">
              <p className="text-steel-400 text-sm mb-3">This story resonate? Someone out there needs to read it.</p>
              <p className="text-blue-400 font-bold text-sm">Share The Brotherhood with a brother who needs it.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
