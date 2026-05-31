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
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-purple-200 bg-white/80 hover:bg-purple-50 text-sm font-medium text-purple-700 transition-colors">
        <span>{currentLang.flag}</span>
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input type="text" placeholder="Search languages..." autoFocus
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map(l => (
              <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); setSearch(""); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-purple-50 text-left ${lang === l.code ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700"}`}>
                <span>{l.flag}</span>
                <span className="truncate">{l.nativeName}</span>
                {lang === l.code && <span className="ml-auto text-purple-500 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
