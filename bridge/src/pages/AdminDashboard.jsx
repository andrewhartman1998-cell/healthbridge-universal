import React, { useState } from 'react'
import { LayoutDashboard, Briefcase, Building2, HeartHandshake, Plus, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showJobForm, setShowJobForm] = useState(false)
  const [showHousingForm, setShowHousingForm] = useState(false)
  const [showResourceForm, setShowResourceForm] = useState(false)

  const stats = [
    { label: 'Active Job Listings', value: '6', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { label: 'Housing Listings', value: '6', icon: Building2, color: 'text-purple-600 bg-purple-50' },
    { label: 'Support Resources', value: '10', icon: HeartHandshake, color: 'text-orange-600 bg-orange-50' },
    { label: 'Users Helped (Est.)', value: '—', icon: Users, color: 'text-green-600 bg-green-50' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'housing', label: 'Housing', icon: Building2 },
    { id: 'resources', label: 'Resources', icon: HeartHandshake },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">⚙️ Admin Dashboard</h1>
        <p className="text-gray-500">Manage all listings and resources on Bridge to Stability.</p>
      </div>

      {/* Tab nav */}
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
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h2 className="font-bold text-green-800 mb-2">🌉 Mission Statement</h2>
            <p className="text-green-700 text-sm leading-relaxed">
              Bridge to Stability exists to provide nonviolent individuals experiencing homelessness and members of underserved communities with direct, barrier-free access to stable employment and safe housing. Every listing on this platform is reviewed to ensure it is inclusive, honest, and serves people's real needs. This platform is free — always.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Job Listings</h2>
            <button onClick={() => setShowJobForm(!showJobForm)}
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-800 transition-all">
              <Plus size={16} /> Add Job Listing
            </button>
          </div>

          {showJobForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
              <h3 className="font-bold text-gray-700 mb-4">New Job Listing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[['Job Title', 'title'], ['Employer Name', 'employer_name'], ['Pay Rate', 'pay_rate'], ['City', 'location_city']].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder={label} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Describe the role, requirements, and what makes it barrier-friendly..." />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-800">Save Listing</button>
                <button onClick={() => setShowJobForm(false)} className="border border-gray-200 px-5 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">6 active job listings. Connect to the BridgeJobListing database entity to manage live data.</p>
          </div>
        </div>
      )}

      {activeTab === 'housing' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Housing Listings</h2>
            <button onClick={() => setShowHousingForm(!showHousingForm)}
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-800 transition-all">
              <Plus size={16} /> Add Housing Listing
            </button>
          </div>
          {showHousingForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
              <h3 className="font-bold text-gray-700 mb-4">New Housing Listing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[['Listing Title', 'title'], ['Provider Name', 'provider_name'], ['Cost', 'cost'], ['City', 'location_city']].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder={label} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-800">Save Listing</button>
                <button onClick={() => setShowHousingForm(false)} className="border border-gray-200 px-5 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">6 active housing listings. Connect to the BridgeHousingListing database entity to manage live data.</p>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Support Resources</h2>
            <button onClick={() => setShowResourceForm(!showResourceForm)}
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-800 transition-all">
              <Plus size={16} /> Add Resource
            </button>
          </div>
          {showResourceForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
              <h3 className="font-bold text-gray-700 mb-4">New Resource</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[['Resource Name', 'name'], ['Provider', 'provider'], ['Phone', 'phone'], ['City', 'city']].map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder={label} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-800">Save Resource</button>
                <button onClick={() => setShowResourceForm(false)} className="border border-gray-200 px-5 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">10 active support resources listed. Connect to the BridgeResource database entity to manage live data.</p>
          </div>
        </div>
      )}
    </div>
  )
}
