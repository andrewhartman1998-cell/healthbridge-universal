import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher({ compact = false }) {
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors shadow-sm"
        title="Change language"
      >
        <span className="text-base">{currentLang.flag}</span>
        {!compact && <span className="hidden sm:inline">{currentLang.nativeName}</span>}
        <span className="text-gray-400 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search languages..."
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); setSearch(""); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-blue-50 transition-colors text-left ${
                  lang === l.code ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{l.nativeName}</p>
                  <p className="text-xs text-gray-400 truncate">{l.name}</p>
                </div>
                {lang === l.code && <span className="text-blue-600 text-xs">✓</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No languages found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
