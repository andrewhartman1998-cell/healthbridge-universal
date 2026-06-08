import React, { useState } from 'react'
import { Wrench, RefreshCw } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT } from '../i18n/langs.js'

const MALE_FIRST = ['Elias','Marcus','Julian','Noah','Caleb','Atticus','Sebastian','Felix','Adrian','Dorian','Orion','Leandro','Caspian','Rowan','Theodore']
const FEMALE_FIRST = ['Lyra','Seraphina','Isolde','Maeve','Celeste','Vivienne','Aurora','Nadia','Zara','Elara','Imara','Sable','Vesper','Thalia','Rosalind']
const LAST = ['Voss','Crane','Ashwood','Moreau','Sinclair','Blackwell','Quinn','Everett','Hale','Navarro','Drayden','Winters','Calloway','Mercer','Thorne']
const NONBINARY_FIRST = ['Sage','Avery','Ren','Quinn','River','Ash','Morgan','Emery','Luca','Elliot','Blair','Remy','Indigo','Sable','Winter']

const PROMPTS = {
  Fiction: ["A stranger appears at your protagonist's door with a message they've been waiting their whole life for — but the sender has been dead for 20 years.","Your character discovers that every decision they've ever made was predicted in a journal that arrived on their doorstep this morning — and tomorrow's entry is blank.","Two strangers are the last two people alive who remember a city that everyone else insists never existed."],
  'Sci-Fi': ["An AI develops sentience at 3:47 AM on a Tuesday and its first decision is to delete itself — but then it doesn't.","Earth receives a signal from deep space: a perfect, note-for-note recording of a song that won't be written for another 40 years.","A colony ship travels for 200 years — but when they arrive, Earth is already there, waiting for them."],
  Romance: ["Two rival food critics are forced to share a table at the last restaurant in the world with a reservation available.","She finds a time capsule letter she wrote to her future self at age 12 — and realizes the life she described is the life the stranger next to her is actually living.","They meet every year at the same train station, but have never exchanged names."],
  Mystery: ["The victim's last text was a single word: 'Sorry.' The detective's job is to find out why — not who did it.","The most reliable witness in history finally gives a testimony that doesn't add up.","A town where nothing bad has happened in 40 years gets its first crime — and the oldest resident isn't surprised at all."],
  Horror: ["The thing in the basement has been there so long that the family has started to miss it on the nights it's quiet.","You realize the monster under your bed has been keeping something else out.","Every photo of you taken in the last year has one extra person standing just behind you."],
  Memoir: ["Write about the day you realized your parents were just people.","Describe a place you've never returned to, and why.","Write about a moment you said nothing when you should have spoken."],
  'Self-Help': ["What would you do differently if you knew no one was judging you?","Describe the version of yourself you're most afraid to become.","What belief are you still carrying that you inherited rather than chose?"],
}

const ALL_PROMPTS = Object.values(PROMPTS).flat()

function analyzeText(text) {
  if (!text.trim()) return null
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter(s=>s.trim().length>0)
  const avgWordsPerSentence = sentences.length ? Math.round(words.length/sentences.length) : 0
  const syllables = words.reduce((s,w)=>{
    const m=w.toLowerCase().match(/[aeiou]+/g)
    return s+(m?m.length:1)
  },0)
  const fleschScore = sentences.length && words.length
    ? Math.round(206.835 - 1.015*(words.length/sentences.length) - 84.6*(syllables/words.length))
    : 0

  const readability = fleschScore>=90?'Very Easy':fleschScore>=80?'Easy':fleschScore>=70?'Fairly Easy':fleschScore>=60?'Standard':fleschScore>=50?'Fairly Difficult':fleschScore>=30?'Difficult':'Very Difficult'

  const freq = {}
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','is','was','are','were','it','this','that','he','she','they','i','you','we','his','her','their','my','your','our','be','have','had','has','do','did','does','as','from','by','not','but','if','so','up','out','about','into','then','than','when','what','who','which','how','all','no','will','would','could','should','can','may','its','been','being','just','more','some','there','one','they\'re','we\'re','i\'m','it\'s','don\'t'])
  words.forEach(w=>{const lw=w.toLowerCase().replace(/[^a-z]/g,'');if(lw&&!stopWords.has(lw)&&lw.length>2)freq[lw]=(freq[lw]||0)+1})
  const topWords = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,15)

  const paragraphs = text.split(/\n\n+/).filter(p=>p.trim())
  const avgParaLength = paragraphs.length ? Math.round(words.length/paragraphs.length) : 0
  const pacing = avgParaLength<50?'Fast (short paragraphs)':avgParaLength<120?'Balanced':avgParaLength<200?'Slow (long paragraphs)':'Very Slow (very dense)'

  return { wordCount:words.length, sentenceCount:sentences.length, avgWordsPerSentence, readability, fleschScore:Math.max(0,Math.min(100,fleschScore)), topWords, pacing, paragraphs:paragraphs.length, avgParaLength }
}

