import React, { useState } from 'react'
import { User, Save, CheckCircle } from 'lucide-react'

const SKILLS_LIST = ['Customer Service', 'Cooking/Food Prep', 'Cleaning/Janitorial', 'Construction/Labor', 'Driving', 'Warehouse/Logistics', 'Landscaping', 'Retail/Cashier', 'Caregiving', 'Security', 'Data Entry', 'Social Media', 'Painting', 'Electrical (Basic)', 'Plumbing (Basic)', 'Childcare', 'Animal Care', 'Art/Design', 'Music', 'Teaching/Tutoring']

export default function MyProfile() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    display_name: '', city: '', state: '',
    situation: 'Currently Unhoused',
    seeking: [],
    skills: [],
    work_preference: '',
    has_id: true, has_phone: false,
    transportation: 'Public Transit',
    languages: '',
    notes: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
    }))
  }

  const toggleSeeking = (val) => {
    setForm(f => ({
      ...f,
      seeking: f.seeking.includes(val) ? f.seeking.filter(s => s !== val) : [...f.seeking, val]
    }))
  }

  const handleSave = () => {
    // In a real app this would save to the BridgeUserProfile entity
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 My Profile</h1>
        <p className="text-gray-500">Tell us about yourself so we can show you the most relevant jobs and housing. Your information is private and never shared without your permission.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Basic info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name (optional — can be a first name or nickname)</label>
          <input value={form.display_name} onChange={e => set('display_name', e.target.value)}
            placeholder="e.g. Marcus or just 'M'"
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
            <input value={form.city} onChange={e => set('city', e.target.value)}
              placeholder="Chicago"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
            <input value={form.state} onChange={e => set('state', e.target.value)}
              placeholder="IL"
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
        </div>

        {/* Current situation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">My current situation</label>
          {['Currently Unhoused', 'Transitional Housing', 'At-Risk of Homelessness', 'Stably Housed — Seeking Work', 'Other'].map(s => (
            <label key={s} className={`flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer border transition-all ${form.situation === s ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}>
              <input type="radio" name="situation" value={s} checked={form.situation === s}
                onChange={() => set('situation', s)} className="accent-green-600" />
              <span className="text-sm text-gray-700">{s}</span>
            </label>
          ))}
        </div>

        {/* What I need */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">I'm looking for</label>
          <div className="flex gap-3 flex-wrap">
            {['Employment', 'Housing', 'Both'].map(v => (
              <label key={v} className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer border transition-all text-sm ${form.seeking.includes(v) ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:border-green-400'}`}>
                <input type="checkbox" checked={form.seeking.includes(v)} onChange={() => toggleSeeking(v)} className="hidden" />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">My skills (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {SKILLS_LIST.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.skills.includes(skill) ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Practical info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Practical information</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.has_id} onChange={e => set('has_id', e.target.checked)} className="accent-green-600 w-4 h-4" />
              <span className="text-sm text-gray-600">I have a government-issued ID</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.has_phone} onChange={e => set('has_phone', e.target.checked)} className="accent-green-600 w-4 h-4" />
              <span className="text-sm text-gray-600">I have access to a phone</span>
            </label>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Transportation</label>
            <select value={form.transportation} onChange={e => set('transportation', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              {['None', 'Public Transit', 'Own Vehicle', 'Bicycle'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Anything else you want to share (optional)</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            rows={3} placeholder="Any special circumstances, preferences, or needs..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>

        <button onClick={handleSave}
          className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-all flex items-center justify-center gap-2">
          {saved ? <><CheckCircle size={18} /> Profile Saved!</> : <><Save size={18} /> Save Profile</>}
        </button>

        <p className="text-xs text-gray-400 text-center">Your profile is only used to personalize your results. It is never sold or shared.</p>
      </div>
    </div>
  )
}
