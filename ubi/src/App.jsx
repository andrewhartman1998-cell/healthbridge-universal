import React, { useState } from 'react'
import { LanguageProvider, useLang } from './i18n/LanguageContext.jsx'
import { useTranslation } from './i18n/translations.js'
import { LANGUAGES } from './i18n/translations.js'
import Landing from './pages/Landing.jsx'
import Calculator from './pages/Calculator.jsx'
import Policy from './pages/Policy.jsx'
import Countries from './pages/Countries.jsx'
import Advocate from './pages/Advocate.jsx'
import FAQ from './pages/FAQ.jsx'
import { Home, Calculator as CalcIcon, FileText, Globe, Megaphone, HelpCircle, Menu, X, ChevronDown } from 'lucide-react'

function Nav({ page, setPage }) {
  const { lang, setLang } = useLang()
  const t = useTranslation(lang)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const nav = [
    { id: 'home',       label: t.nav.home,       icon: Home },
    { id: 'calculator', label: t.nav.calculator,  icon: CalcIcon },
    { id: 'policy',     label: t.nav.policy,      icon: FileText },
    { id: 'countries',  label: t.nav.countries,   icon: Globe },
    { id: 'advocate',   label: t.nav.advocate,    icon: Megaphone },
    { id: 'faq',        label: t.nav.faq,         icon: HelpCircle },
  ]

  const currentLang = LANGUAGES.find(l => l.code === lang)

  return (
    <header className="bg-gray-900 border-b border-purple-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button onClick={() => setPage('home')} className="flex items-center gap-2 font-bold text-lg text-white shrink-0">
          <span className="text-2xl">💡</span>
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{t.appName}</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === id ? 'bg-purple-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700">
              🌐 {currentLang?.name} <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto w-52">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-800 ${lang === l.code ? 'text-purple-400 font-bold' : 'text-gray-300'}`}>
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4 grid grid-cols-3 gap-2 pt-3">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setPage(id); setMobileOpen(false) }}
              className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-medium ${page === id ? 'bg-purple-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <Icon size={18} />{label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

function AppInner() {
  const [page, setPage] = useState('home')
  const { lang } = useLang()
  const t = useTranslation(lang)

  const pages = { home: Landing, calculator: Calculator, policy: Policy, countries: Countries, advocate: Advocate, faq: FAQ }
  const PageComponent = pages[page] || Landing

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Nav page={page} setPage={setPage} />
      <main className="flex-1"><PageComponent setPage={setPage} /></main>
      <footer className="bg-gray-900 border-t border-gray-800 text-center py-5 text-gray-400 text-sm">
        <p className="mb-1">💡 {t.appName} — {t.tagline}</p>
        <p className="text-gray-600 text-xs">Inspired by Andrew Yang's Freedom Dividend vision. Built by Andrew Hartman. Free for all humanity.</p>
      </footer>
    </div>
  )
}

export default function App() {
  return <LanguageProvider><AppInner /></LanguageProvider>
}
