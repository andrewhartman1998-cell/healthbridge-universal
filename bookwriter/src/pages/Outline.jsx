import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT } from '../i18n/langs.js'

export default function Outline({ books, setBooks, currentBook, setCurrentBook, setPage }) {
  const { lang } = useLang()
  const t = useT(lang)
  const [openActs, setOpenActs] = useState({})

  if (!currentBook) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="text-6xl">📋</div>
      <p className="text-gray-300 text-xl font-bold">No book selected</p>
      <button onClick={()=>setPage('books')} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl">Open a Book</button>
    </div>
  )

  const save = (outline) => {
    const updated = {...currentBook, outline, updatedAt:new Date().toISOString()}
    const all = books.map(b=>b.id===updated.id?updated:b)
    setBooks(all); setCurrentBook(updated)
    localStorage.setItem('bw_books', JSON.stringify(all))
  }

  const ol = currentBook.outline || {synopsis:'', acts:[]}

  const addAct = () => save({...ol, acts:[...(ol.acts||[]), {id:Date.now().toString(), title:`${t.outline.actTitle} ${(ol.acts?.length||0)+1}`, scenes:[]}]})
  const deleteAct = id => save({...ol, acts:ol.acts.filter(a=>a.id!==id)})
  const updateActTitle = (id,title) => save({...ol, acts:ol.acts.map(a=>a.id===id?{...a,title}:a)})
  const addScene = actId => save({...ol, acts:ol.acts.map(a=>a.id===actId?{...a,scenes:[...a.scenes,{id:Date.now().toString(),title:`${t.outline.sceneTitle} ${a.scenes.length+1}`,notes:''}]}:a)})
  const deleteScene = (actId,sceneId) => save({...ol, acts:ol.acts.map(a=>a.id===actId?{...a,scenes:a.scenes.filter(s=>s.id!==sceneId)}:a)})
  const updateScene = (actId,sceneId,field,val) => save({...ol, acts:ol.acts.map(a=>a.id===actId?{...a,scenes:a.scenes.map(s=>s.id===sceneId?{...s,[field]:val}:s)}:a)})
  const toggle = id => setOpenActs(p=>({...p,[id]:!p[id]}))

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">{t.outline.title}</h1>
        <p className="text-amber-400 text-sm font-semibold mt-1">📖 {currentBook.title}</p>
      </div>

      {/* Synopsis */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5 mb-6">
        <label className="block text-gray-400 font-bold text-sm mb-2">📝 {t.outline.synopsis}</label>
        <textarea value={ol.synopsis||''} rows={4} onChange={e=>save({...ol,synopsis:e.target.value})}
          placeholder="Write a 1–3 paragraph synopsis of your entire book. What happens? What's the core conflict? How does it end?"
          className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"/>
      </div>

      {/* Acts */}
      <div className="space-y-4 mb-6">
        {(ol.acts||[]).map(act => (
          <div key={act.id} className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-gray-800 bg-gray-800/50 cursor-pointer" onClick={()=>toggle(act.id)}>
              {openActs[act.id]===false?<ChevronRight size={16} className="text-gray-500 shrink-0"/>:<ChevronDown size={16} className="text-amber-400 shrink-0"/>}
              <input value={act.title} onClick={e=>e.stopPropagation()} onChange={e=>updateActTitle(act.id,e.target.value)}
                className="flex-1 bg-transparent text-white font-black text-base focus:outline-none"/>
              <span className="text-gray-600 text-xs shrink-0">{act.scenes.length} scenes</span>
              <button onClick={e=>{e.stopPropagation();deleteAct(act.id)}} className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-red-900/20 transition-all shrink-0"><Trash2 size={13}/></button>
            </div>
            {openActs[act.id]!==false && (
              <div className="p-3 space-y-2">
                {act.scenes.map(scene => (
                  <div key={scene.id} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <input value={scene.title} onChange={e=>updateScene(act.id,scene.id,'title',e.target.value)}
                        className="flex-1 bg-transparent text-white font-bold text-sm focus:outline-none"/>
                      <button onClick={()=>deleteScene(act.id,scene.id)} className="p-1 text-gray-600 hover:text-red-400 rounded transition-all shrink-0"><Trash2 size={11}/></button>
                    </div>
                    <textarea value={scene.notes||''} rows={2} onChange={e=>updateScene(act.id,scene.id,'notes',e.target.value)}
                      placeholder={t.outline.notesPlaceholder}
                      className="w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-lg px-3 py-2 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"/>
                  </div>
                ))}
                <button onClick={()=>addScene(act.id)} className="w-full py-2 text-xs text-amber-400 font-bold hover:bg-amber-900/20 rounded-xl border border-dashed border-amber-800 transition-all flex items-center justify-center gap-1.5">
                  <Plus size={13}/> {t.outline.addScene}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={addAct} className="w-full py-3 text-sm text-amber-400 font-bold hover:bg-amber-900/20 rounded-2xl border-2 border-dashed border-amber-800 transition-all flex items-center justify-center gap-2">
        <Plus size={16}/> {t.outline.addAct}
      </button>
    </div>
  )
}
