import React, { useState } from 'react'
import { LayoutDashboard, Search, FileText, BarChart2, BookOpen, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label:'Grants Listed', value:'10', icon:Search, color:'text-indigo-600 bg-indigo-50' },
    { label:'Resource Guides', value:'5', icon:BookOpen, color:'text-purple-600 bg-purple-50' },
    { label:'Wizard Steps', value:'6', icon:FileText, color:'text-green-600 bg-green-50' },
    { label:'Active Trackers', value:'3', icon:BarChart2, color:'text-orange-600 bg-orange-50' },
  ]

  const tabs = [
    { id:'overview', label:'Overview', icon:LayoutDashboard },
    { id:'grants', label:'Grants DB', icon:Search },
    { id:'resources', label:'Resources', icon:BookOpen },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">⚙️ Admin Dashboard</h1>
        <p className="text-gray-500">Manage the GrantBridge grants database, resources, and platform content.</p>
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${s.color}`}><s.icon size={20} /></div>
                <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <h2 className="font-bold text-indigo-800 mb-2">🏛️ Mission</h2>
            <p className="text-indigo-700 text-sm leading-relaxed">GrantBridge exists to eliminate the funding gap caused by complexity. Every nonprofit — regardless of size, experience, or resources — deserves equal access to the grants that fund their mission. This platform is and will always be completely free.</p>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Manage {tabs.find(t=>t.id===activeTab)?.label}</h2>
            <button className="flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-800"><Plus size={16} /> Add New</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-gray-400">
            <p className="text-sm">Connect to the database entities to manage live content here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
