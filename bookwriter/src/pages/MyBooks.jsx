import React, { useState } from 'react'
import { BookOpen, Plus, Trash2, PenLine, Clock, ChevronRight, Search } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT, LANGUAGES } from '../i18n/langs.js'

const GENRES = ['Fiction','Non-Fiction','Memoir','Mystery','Sci-Fi','Romance','Horror','Adventure','Self-Help','History','Children\'s','Poetry','Thriller','Fantasy','Biography','Other']

function wordCount(book) {
  return book.chapters.reduce((s,ch)=>s+(ch.content?.trim().split(/\s+/).filter(Boolean).length||0),0)
}

export default function MyBooks({ books, setBooks, setCurrentBook, setPage }) {
  const { lang } = useLang()
  const t = useT(lang)
  const [creating, setCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({title:'',author:'',genre:'Fiction',language:'en',description:''})

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))

  const createBook = () => {
    if (!form.title.trim()) return
    const book = {
      id: Date.now().toString(),
      title: form.title.trim(),
      author: form.author.trim() || 'Anonymous',
      genre: form.genre, language: form.language,
      description: form.description.trim(),
      chapters: [{id:'ch1', title:`${t.nav.write} — Chapter 1`, content:''}],
      outline: {synopsis:'', acts:[]},
      goals: {daily:500, streak:0, todayWords:0, lastWrittenDate:'', totalWords:0},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [...books, book]
    setBooks(updated)
    localStorage.setItem('bw_books', JSON.stringify(updated))
    setCurrentBook(book)
    setCreating(false)
    setForm({title:'',author:'',genre:'Fiction',language:'en',description:''})
    setPage('write')
  }

  const deleteBook = (id) => {
    const updated = books.filter(b=>b.id!==id)
    setBooks(updated)
    localStorage.setItem('bw_books', JSON.stringify(updated))
    setConfirmDelete(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">{t.books.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{books.length} book{books.length!==1?'s':''} · saved locally in your browser</p>
        </div>
        <button onClick={()=>setCreating(true)} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all">
          <Plus size={18}/> {t.books.newBook}
        </button>
      </div>

      {books.length > 2 && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search books..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"/>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-700">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-300 text-lg font-semibold mb-1">{t.books.noBooks}</p>
          <p className="text-gray-500 text-sm mb-5">Every great author started with a blank page.</p>
          <button onClick={()=>setCreating(true)} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-2.5 rounded-xl transition-all">{t.books.newBook}</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(book => {
          const wc = wordCount(book)
          const lang2 = LANGUAGES.find(l=>l.code===book.language)?.name || book.language
          return (
            <div key={book.id} className="bg-gray-900 rounded-2xl border border-gray-700 hover:border-amber-600 transition-all p-5 group flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs bg-amber-900/40 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">{book.genre}</span>
                    <span className="text-xs text-gray-600">{lang2}</span>
                  </div>
                  <h2 className="font-black text-white text-lg truncate">{book.title}</h2>
                  <p className="text-gray-500 text-sm">by {book.author}</p>
                </div>
                <button onClick={()=>setConfirmDelete(book.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-400 rounded-lg hover:bg-red-900/20 transition-all shrink-0">
                  <Trash2 size={15}/>
                </button>
              </div>
              {book.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2 italic">"{book.description}"</p>}
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 mt-auto pt-2 border-t border-gray-800">
                <span><BookOpen size={11} className="inline mr-1"/>{book.chapters.length} {t.books.chapters}</span>
                <span><PenLine size={11} className="inline mr-1"/>{wc.toLocaleString()} {t.books.words}</span>
                <span><Clock size={11} className="inline mr-1"/>{new Date(book.updatedAt).toLocaleDateString()}</span>
              </div>
              <button onClick={()=>{setCurrentBook(book);setPage('write')}} className="w-full bg-gray-800 hover:bg-amber-500 hover:text-gray-950 text-gray-300 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {t.books.open} <ChevronRight size={14}/>
              </button>
            </div>
          )
        })}
      </div>

      {/* New book modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-amber-600 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-white mb-5">📖 {t.newBook.title}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t.newBook.bookTitle}</label>
                <input autoFocus value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                  placeholder="e.g. The Midnight Garden"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"/>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t.newBook.author}</label>
                <input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Your name"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">{t.newBook.genre}</label>
                  <select value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {GENRES.map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">{t.newBook.writingLang}</label>
                  <select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {LANGUAGES.map(l=><option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">{t.newBook.description}</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}
                  placeholder="What's your book about? (optional)"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"/>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={createBook} disabled={!form.title.trim()}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-gray-950 font-black py-3 rounded-xl transition-all">
                {t.newBook.create}
              </button>
              <button onClick={()=>setCreating(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all">
                {t.newBook.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-white font-black text-lg mb-2">Delete this book?</h2>
            <p className="text-gray-400 text-sm mb-5">All chapters and content will be permanently lost.</p>
            <div className="flex gap-3">
              <button onClick={()=>deleteBook(confirmDelete)} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl">Delete</button>
              <button onClick={()=>setConfirmDelete(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
