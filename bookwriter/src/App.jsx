import React, { useState } from 'react'
import { LangProvider, useLang } from './i18n/LangContext.jsx'
import { useT, LANGUAGES } from './i18n/langs.js'
import Landing from './pages/Landing.jsx'
import MyBooks from './pages/MyBooks.jsx'
import Writer from './pages/Writer.jsx'
import Outline from './pages/Outline.jsx'
import Goals from './pages/Goals.jsx'
import Export from './pages/Export.jsx'
import Genres from './pages/Genres.jsx'
import WritingTools from './pages/WritingTools.jsx'
import { BookOpen, PenLine, LayoutList, Download, Star, Target, Wrench, Home, Menu, X, ChevronDown } from 'lucide-react'

function Nav({ page, setPage, currentBook }) {
  const { lang, setLang } = useLang()
  const t = useT(lang)
  const [mob, setMob] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const NAV = [
    {id:'home',    label:t.nav.home,          icon:Home},
    {id:'books',   label:t.nav.books,         icon:BookOpen},
    {id:'write',   label:t.nav.write,         icon:PenLine},
    {id:'outline', label:t.nav.outline,       icon:LayoutList},
    {id:'goals',   label:t.nav.goals,         icon:Target},
    {id:'export',  label:t.nav.export,        icon:Download},
    {id:'genres',  label:t.nav.genres,        icon:Star},
    {id:'tools',   label:t.nav.writing_tools, icon:Wrench},
  ]

  const curLang = LANGUAGES.find(l=>l.code===lang)

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={()=>setPage('home')} className="flex items-center gap-2 font-black text-white shrink-0 mr-2">
          <span className="text-2xl">📖</span>
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent hidden sm:inline">{t.appName}</span>
        </button>
        <nav className="hidden xl:flex items-center gap-0.5 flex-1">
          {NAV.map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setPage(id)}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${page===id?'bg-amber-500 text-gray-950 font-black':'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <Icon size={13}/>{label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-auto">
          {currentBook && <span className="hidden md:block text-xs text-amber-400 font-semibold bg-amber-900/30 border border-amber-800 px-2.5 py-1 rounded-full truncate max-w-28">✍️ {currentBook.title}</span>}
          <div className="relative">
            <button onClick={()=>setLangOpen(!langOpen)} className="flex items-center gap-1 bg-gray-800 border border-gray-700 text-gray-300 px-2 py-1.5 rounded-lg text-xs hover:bg-gray-700">
              🌐 <span className="hidden sm:inline">{curLang?.name}</span> <ChevronDown size={10}/>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto w-52">
                {LANGUAGES.map(l=>(
                  <button key={l.code} onClick={()=>{setLang(l.code);setLangOpen(false)}}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 ${lang===l.code?'text-amber-400 font-bold':'text-gray-300'}`}>
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="xl:hidden text-white p-1" onClick={()=>setMob(!mob)}>
            {mob?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>
      </div>
      {mob && (
        <div className="xl:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4 grid grid-cols-4 gap-2 pt-3">
          {NAV.map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>{setPage(id);setMob(false)}}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all ${page===id?'bg-amber-500 text-gray-950 font-black':'text-gray-400 hover:bg-gray-800'}`}>
              <Icon size={16}/><span className="leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

function AppInner() {
  const [page, setPage] = useState('home')
  const { lang } = useLang()
  const t = useT(lang)
  const [books, setBooks] = useState(() => { try { return JSON.parse(localStorage.getItem('bw_books')||'[]') } catch { return [] } })
  const [currentBook, setCurrentBook] = useState(null)

  const PAGES = { home:Landing, books:MyBooks, write:Writer, outline:Outline, goals:Goals, export:Export, genres:Genres, tools:WritingTools }
  const Page = PAGES[page] || Landing

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Nav page={page} setPage={setPage} currentBook={currentBook}/>
      <main className="flex-1">
        <Page books={books} setBooks={setBooks} currentBook={currentBook} setCurrentBook={setCurrentBook} setPage={setPage}/>
      </main>
      {page!=='write' && (
        <footer className="bg-gray-900 border-t border-gray-800 text-center py-4 text-gray-600 text-xs">
          📖 BookWriter Global — Write your book in any language. Free. No account required. Built by Andrew Hartman.
        </footer>
      )}
    </div>
  )
}

export default function App() {
  return <LangProvider><AppInner/></LangProvider>
}
