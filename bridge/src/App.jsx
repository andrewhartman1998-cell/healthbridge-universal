import React, { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Jobs from './pages/Jobs.jsx'
import Housing from './pages/Housing.jsx'
import Resources from './pages/Resources.jsx'
import MyProfile from './pages/MyProfile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { Home, Briefcase, Building2, HeartHandshake, User, LayoutDashboard, Menu, X } from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { id: 'home',      label: 'Home',      icon: Home },
    { id: 'jobs',      label: 'Find Work',  icon: Briefcase },
    { id: 'housing',   label: 'Find Housing', icon: Building2 },
    { id: 'resources', label: 'Resources',  icon: HeartHandshake },
    { id: 'profile',   label: 'My Profile', icon: User },
    { id: 'admin',     label: 'Admin',      icon: LayoutDashboard },
  ]

  const pages = { home: Landing, jobs: Jobs, housing: Housing, resources: Resources, profile: MyProfile, admin: AdminDashboard }
  const PageComponent = pages[page] || Landing

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage('home')} className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🌉</span>
            <span>Bridge to Stability</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  page === id ? 'bg-white text-green-700' : 'hover:bg-green-600 text-white'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-green-800 px-4 pb-4 grid grid-cols-2 gap-2">
            {nav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setPage(id); setMobileOpen(false) }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  page === id ? 'bg-white text-green-700' : 'text-white hover:bg-green-600'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <PageComponent setPage={setPage} />
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 text-center py-4 text-sm">
        🌉 Bridge to Stability — Free for everyone. Always. &nbsp;|&nbsp; Built with ❤️ by Andrew Hartman
      </footer>
    </div>
  )
}
