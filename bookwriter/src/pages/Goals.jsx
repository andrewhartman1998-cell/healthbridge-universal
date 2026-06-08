import React, { useState } from 'react'
import { Target, Flame, PenLine, TrendingUp, CheckCircle } from 'lucide-react'
import { useLang } from '../i18n/LangContext.jsx'
import { useT } from '../i18n/langs.js'

export default function Goals({ books, setBooks, currentBook, setCurrentBook, setPage }) {
  const { lang } = useLang()
  const t = useT(lang)
  const [goalInput, setGoalInput] = useState('')

  if (!currentBook) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="text-6xl">🎯</div>
      <p className="text-gray-300 text-xl font-bold">No book selected</p>
      <button onClick={()=>setPage('books')} className="bg-amber-500 text-gray-950 font-bold px-6 py-2.5 rounded-xl">Open a Book</button>
    </div>
  )

  const goals = currentBook.goals || {daily:500, streak:0, todayWords:0, lastWrittenDate:'', totalWords:0}
  const today = new Date().toDateString()
  const totalWords = currentBook.chapters.reduce((s,ch)=>s+(ch.content?.trim().split(/\s+/).filter(Boolean).length||0),0)

  // Compute today's session words (simplified: total minus saved baseline)
  const todayWords = goals.lastWrittenDate === today ? (goals.todayWords||0) : 0
  const pct = Math.min(100, Math.round((todayWords/goals.daily)*100))
  const done = todayWords >= goals.daily

  const saveGoal = (newGoals) => {
    const updated = {...currentBook, goals:newGoals}
    const all = books.map(b=>b.id===updated.id?updated:b)
    setBooks(all); setCurrentBook(updated)
    localStorage.setItem('bw_books', JSON.stringify(all))
  }

  const setDaily = () => {
    const n = parseInt(goalInput)
    if (!n || n < 1) return
    saveGoal({...goals, daily:n})
    setGoalInput('')
  }

  const MILESTONES = [
    {words:1000,label:'First 1,000 words',emoji:'🌱'},
    {words:5000,label:'5,000 words',emoji:'📝'},
    {words:10000,label:'10,000 words',emoji:'🔥'},
    {words:25000,label:'25,000 words — Novella',emoji:'📖'},
    {words:50000,label:'50,000 words — NaNoWriMo',emoji:'🏆'},
    {words:80000,label:'80,000 words — Novel',emoji:'📚'},
    {words:100000,label:'100,000 words — Epic',emoji:'🌟'},
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">{t.goals.title}</h1>
        <p className="text-amber-400 text-sm font-semibold mt-1">📖 {currentBook.title}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {icon:PenLine, color:'text-amber-400', label:t.goals.totalWritten, val:totalWords.toLocaleString()},
          {icon:Flame,   color:'text-orange-400', label:t.goals.streak,       val:`${goals.streak} days`},
          {icon:Target,  color:'text-green-400',  label:t.goals.dailyGoal,    val:`${goals.daily} ${t.write.words}`},
          {icon:TrendingUp,color:'text-blue-400', label:'Chapters',           val:currentBook.chapters.length},
        ].map((s,i)=>(
          <div key={i} className="bg-gray-900 rounded-2xl border border-gray-700 p-4 text-center">
            <s.icon size={20} className={`${s.color} mx-auto mb-2`}/>
            <div className="text-2xl font-black text-white">{s.val}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Today's goal */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-lg">Today's Writing Goal</h2>
          {done && <span className="flex items-center gap-1.5 text-green-400 font-bold text-sm"><CheckCircle size={16}/> {t.goals.complete}</span>}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{todayWords.toLocaleString()} / {goals.daily.toLocaleString()} {t.write.words}</span>
            <span className="text-amber-400 font-bold">{pct}%</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${done?'bg-green-500':'bg-amber-500'}`} style={{width:`${pct}%`}}/>
          </div>
        </div>
        <p className="text-gray-500 text-xs">Write in the editor — your word count updates automatically.</p>
      </div>

      {/* Set goal */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5 mb-6">
        <h2 className="font-bold text-white mb-3">{t.goals.setGoal}</h2>
        <div className="flex gap-3">
          <input type="number" value={goalInput} onChange={e=>setGoalInput(e.target.value)} placeholder={`Current: ${goals.daily} words/day`}
            className="flex-1 bg-gray-800 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"/>
          <button onClick={setDaily} className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-5 py-2.5 rounded-xl transition-all">Save</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[250,500,1000,2000].map(n=>(
            <button key={n} onClick={()=>saveGoal({...goals,daily:n})}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${goals.daily===n?'bg-amber-500 text-gray-950':'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {n} words/day
            </button>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-5">
        <h2 className="font-black text-white mb-4">🏆 Writing Milestones</h2>
        <div className="space-y-2">
          {MILESTONES.map(m => {
            const achieved = totalWords >= m.words
            const pctM = Math.min(100, Math.round((totalWords/m.words)*100))
            return (
              <div key={m.words} className={`flex items-center gap-3 p-3 rounded-xl border ${achieved?'border-green-700 bg-green-900/20':'border-gray-700 bg-gray-800'}`}>
                <span className={`text-2xl ${achieved?'':'grayscale opacity-40'}`}>{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-bold ${achieved?'text-green-300':'text-gray-300'}`}>{m.label}</span>
                    <span className="text-xs text-gray-500">{m.words.toLocaleString()} words</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${achieved?'bg-green-500':'bg-amber-500'}`} style={{width:`${pctM}%`}}/>
                  </div>
                </div>
                {achieved && <CheckCircle size={16} className="text-green-400 shrink-0"/>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
