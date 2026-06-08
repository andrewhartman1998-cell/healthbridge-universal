import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Trash2, PenLine, BookOpen, ChevronLeft, ChevronRight, Maximize2, Minimize2, Search, X } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT } from '../i18n/langs.js'

export default function Writer({ books, setBooks, currentBook, setCurrentBook, setPage }) {
  const { lang } = useLang()
  const t = useT(lang)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [focusMode, setFocusMode] = useState(false)
  const [editingTitle, setEditingTitle] = useState(null)
  const [showFR, setShowFR] = useState(false)
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const saveRef = useRef(null)

  useEffect(() => {
    if (currentBook && !activeId) setActiveId(currentBook.chapters[0]?.id)
  }, [currentBook?.id])

  const persist = useCallback((updatedBook) => {
    const all = books.map(b => b.id === updatedBook.id ? updatedBook : b)
    setBooks(all)
    setCurrentBook(updatedBook)
    localStorage.setItem('bw_books', JSON.stringify(all))
  }, [books])

  const updateContent = (id, content) => {
    if (!currentBook) return
    const updated = { ...currentBook, updatedAt: new Date().toISOString(),
      chapters: currentBook.chapters.map(ch => ch.id===id ? {...ch,content} : ch) }
    setCurrentBook(updated)
    if (saveRef.current) clearTimeout(saveRef.current)
    saveRef.current = setTimeout(() => persist(updated), 700)
  }

  const updateTitle = (id, title) => {
    if (!currentBook) return
    const updated = { ...currentBook, chapters: currentBook.chapters.map(ch => ch.id===id ? {...ch,title} : ch) }
    persist(updated)
  }

  const addChapter = () => {
    if (!currentBook) return
    const ch = { id: Date.now().toString(), title: `Chapter ${currentBook.chapters.length+1}`, content:'' }
    const updated = { ...currentBook, chapters:[...currentBook.chapters, ch], updatedAt: new Date().toISOString() }
    persist(updated)
    setActiveId(ch.id)
  }

  const deleteChapter = (id) => {
    if (!currentBook || currentBook.chapters.length <= 1) return
    const updated = { ...currentBook, chapters: currentBook.chapters.filter(ch=>ch.id!==id) }
    persist(updated)
    if (activeId===id) setActiveId(updated.chapters[0].id)
  }

  const doReplace = () => {
    if (!findText || !currentBook) return
    const ch = currentBook.chapters.find(c=>c.id===activeId)
    if (!ch) return
    const newContent = ch.content.split(findText).join(replaceText)
    updateContent(activeId, newContent)
  }

  if (!currentBook) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
        <div className="text-7xl">📖</div>
        <h2 className="text-2xl font-black text-white">No book open</h2>
        <p className="text-gray-400">Open a book from your library or create a new one.</p>
        <div className="flex gap-3 mt-2">
          <button onClick={()=>setPage('books')} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl">Open a Book</button>
        </div>
      </div>
    )
  }

  const active = currentBook.chapters.find(ch=>ch.id===activeId)
  const wc = active?.content?.trim().split(/\s+/).filter(Boolean).length || 0
  const totalWc = currentBook.chapters.reduce((s,ch)=>s+(ch.content?.trim().split(/\s+/).filter(Boolean).length||0),0)

  return (
    <div className={`flex ${focusMode ? 'fixed inset-0 z-50 bg-gray-950' : 'h-[calc(100vh-64px)]'} overflow-hidden`}>
      {/* Sidebar */}
      {!focusMode && (
        <div className={`${sidebarOpen?'w-60':'w-0'} transition-all duration-200 overflow-hidden shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col`}>
          <div className="p-4 border-b border-gray-800 min-w-60">
            <button onClick={()=>setPage('books')} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs mb-3 transition-all">
              <BookOpen size={12}/> My Books
            </button>
            <h2 className="font-black text-white text-sm truncate">{currentBook.title}</h2>
            <p className="text-gray-500 text-xs mt-0.5">{totalWc.toLocaleString()} {t.write.words} total</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 min-w-60">
            {currentBook.chapters.map(ch => (
              <div key={ch.id} className={`group flex items-center rounded-xl mb-1 transition-all ${activeId===ch.id?'bg-amber-900/30 border border-amber-800':'hover:bg-gray-800 border border-transparent'}`}>
                <button onClick={()=>setActiveId(ch.id)} className="flex-1 text-left px-3 py-2.5 min-w-0">
                  {editingTitle===ch.id ? (
                    <input autoFocus value={ch.title}
                      onChange={e=>updateTitle(ch.id,e.target.value)}
                      onBlur={()=>setEditingTitle(null)}
                      onKeyDown={e=>e.key==='Enter'&&setEditingTitle(null)}
                      className="w-full bg-gray-700 text-white text-xs rounded px-1 py-0.5 focus:outline-none"
                      onClick={e=>e.stopPropagation()}/>
                  ) : (
                    <>
                      <p className={`text-xs font-semibold truncate ${activeId===ch.id?'text-amber-300':'text-gray-300'}`}>{ch.title||'Untitled'}</p>
                      <p className="text-gray-600 text-xs">{ch.content?.trim().split(/\s+/).filter(Boolean).length||0} {t.write.words}</p>
                    </>
                  )}
                </button>
                <div className="opacity-0 group-hover:opacity-100 flex shrink-0 pr-1 gap-0.5">
                  <button onClick={e=>{e.stopPropagation();setEditingTitle(ch.id)}} className="p-1 text-gray-500 hover:text-amber-400 rounded"><PenLine size={11}/></button>
                  {currentBook.chapters.length>1&&<button onClick={e=>{e.stopPropagation();deleteChapter(ch.id)}} className="p-1 text-gray-500 hover:text-red-400 rounded"><Trash2 size={11}/></button>}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-800 min-w-60">
            <button onClick={addChapter} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all">
              <Plus size={13}/> {t.write.addChapter}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar toggle */}
      {!focusMode && (
        <button onClick={()=>setSidebarOpen(!sidebarOpen)}
          className="absolute z-10 top-4 bg-gray-800 border border-gray-700 rounded-r-lg p-1 text-gray-400 hover:text-white"
          style={{left: sidebarOpen?'240px':'0', transition:'left 0.2s'}}>
          {sidebarOpen?<ChevronLeft size={13}/>:<ChevronRight size={13}/>}
        </button>
      )}

      {/* Editor pane */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
        {/* Toolbar */}
        <div className={`border-b border-gray-800 px-4 md:px-8 py-3 flex items-center justify-between bg-gray-900 ${focusMode?'opacity-0 hover:opacity-100 transition-opacity fixed top-0 left-0 right-0 z-50':''}`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-amber-400 text-sm font-bold truncate max-w-48">{active?.title||'Untitled'}</span>
            <span className="text-gray-600 text-xs hidden md:inline">· {currentBook.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">{wc.toLocaleString()} {t.write.words}</span>
            <button onClick={()=>setShowFR(!showFR)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-all" title={t.write.findReplace}><Search size={15}/></button>
            <button onClick={()=>setFocusMode(!focusMode)} className="text-gray-500 hover:text-amber-400 p-1.5 rounded-lg hover:bg-gray-800 transition-all" title={focusMode?t.write.exitFocus:t.write.focusMode}>
              {focusMode?<Minimize2 size={15}/>:<Maximize2 size={15}/>}
            </button>
            <span className="text-green-500 text-xs hidden md:inline">● {t.write.saved}</span>
          </div>
        </div>

        {/* Find & Replace bar */}
        {showFR && (
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-2 flex flex-wrap items-center gap-3">
            <input value={findText} onChange={e=>setFindText(e.target.value)} placeholder="Find..."
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-amber-500"/>
            <input value={replaceText} onChange={e=>setReplaceText(e.target.value)} placeholder="Replace with..."
              className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-amber-500"/>
            <button onClick={doReplace} className="bg-amber-500 text-gray-950 font-bold px-3 py-1.5 rounded-lg text-sm hover:bg-amber-400 transition-all">Replace All</button>
            <button onClick={()=>setShowFR(false)} className="text-gray-400 hover:text-white p-1 rounded transition-all"><X size={15}/></button>
          </div>
        )}

        {/* Chapter title */}
        <div className={`px-6 md:px-16 lg:px-32 pt-10 pb-2 ${focusMode?'mt-14':''}`}>
          <input value={active?.title||''} onChange={e=>updateTitle(activeId,e.target.value)}
            placeholder="Chapter title..."
            className="w-full text-3xl md:text-4xl font-black text-white bg-transparent border-none outline-none placeholder-gray-800"/>
        </div>

        {/* Writing area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-16 lg:px-32 pb-32">
          <textarea value={active?.content||''} onChange={e=>updateContent(activeId,e.target.value)}
            placeholder={t.write.placeholder}
            className="w-full min-h-[70vh] bg-transparent text-gray-200 text-lg leading-9 outline-none placeholder-gray-800 font-serif"
            style={{letterSpacing:'0.01em'}}/>
        </div>

        {/* Focus mode ESC hint */}
        {focusMode && (
          <div className="fixed bottom-6 right-6 text-gray-700 text-xs cursor-pointer hover:text-gray-400 transition-all" onClick={()=>setFocusMode(false)}>
            Press ESC or click to exit focus mode
          </div>
        )}
      </div>
    </div>
  )
}
