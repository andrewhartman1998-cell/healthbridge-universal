import { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES, t, getDir, detectBrowserLanguage } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("ct_lang") || detectBrowserLanguage());

  useEffect(() => {
    localStorage.setItem("ct_lang", lang);
    document.documentElement.dir = getDir(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const translate = (key) => t(lang, key);
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translate, currentLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
