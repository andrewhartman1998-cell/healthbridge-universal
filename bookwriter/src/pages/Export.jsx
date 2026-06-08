import React, { useState } from 'react'
import { Download, Copy, CheckCircle, BookOpen, Clock, PenLine, FileText } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT } from '../i18n/langs.js'

export default function Export({ currentBook, setPage }) {
  const { lang } = useLang()
  const t = useT(lang)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('preview')
  const [format, setFormat] = useState('standard')

  if (!currentBook) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="text-6xl">📥</div>
      <p className="text-gray-300 text-xl font-bold">No book selected</p>
      <button onClick={()=>setPage('books')} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl">Open a Book</button>
    </div>
  )

  const totalWords = currentBook.chapters.reduce((s,ch)=>s+(ch.content?.trim().split(/\s+/).filter(Boolean).length||0),0)
  const readTime = Math.max(1, Math.round(totalWords/250))

  const buildText = () => {
    const sep = format==='manuscript' ? '\n\n' + '─'.repeat(50) + '\n\n' : '\n\n'
    const header = format==='manuscript'
      ? `${currentBook.author?.toUpperCase()}\n\n\n${currentBook.title.toUpperCase()}\n\nA ${currentBook.genre}\n\nby ${currentBook.author}\n\n` + '─'.repeat(50) + '\n\n'
      : `${currentBook.title}\nby ${currentBook.author}\n${currentBook.genre}${currentBook.description?'\n\n'+currentBook.description:''}\n\n${'─'.repeat(60)}\n\n`
    return header + currentBook.chapters.map(ch=>`${ch.title?.toUpperCase()||'CHAPTER'}\n\n${ch.content||'(empty)'}`).join(sep)
  }

  const fullText = buildText()

  const download = () => {
    const blob = new Blob([fullText], {type:'text/plain;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentBook.title.replace(/[^a-z0-9]/gi,'_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copy = () => {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(()=>setCopied(false), 2500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">{t.exportPage.title}</h1>
        <p className="text-amber-400 font-semibold text-sm mt-1">📖 {currentBook.title} · by {currentBook.author}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5 text-center">
          <PenLine size={22} className="text-amber-400 mx-auto mb-2"/>
          <div className="text-3xl font-black text-white">{totalWords.toLocaleString()}</div>
          <div className="text-gray-400 text-xs mt-1">{t.exportPage.totalWords}</div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5 text-center">
          <BookOpen size={22} className="text-amber-400 mx-auto mb-2"/>
          <div className="text-3xl font-black text-white">{currentBook.chapters.length}</div>
          <div className="text-gray-400 text-xs mt-1">{t.exportPage.chapters}</div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5 text-center">
          <Clock size={22} className="text-amber-400 mx-auto mb-2"/>
          <div className="text-3xl font-black text-white">~{readTime}</div>
          <div className="text-gray-400 text-xs mt-1">{t.exportPage.mins}</div>
        </div>
      </div>

      {/* Format selector */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-4 mb-6">
        <p className="text-gray-400 text-sm font-bold mb-3">Export Format</p>
        <div className="flex gap-3">
          {[
            {id:'standard', label:'📄 Standard', desc:'Title, author, chapters'},
            {id:'manuscript', label:'📜 Manuscript', desc:'Submission-ready format'},
          ].map(f=>(
            <button key={f.id} onClick={()=>setFormat(f.id)}
              className={`flex-1 p-3 rounded-xl border text-left transition-all ${format===f.id?'border-amber-600 bg-amber-900/20':'border-gray-700 hover:border-gray-600'}`}>
              <div className="font-bold text-white text-sm">{f.label}</div>
              <div className="text-gray-500 text-xs">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={download}
          className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-900/30">
          <Download size={18}/> {t.exportPage.download}
        </button>
        <button onClick={copy}
          className={`font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${copied?'bg-green-700 text-white':'bg-gray-700 hover:bg-gray-600 text-white'}`}>
          {copied?<><CheckCircle size={18}/> Copied!</>:<><Copy size={18}/> {t.exportPage.downloadDocx}</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[['preview','👁️ Preview'],['chapters','📚 Chapters']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab===id?'bg-amber-600 text-gray-950':'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab==='preview' && (
        <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-h-[55vh] overflow-y-auto">
          <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-serif">{fullText||'No content yet.'}</pre>
        </div>
      )}

      {tab==='chapters' && (
        <div className="space-y-3">
          {currentBook.chapters.map(ch=>{
            const wc=ch.content?.trim().split(/\s+/).filter(Boolean).length||0
            return (
              <div key={ch.id} className="bg-gray-900 rounded-2xl border border-gray-700 p-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white">{ch.title||'Untitled'}</h3>
                  <span className="text-gray-500 text-xs">{wc.toLocaleString()} words</span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">{ch.content?.slice(0,200)||(
                  <em className="text-gray-700">No content yet</em>
                )}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
