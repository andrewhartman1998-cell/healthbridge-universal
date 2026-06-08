import React, { useState } from 'react'
import { LayoutDashboard, Search, Sprout, Apple, Globe, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label:'Food Resources Listed', value:'10', icon:Search, color:'text-orange-600 bg-orange-50' },
    { label:'Community Gardens', value:'6', icon:Sprout, color:'text-green-600 bg-green-50' },
    { label:'Nutrition Guides', value:'5', icon:Apple, color:'text-red-600 bg-red-50' },
    { label:'Global Regions Covered', value:'8', icon:Globe, color:'text-blue-600 bg-blue-50' },
  ]

  const tabs = [
    { id:'overview', label:'Overview', icon:LayoutDashboard },
    { id:'food', label:'Food Resources', icon:Search },
    { id:'gardens', label:'Gardens', icon:Sprout },
    { id:'nutrition', label:'Nutrition', icon:Apple },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">⚙️ Admin Dashboard</h1>
        <p className="text-gray-500">Manage all food resources, gardens, and nutrition content on FoodAccess Global.</p>
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h2 className="font-bold text-green-800 mb-2">🌱 Mission</h2>
            <p className="text-green-700 text-sm leading-relaxed">FoodAccess Global exists to ensure every person on Earth can find free or affordable healthy food, regardless of location, income, language, or documentation status. This platform is 100% free and open to all.</p>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Manage {tabs.find(t=>t.id===activeTab)?.label}</h2>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700">
              <Plus size={16} /> Add New
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center text-gray-400">
            <p className="text-sm">Connect to the database entities to manage live content here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
