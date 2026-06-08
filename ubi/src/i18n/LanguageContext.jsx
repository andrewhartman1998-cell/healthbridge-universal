import React, { createContext, useContext, useState, useEffect } from 'react'
import { LANGUAGES } from './translations.js'

const LangContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ubi_lang') || 'en')
  const isRTL = LANGUAGES.find(l => l.code === lang)?.rtl || false

  useEffect(() => {
    localStorage.setItem('ubi_lang', lang)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  return <LangContext.Provider value={{ lang, setLang, isRTL }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
