import React, { useState } from 'react'
import { BarChart2, Plus, Trash2, Edit, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

const STATUS_CONFIG = {
  'Researching':  { color:'bg-gray-100 text-gray-700',    icon:Clock },
  'Writing':      { color:'bg-blue-100 text-blue-700',    icon:Edit },
  'Submitted':    { color:'bg-yellow-100 text-yellow-700',icon:Clock },
  'Under Review': { color:'bg-purple-100 text-purple-700',icon:Clock },
  'Awarded ✅':   { color:'bg-green-100 text-green-700',  icon:CheckCircle },
  'Declined ❌':  { color:'bg-red-100 text-red-700',      icon:XCircle },
  'Follow-Up':    { color:'bg-orange-100 text-orange-700',icon:AlertCircle },
}

const SAMPLE = [
  { id:1, grant:'USDA Community Facilities Grant', funder:'USDA', amount:'$25,000', deadline:'2026-08-01', status:'Writing', notes:'Need to include letters of support from 3 community partners.' },
  { id:2, grant:'Bank of America Foundation Grant', funder:'Bank of America', amount:'$50,000', deadline:'2026-07-15', status:'Submitted', notes:'LOI submitted June 1. Awaiting invitation for full application.' },
  { id:3, grant:'Local Community Foundation', funder:'Chicago Community Foundation', amount:'$10,000', deadline:'2026-09-30', status:'Researching', notes:'Application opens August 1. Need 990 from 2024.' },
]

export default function Tracker() {
  const [grants, setGrants] = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [newGrant, setNewGrant] = useState({ grant:'', funder:'', amount:'', deadline:'', status:'Researching', notes:'' })

  const addGrant = () => {
    if (!newGrant.grant) return
    setGrants(g => [...g, { ...newGrant, id: Date.now() }])
    setNewGrant({ grant:'', funder:'', amount:'', deadline:'', status:'Researching', notes:'' })
    setShowForm(false)
  }

  const removeGrant = (id) => setGrants(g => g.filter(x => x.id !== id))
  const updateStatus = (id, status) => setGrants(g => g.map(x => x.id === id ? { ...x, status } : x))

  const totalAwarded = grants.filter(g => g.status === 'Awarded ✅').reduce((sum, g) => {
    const n = parseFloat(g.amount.replace(/[$,]/g,''))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 My Grant Tracker</h1>
          <p className="text-gray-500">Track every grant in one place. Never miss a deadline.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-800">
          <Plus size={16} /> Add Grant
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries({ 'Total Tracked': grants.length, 'Submitted': grants.filter(g=>g.status==='Submitted'||g.status==='Under Review').length, 'Awarded': grants.filter(g=>g.status==='Awarded ✅').length, 'Total Awarded': `$${totalAwarded.toLocaleString()}` }).map(([k,v]) => (
          <div key={k} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700">{v}</div>
            <div className="text-xs text-gray-500 mt-1">{k}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 mb-5">
          <h3 className="font-bold text-gray-700 mb-4">Add New Grant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Grant Name *</label><input value={newGrant.grant} onChange={e=>setNewGrant(g=>({...g,grant:e.target.value}))} placeholder="USDA Community Facilities Grant" className={inputClass} /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Funder</label><input value={newGrant.funder} onChange={e=>setNewGrant(g=>({...g,funder:e.target.value}))} placeholder="USDA" className={inputClass} /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Grant Amount</label><input value={newGrant.amount} onChange={e=>setNewGrant(g=>({...g,amount:e.target.value}))} placeholder="$25,000" className={inputClass} /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Deadline</label><input type="date" value={newGrant.deadline} onChange={e=>setNewGrant(g=>({...g,deadline:e.target.value}))} className={inputClass} /></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Status</label><select value={newGrant.status} onChange={e=>setNewGrant(g=>({...g,status:e.target.value}))} className={inputClass}>{Object.keys(STATUS_CONFIG).map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label><input value={newGrant.notes} onChange={e=>setNewGrant(g=>({...g,notes:e.target.value}))} placeholder="Any notes..." className={inputClass} /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addGrant} className="bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-800">Save</button>
            <button onClick={() => setShowForm(false)} className="border border-gray-200 px-5 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Grant list */}
      <div className="grid gap-4">
        {grants.map(g => {
          const cfg = STATUS_CONFIG[g.status] || STATUS_CONFIG['Researching']
          const StatusIcon = cfg.icon
          const daysLeft = g.deadline ? Math.ceil((new Date(g.deadline) - new Date()) / 86400000) : null
          return (
            <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-bold text-gray-800">{g.grant}</h2>
                  <p className="text-gray-500 text-sm">{g.funder} · {g.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${cfg.color}`}><StatusIcon size={12} />{g.status}</span>
                  <button onClick={() => removeGrant(g.id)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              {g.deadline && (
                <div className={`text-xs mb-2 font-medium ${daysLeft < 7 ? 'text-red-600' : daysLeft < 30 ? 'text-orange-500' : 'text-gray-400'}`}>
                  📅 Deadline: {new Date(g.deadline).toLocaleDateString()} {daysLeft !== null && `(${daysLeft > 0 ? `${daysLeft} days left` : 'Past due'})`}
                </div>
              )}
              {g.notes && <p className="text-gray-500 text-sm mb-3">{g.notes}</p>}
              <div className="flex flex-wrap gap-1">
                {Object.keys(STATUS_CONFIG).map(s => (
                  <button key={s} onClick={() => updateStatus(g.id, s)}
                    className={`text-xs px-2 py-1 rounded-full transition-all ${g.status === s ? STATUS_CONFIG[s].color + ' font-bold' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
        {grants.length === 0 && <div className="text-center py-12 text-gray-400"><BarChart2 size={40} className="mx-auto mb-3 opacity-30" /><p>No grants tracked yet. Add your first one!</p></div>}
      </div>
    </div>
  )
}
