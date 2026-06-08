import React, { useState } from 'react'

const GENRES = [
  {emoji:'📖',name:'Fiction',color:'amber',wc:'70,000–100,000',structure:'3-Act Structure or Hero\'s Journey',tips:['Open with conflict or intrigue — hook the reader in the first paragraph','Give your protagonist a clear want (goal) and a deeper need (flaw)','Every scene should advance plot or reveal character — ideally both','Your ending must feel both surprising and inevitable'],famous:['To Kill a Mockingbird','The Great Gatsby','1984','Beloved','The Alchemist']},
  {emoji:'🌌',name:'Sci-Fi',color:'blue',wc:'90,000–120,000',structure:'3-Act with world-building integration',tips:['Establish your world\'s rules early — and never break them','Ground extraordinary concepts in ordinary human emotions','Use "if this, then what?" to build your premise outward','Exposition should feel earned — reveal through action and dialogue'],famous:['Dune','Foundation','The Martian','Ender\'s Game','Neuromancer']},
  {emoji:'💘',name:'Romance',color:'pink',wc:'60,000–90,000',structure:'Meet-Cute → Conflict → Black Moment → HEA',tips:['Romantic tension is everything — resist the payoff as long as possible','Both characters must have growth arcs independent of each other','The "black moment" must feel genuinely unresolvable — then resolve it','Romance readers require an HEA (Happily Ever After) or HFN (Happy For Now)'],famous:['Pride and Prejudice','Outlander','The Notebook','Me Before You']},
  {emoji:'🔍',name:'Mystery',color:'violet',wc:'70,000–90,000',structure:'Crime → Investigation → Red Herrings → Revelation',tips:['Plant clues fairly — the reader should be able to solve it in retrospect','Red herrings must be plausible, not cheap misdirections','Your detective needs a wound or flaw the case will expose','The reveal should recontextualize everything the reader thought they knew'],famous:['Gone Girl','The Girl with the Dragon Tattoo','And Then There Were None','Big Little Lies']},
  {emoji:'👻',name:'Horror',color:'red',wc:'70,000–100,000',structure:'Normalcy → Intrusion → Escalation → Climax → Aftermath',tips:['Dread is more powerful than shock — build slowly, release rarely','Make readers love your characters before you put them in danger','The monster (literal or metaphorical) should mirror the protagonist\'s deepest fear','Leave something unresolved — complete closure kills horror'],famous:['The Shining','It','Dracula','House of Leaves','Mexican Gothic']},
  {emoji:'🧠',name:'Memoir',color:'teal',wc:'60,000–80,000',structure:'Thematic arc over chronological events',tips:['You are the narrator, not the hero — maintain perspective on yourself','Scene > summary — show the moments, don\'t just report them','A memoir needs a central question or wound the author is working through','You must be honest about your own failures to earn the reader\'s trust'],famous:['The Glass Castle','Educated','When Breath Becomes Air','Born a Crime','Wild']},
  {emoji:'💡',name:'Self-Help',color:'green',wc:'40,000–70,000',structure:'Problem → Framework → Application → Transformation',tips:['State your "big idea" in one sentence before you write a single word','Each chapter delivers one concrete, actionable insight','Use stories to illustrate concepts — data alone doesn\'t move people','Be specific. Specificity is credibility.'],famous:['Atomic Habits','The 7 Habits','Man\'s Search for Meaning','Thinking Fast and Slow']},
  {emoji:'🏰',name:'Fantasy',color:'purple',wc:'100,000–200,000',structure:'Hero\'s Journey or multi-POV epic',tips:['World-building serves the story — never the other way around','Magic systems need costs and limits or there\'s no tension','Don\'t start with a map, a glossary, or a prophecy — start with a person','Characters must drive the plot, even in epic fantasy'],famous:['The Lord of the Rings','A Song of Ice and Fire','The Name of the Wind','Mistborn']},
  {emoji:'✍️',name:'Poetry',color:'rose',wc:'48–80 pages (collection)',structure:'Free verse, sonnet, haiku, narrative — varies by form',tips:['Poetry is compression — every word must carry weight','Read your poems aloud. Rhythm and sound are the architecture.','Specificity is poetry\'s superpower: "red Converse, size 9" beats "shoes"','Resist the urge to explain — let the image do the work'],famous:['Milk and Honey','Leaves of Grass','The Waste Land','The Collected Poems of Langston Hughes']},
  {emoji:'🏔️',name:'Adventure',color:'orange',wc:'70,000–100,000',structure:'Call → Journey → Trials → Climax → Return',tips:['Pace is everything — keep the story moving forward relentlessly','Physical stakes must mirror internal stakes or it feels hollow','Every location should feel alive and consequential to the plot','Secondary characters should challenge the protagonist\'s worldview'],famous:['Into the Wild','Life of Pi','The Count of Monte Cristo','Treasure Island']},
  {emoji:'📜',name:'Historical',color:'stone',wc:'80,000–120,000',structure:'3-Act within a historical framework',tips:['Research deeply but wear your research lightly — don\'t lecture the reader','Avoid anachronistic thinking — your characters are products of their time','Find the human story inside the historical event','Historical accuracy matters — but emotional truth matters more'],famous:['The Pillars of the Earth','All the Light We Cannot See','Wolf Hall','The Book Thief']},
  {emoji:'🧒',name:'Children\'s',color:'yellow',wc:'Picture: 500–1K | Middle Grade: 20K–55K',structure:'Problem → Adventure → Resolution (age-appropriate)',tips:['Write at the child\'s level — but never down to them','Children\'s books are about the child\'s agency, not adults\' wisdom','Middle grade: 8–12 year olds want adventure and friendship, not romance','Picture books: every single word must earn its place on the page'],famous:['Harry Potter','Charlotte\'s Web','The Giver','Percy Jackson','A Wrinkle in Time']},
]

