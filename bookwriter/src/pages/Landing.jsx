import React from 'react'
import { PenLine, BookOpen, LayoutList, Download, Globe, Star, Target, Wrench } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT } from '../i18n/langs.js'

const FEATURES = [
  { icon: PenLine,    color:'text-amber-400',  title:'Distraction-Free Editor',    desc:'Full-screen writing mode. Focus Mode blocks everything but your words. Auto-saves every keystroke.' },
  { icon: LayoutList, color:'text-blue-400',   title:'Chapter & Outline Manager',  desc:'Build your story structure with acts, scenes, and chapters. Reorder anytime. Notes per scene.' },
  { icon: Target,     color:'text-green-400',  title:'Daily Writing Goals',        desc:'Set a daily word target. Track your streak. See your progress bar fill up as you write.' },
  { icon: Wrench,     color:'text-purple-400', title:'Writing Tools',              desc:'Word frequency analysis, readability scores, pacing checker, character name generator, and writing prompts.' },
  { icon: Download,   color:'text-teal-400',   title:'Export Your Manuscript',     desc:'Download your full book as a .txt file or copy it for Word / Google Docs. Word count and reading time included.' },
  { icon: Globe,      color:'text-rose-400',   title:'50 Languages + RTL',         desc:'Full UI in your language. RTL support for Arabic, Urdu, Hebrew, and Persian. Every author deserves their tools.' },
  { icon: Star,       color:'text-yellow-400', title:'Genre Writing Guides',       desc:'12 genres: Fiction, Sci-Fi, Romance, Mystery, Horror, Memoir, Self-Help, Fantasy, Poetry, and more.' },
  { icon: BookOpen,   color:'text-orange-400', title:'Unlimited Books',            desc:'Write as many books as you want. All saved locally — private, fast, always available, no account needed.' },
]

const QUOTES = [
  { q:'"There is no greater agony than bearing an untold story inside you."', a:'— Maya Angelou' },
  { q:'"You don\'t write because you want to say something, you write because you have something to say."', a:'— F. Scott Fitzgerald' },
  { q:'"A reader lives a thousand lives before he dies. The man who never reads lives only one."', a:'— George R.R. Martin' },
]

export default function Landing({ setPage }) {
  const { lang } = useLang()
  const t = useT(lang)
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-gray-950 via-amber-950/20 to-gray-950 py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 50%, #d97706 0%, transparent 55%), radial-gradient(circle at 70% 30%, #7c3aed 0%, transparent 50%)'}}/>
        <div className="relative max-w-4xl mx-auto">
          <div className="text-8xl mb-6">📖</div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">{t.home.hero}</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">{t.home.heroSub}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setPage('write')} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-10 py-4 rounded-full shadow-lg shadow-amber-900/50 transition-all flex items-center gap-2 text-lg">
              <PenLine size={22}/> {t.home.startBtn}
            </button>
            <button onClick={() => setPage('books')} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2">
              <BookOpen size={18}/> {t.home.booksBtn}
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            {['✅ Free forever','✅ No account required','✅ No ads','✅ 50 languages','✅ Works offline'].map(f=><span key={f}>{f}</span>)}
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="bg-gray-900 py-16 px-4 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center text-white mb-2">Everything you need to write your book</h2>
          <p className="text-gray-400 text-center mb-10">Built for serious writers. Free for everyone.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f,i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-amber-700 transition-all">
                <f.icon size={24} className={`${f.color} mb-3`}/>
                <h3 className="font-bold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Author quotes */}
      <div className="max-w-4xl mx-auto py-14 px-4 space-y-6">
        {QUOTES.map((q,i)=>(
          <div key={i} className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 border border-amber-800/30 rounded-2xl p-6 text-center">
            <p className="text-amber-200 text-lg italic mb-2">"{q.q.replace(/^"|"$/g,'')}"</p>
            <p className="text-amber-500 text-sm font-bold">{q.a}</p>
          </div>
        ))}
      </div>

      {/* Genres strip */}
      <div className="bg-gray-900 py-10 px-4 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-6">12 genres with built-in writing guides</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {['📖 Fiction','🌌 Sci-Fi','💘 Romance','🔍 Mystery','👻 Horror','🧠 Memoir','💡 Self-Help','🏰 Fantasy','✍️ Poetry','🏔️ Adventure','📜 Historical','🧒 Children\'s'].map(g=>(
              <button key={g} onClick={()=>setPage('genres')} className="bg-gray-800 border border-gray-700 hover:border-amber-600 text-gray-300 text-sm font-semibold px-4 py-2 rounded-full transition-all">{g}</button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-950 py-20 px-4 text-center">
        <div className="text-5xl mb-4">✍️</div>
        <h2 className="text-3xl font-black text-white mb-3">Your story is waiting.</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Free. No sign-up. No limits. Start writing your book today.</p>
        <button onClick={()=>setPage('write')} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-12 py-4 rounded-full text-xl shadow-xl transition-all mx-auto inline-flex items-center gap-3">
          <PenLine size={24}/> {t.home.startBtn}
        </button>
      </div>
    </div>
  )
}
