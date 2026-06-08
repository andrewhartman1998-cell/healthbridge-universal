import React, { createContext, useContext, useState, useEffect } from 'react'
import { LANGUAGES } from './langs.js'
const Ctx = createContext()
export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('bw_lang') || 'en')
  const isRTL = LANGUAGES.find(l => l.code === lang)?.rtl || false
  useEffect(() => {
    localStorage.setItem('bw_lang', lang)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])
  return <Ctx.Provider value={{ lang, setLang, isRTL }}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