const BORDER = {amber:'border-amber-700',blue:'border-blue-700',pink:'border-pink-700',violet:'border-violet-700',red:'border-red-700',teal:'border-teal-700',green:'border-green-700',purple:'border-purple-700',rose:'border-rose-700',orange:'border-orange-700',stone:'border-stone-600',yellow:'border-yellow-600'}
const BG = {amber:'bg-amber-900/20',blue:'bg-blue-900/20',pink:'bg-pink-900/20',violet:'bg-violet-900/20',red:'bg-red-900/20',teal:'bg-teal-900/20',green:'bg-green-900/20',purple:'bg-purple-900/20',rose:'bg-rose-900/20',orange:'bg-orange-900/20',stone:'bg-stone-900/20',yellow:'bg-yellow-900/20'}

export default function Genres() {
  const [sel, setSel] = useState(null)
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">📚 Genre Writing Guides</h1>
        <p className="text-gray-400 mt-1">Click any genre for a full craft guide — structure, tips, word count targets, and famous examples.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {GENRES.map(g=>(
          <button key={g.name} onClick={()=>setSel(sel?.name===g.name?null:g)}
            className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.03] ${sel?.name===g.name?`${BORDER[g.color]} ${BG[g.color]} ring-2 ring-offset-2 ring-offset-gray-950 ring-amber-600`:'bg-gray-900 border-gray-700 hover:border-gray-500'}`}>
            <div className="text-3xl mb-2">{g.emoji}</div>
            <div className="font-bold text-white text-sm">{g.name}</div>
            <div className="text-gray-600 text-xs mt-0.5">{g.wc.split('|')[0].split(':')[0].trim()}</div>
          </button>
        ))}
      </div>

      {sel && (
        <div className={`rounded-2xl border p-6 ${BORDER[sel.color]} ${BG[sel.color]}`}>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{sel.emoji}</span>
            <div>
              <h2 className="text-2xl font-black text-white">{sel.name}</h2>
              <p className="text-gray-400 text-sm">🎯 Target: {sel.wc} words</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <h3 className="font-bold text-white mb-2">📐 Story Structure</h3>
              <div className="bg-black/20 rounded-xl p-4 text-sm text-gray-300 mb-5">{sel.structure}</div>
              <h3 className="font-bold text-white mb-2">📖 Famous Examples</h3>
              <ul className="space-y-1.5">
                {sel.famous.map(f=>(
                  <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span className="text-amber-400 font-bold">→</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">✍️ Craft Tips</h3>
              <ul className="space-y-2">
                {sel.tips.map((tip,i)=>(
                  <li key={i} className="bg-black/20 rounded-xl p-3 text-sm text-gray-300 leading-relaxed">
                    <span className="text-amber-400 font-black mr-1">{i+1}.</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