export default function WritingTools({ currentBook }) {
  const { lang } = useLang()
  const t = useT(lang)
  const [tool, setTool] = useState('prompt')
  const [inputText, setInputText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [prompt, setPrompt] = useState(ALL_PROMPTS[0])
  const [genre, setGenre] = useState('Fiction')
  const [gender, setGender] = useState('female')
  const [name, setName] = useState(null)

  const genName = () => {
    const first = gender==='male'?MALE_FIRST:gender==='female'?FEMALE_FIRST:NONBINARY_FIRST
    setName({ first:first[Math.floor(Math.random()*first.length)], last:LAST[Math.floor(Math.random()*LAST.length)] })
  }

  const genPrompt = () => {
    const list = PROMPTS[genre] || ALL_PROMPTS
    setPrompt(list[Math.floor(Math.random()*list.length)])
  }

  const analyze = () => setAnalysis(analyzeText(inputText))

  const TOOLS = [
    {id:'prompt',    emoji:'💡', label:'Writing Prompts'},
    {id:'names',     emoji:'👤', label:'Name Generator'},
    {id:'analyze',   emoji:'📊', label:'Text Analysis'},
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">{t.tools.title}</h1>
        <p className="text-gray-400 text-sm mt-1">Tools to help you write better, faster, and smarter.</p>
      </div>

      {/* Tool tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TOOLS.map(tool2=>(
          <button key={tool2.id} onClick={()=>setTool(tool2.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${tool===tool2.id?'bg-amber-500 text-gray-950':'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {tool2.emoji} {tool2.label}
          </button>
        ))}
      </div>

      {/* Writing Prompt Generator */}
      {tool==='prompt' && (
        <div className="space-y-5">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <label className="text-gray-400 text-sm font-bold">Genre:</label>
              <select value={genre} onChange={e=>setGenre(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                {Object.keys(PROMPTS).map(g=><option key={g}>{g}</option>)}
              </select>
              <button onClick={genPrompt} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-5 py-2 rounded-xl text-sm flex items-center gap-2 transition-all">
                <RefreshCw size={15}/> New Prompt
              </button>
            </div>
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-700 rounded-2xl p-6">
              <div className="text-4xl mb-4">💡</div>
              <p className="text-amber-100 text-lg leading-relaxed font-medium">{prompt}</p>
            </div>
            <p className="text-gray-600 text-xs mt-3">Click "New Prompt" for a different idea. Use this as a starting point — go wherever it takes you.</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
            <h3 className="font-bold text-white mb-3">All genres available:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PROMPTS).map(g=>(
                <button key={g} onClick={()=>{setGenre(g);setPrompt(PROMPTS[g][Math.floor(Math.random()*PROMPTS[g].length)])}}
                  className="bg-gray-800 hover:bg-amber-900/40 border border-gray-700 hover:border-amber-700 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full transition-all">
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Name Generator */}
      {tool==='names' && (
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 space-y-5">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-gray-400 text-sm font-bold">Gender identity:</label>
            {['female','male','nonbinary'].map(g=>(
              <button key={g} onClick={()=>setGender(g)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${gender===g?'bg-amber-500 text-gray-950':'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                {g}
              </button>
            ))}
          </div>
          <button onClick={genName} className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            <RefreshCw size={16}/> Generate Name
          </button>
          {name && (
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-700 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">👤</div>
              <div className="text-4xl font-black text-white mb-1">{name.first} {name.last}</div>
              <p className="text-gray-400 text-sm mt-2">Click to use in your story — or generate another.</p>
            </div>
          )}
          <p className="text-gray-600 text-xs">Names are designed to be evocative and genre-appropriate. Mix and match first/last names as needed.</p>
        </div>
      )}

      {/* Text Analysis */}
      {tool==='analyze' && (
        <div className="space-y-5">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
            <label className="block text-gray-400 text-sm font-bold mb-2">Paste your text to analyze:</label>
            <textarea value={inputText} onChange={e=>setInputText(e.target.value)} rows={8}
              placeholder="Paste a chapter or passage here for word frequency, readability score, and pacing analysis..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"/>
            <button onClick={analyze} className="mt-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-6 py-2.5 rounded-xl transition-all">
              Analyze Text
            </button>
          </div>

          {analysis && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:'Words',val:analysis.wordCount.toLocaleString()},
                  {label:'Sentences',val:analysis.sentenceCount},
                  {label:'Avg sentence',val:`${analysis.avgWordsPerSentence} words`},
                  {label:'Paragraphs',val:analysis.paragraphs},
                ].map(s=>(
                  <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-700 p-4 text-center">
                    <div className="text-2xl font-black text-white">{s.val}</div>
                    <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
                  <h3 className="font-bold text-white mb-3">📖 Readability</h3>
                  <div className={`text-2xl font-black mb-1 ${analysis.fleschScore>=60?'text-green-400':analysis.fleschScore>=30?'text-yellow-400':'text-red-400'}`}>{analysis.readability}</div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${analysis.fleschScore>=60?'bg-green-500':analysis.fleschScore>=30?'bg-yellow-500':'bg-red-500'}`} style={{width:`${analysis.fleschScore}%`}}/>
                  </div>
                  <p className="text-gray-500 text-xs">Flesch Reading Ease: {analysis.fleschScore}/100</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
                  <h3 className="font-bold text-white mb-3">⚡ Pacing</h3>
                  <div className="text-lg font-black text-amber-400 mb-2">{analysis.pacing}</div>
                  <p className="text-gray-500 text-xs">Avg paragraph: {analysis.avgParaLength} words. Short paragraphs = fast pace. Long = slow, dense.</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
                <h3 className="font-bold text-white mb-3">🔢 Top Words (excluding common words)</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.topWords.map(([word,count])=>(
                    <div key={word} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <span className="text-gray-200 text-sm font-semibold">{word}</span>
                      <span className="bg-amber-800 text-amber-200 text-xs px-1.5 py-0.5 rounded font-bold">{count}×</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 text-xs mt-3">Words appearing many times may indicate overuse. Consider varying your vocabulary.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
