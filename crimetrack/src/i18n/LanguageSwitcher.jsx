import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang, currentLang, LANGUAGES } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors border border-slate-600">
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <span className="text-xs opacity-60">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-700">
            <input type="text" placeholder="Search languages..." autoFocus
              className="w-full px-2 py-1.5 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map(l => (
              <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); setSearch(""); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-left transition-colors ${lang === l.code ? "bg-slate-700 text-blue-400 font-medium" : "text-slate-300"}`}>
                <span>{l.flag}</span>
                <span className="truncate">{l.nativeName}</span>
                {lang === l.code && <span className="ml-auto text-blue-400 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
