import { useState, useEffect } from "react";
import { CrimeReport, Suspect } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

export default function CaseConnections() {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [relatedCases, setRelatedCases] = useState([]);
  const [relatedSuspects, setRelatedSuspects] = useState([]);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([CrimeReport.list(), Suspect.list()]);
      setCases(c); setSuspects(s);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const analyzeConnections = (c) => {
    setSelectedCase(c);
    // Find related cases by: same crime type, same location, same officer, same dept
    const related = cases.filter(x => x.id !== c.id && (
      (c.crime_type && x.crime_type === c.crime_type) ||
      (c.location_city && x.location_city === c.location_city) ||
      (c.assigned_officer_name && x.assigned_officer_name === c.assigned_officer_name) ||
      (c.department && x.department === c.department) ||
      (c.tags?.some(tag => x.tags?.includes(tag)))
    ));
    setRelatedCases(related);

    // Find suspects linked to this case
    const linked = suspects.filter(s =>
      s.case_ids?.includes(c.id) ||
      (c.assigned_officer_name && s.notes?.includes(c.case_number)) ||
      (c.crime_type === "homicide" && s.threat_level === "extreme") ||
      (c.location_city && s.last_known_location?.includes(c.location_city))
    );
    setRelatedSuspects(linked);
  };

  const filtered = cases.filter(c => !searchQ ||
    c.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.case_number?.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.crime_type?.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🧠 Case Connection Engine</h1>
        <p className="text-slate-400 text-sm mt-0.5">Identify links between cases, suspects, locations and patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case selector */}
        <div>
          <h2 className="text-white font-bold mb-3">Select a Case to Analyze</h2>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search cases..."
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map(c => (
                <button key={c.id} onClick={() => analyzeConnections(c)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCase?.id === c.id ? "bg-blue-900/30 border-blue-500" : "bg-slate-800 border-slate-700 hover:border-slate-500"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-400 text-xs font-mono">{c.case_number}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.priority === "critical" ? "bg-red-600 text-white" : c.priority === "high" ? "bg-orange-500 text-white" : "bg-slate-600 text-white"}`}>{c.priority}</span>
                  </div>
                  <p className="text-white text-sm font-semibold">{c.title || "Untitled"}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{c.crime_type?.replace("_"," ")} · {c.location_city}, {c.location_country}</p>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No cases found.</p>}
            </div>
          )}
        </div>

        {/* Connection results */}
        <div>
          {!selectedCase ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center text-slate-400">
              <div className="text-4xl mb-3">🧠</div>
              <p className="font-medium">Select a case on the left</p>
              <p className="text-sm mt-1">The engine will find all connections — suspects, related cases, location patterns, and shared officers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected case */}
              <div className="bg-blue-900/20 border border-blue-600/40 rounded-2xl p-4">
                <p className="text-blue-400 text-xs font-bold mb-1">🔍 ANALYZING</p>
                <p className="text-white font-bold">{selectedCase.title}</p>
                <p className="text-slate-400 text-xs">{selectedCase.case_number} · {selectedCase.crime_type?.replace("_"," ")} · {selectedCase.location_city}</p>
              </div>

              {/* Related suspects */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-3">👤 Linked Suspects ({relatedSuspects.length})</h3>
                {relatedSuspects.length === 0 ? (
                  <p className="text-slate-500 text-sm">No direct suspect links found.</p>
                ) : (
                  <div className="space-y-2">
                    {relatedSuspects.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
                        <div className="w-9 h-9 bg-red-900 rounded-lg flex items-center justify-center text-white font-bold shrink-0">{s.full_name?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{s.full_name}</p>
                          <p className="text-slate-400 text-xs capitalize">{s.status?.replace("_"," ")} · {s.threat_level} threat</p>
                        </div>
                        {s.interpol_notice && <span className="text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded-full shrink-0">INTERPOL</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related cases */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-3">📁 Connected Cases ({relatedCases.length})</h3>
                {relatedCases.length === 0 ? (
                  <p className="text-slate-500 text-sm">No connected cases found.</p>
                ) : (
                  <div className="space-y-2">
                    {relatedCases.slice(0,6).map(c => (
                      <div key={c.id} className="p-3 bg-slate-700/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-slate-400 text-xs font-mono">{c.case_number}</span>
                          <span className="text-slate-400 text-xs">·</span>
                          <span className="text-slate-300 text-xs capitalize">{c.crime_type?.replace("_"," ")}</span>
                        </div>
                        <p className="text-white text-sm font-medium">{c.title}</p>
                        <div className="flex gap-3 mt-1 text-xs text-slate-500">
                          {c.location_city === selectedCase.location_city && <span className="text-yellow-400">📍 Same city</span>}
                          {c.crime_type === selectedCase.crime_type && <span className="text-orange-400">🔍 Same crime type</span>}
                          {c.assigned_officer_name === selectedCase.assigned_officer_name && selectedCase.assigned_officer_name && <span className="text-blue-400">👮 Same officer</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pattern summary */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-2">📊 Pattern Analysis</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-blue-400">•</span>
                    <span>{relatedCases.filter(c => c.location_city === selectedCase.location_city).length} cases in same city ({selectedCase.location_city})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-orange-400">•</span>
                    <span>{relatedCases.filter(c => c.crime_type === selectedCase.crime_type).length} cases with same crime type</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-purple-400">•</span>
                    <span>{relatedSuspects.filter(s => s.interpol_notice).length} INTERPOL-flagged suspects linked</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-red-400">•</span>
                    <span>{relatedSuspects.filter(s => s.threat_level === "extreme" || s.threat_level === "high").length} high/extreme threat suspects involved</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
