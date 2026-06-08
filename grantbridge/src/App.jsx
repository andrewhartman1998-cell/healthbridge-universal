import React, { useState } from 'react'
import Landing from './pages/Landing.jsx'
import FindGrants from './pages/FindGrants.jsx'
import ApplyWizard from './pages/ApplyWizard.jsx'
import Tracker from './pages/Tracker.jsx'
import Resources from './pages/Resources.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { Home, Search, FileText, BarChart2, BookOpen, LayoutDashboard, Menu, X } from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { id:'home',     label:'Home',          icon:Home },
    { id:'find',     label:'Find Grants',   icon:Search },
    { id:'apply',    label:'Apply Wizard',  icon:FileText },
    { id:'tracker',  label:'My Tracker',   icon:BarChart2 },
    { id:'resources',label:'Resources',     icon:BookOpen },
    { id:'admin',    label:'Admin',         icon:LayoutDashboard },
  ]

  const pages = { home:Landing, find:FindGrants, apply:ApplyWizard, tracker:Tracker, resources:Resources, admin:AdminDashboard }
  const PageComponent = pages[page] || Landing

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage('home')} className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🏛️</span>
            <span>GrantBridge</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setPage(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === id ? 'bg-white text-indigo-700' : 'hover:bg-indigo-600 text-white'}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-indigo-800 px-4 pb-4 grid grid-cols-2 gap-2">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setPage(id); setMobileOpen(false) }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${page === id ? 'bg-white text-indigo-700' : 'text-white hover:bg-indigo-600'}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
        )}
      </header>
      <main className="flex-1"><PageComponent setPage={setPage} /></main>
      <footer className="bg-indigo-900 text-indigo-100 text-center py-4 text-sm">
        🏛️ GrantBridge — Free grant access for every nonprofit on Earth. &nbsp;|&nbsp; Built by Andrew Hartman
      </footer>
    </div>
  )
}
