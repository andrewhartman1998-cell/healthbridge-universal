import React, { useState } from 'react'
import Landing from './pages/Landing.jsx'
import FindFood from './pages/FindFood.jsx'
import Gardens from './pages/Gardens.jsx'
import Nutrition from './pages/Nutrition.jsx'
import GlobalMap from './pages/GlobalMap.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { Home, Search, Sprout, Apple, Globe, LayoutDashboard, Menu, X } from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { id: 'home',      label: 'Home',         icon: Home },
    { id: 'findfood',  label: 'Find Food',     icon: Search },
    { id: 'gardens',   label: 'Community Gardens', icon: Sprout },
    { id: 'nutrition', label: 'Nutrition',     icon: Apple },
    { id: 'globalmap', label: 'Global Map',    icon: Globe },
    { id: 'admin',     label: 'Admin',         icon: LayoutDashboard },
  ]

  const pages = { home: Landing, findfood: FindFood, gardens: Gardens, nutrition: Nutrition, globalmap: GlobalMap, admin: AdminDashboard }
  const PageComponent = pages[page] || Landing

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage('home')} className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🌱</span>
            <span>FoodAccess Global</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setPage(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === id ? 'bg-white text-green-700' : 'hover:bg-green-500 text-white'}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-green-700 px-4 pb-4 grid grid-cols-2 gap-2">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setPage(id); setMobileOpen(false) }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${page === id ? 'bg-white text-green-700' : 'text-white hover:bg-green-600'}`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
        )}
      </header>
      <main className="flex-1"><PageComponent setPage={setPage} /></main>
      <footer className="bg-green-900 text-green-100 text-center py-4 text-sm">
        🌱 FoodAccess Global — Healthy food is a human right. &nbsp;|&nbsp; Built by Andrew Hartman
      </footer>
    </div>
  )
}
