import { useState, useEffect } from "react";
import { Suspect, CrimeReport } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const THREAT_COLORS = {
  extreme: "border-red-500 bg-red-900/20",
  high: "border-orange-500 bg-orange-900/20",
  medium: "border-yellow-500 bg-yellow-900/20",
  low: "border-green-500 bg-green-900/20",
};

const THREAT_BADGE = {
  extreme: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-600 text-white",
};

export default function ActivePursuit() {
  const { t } = useLanguage();
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateForm, setUpdateForm] = useState({ last_known_location: "", status: "", notes: "", threat_level: "" });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("active");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const all = await Suspect.list();
      setSuspects(all);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateSuspect = async () => {
    setSaving(true);
    try {
      const updates = {};
      if (updateForm.last_known_location) updates.last_known_location = updateForm.last_known_location;
      if (updateForm.status) updates.status = updateForm.status;
      if (updateForm.threat_level) updates.threat_level = updateForm.threat_level;
      if (updateForm.notes) updates.notes = (selected.notes ? selected.notes + "\n" : "") + `[${new Date().toLocaleString()}] ${updateForm.notes}`;
      await Suspect.update(selected.id, updates);
      setShowUpdate(false);
      setSelected(null);
      setUpdateForm({ last_known_location: "", status: "", notes: "", threat_level: "" });
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const filtered = suspects.filter(s => {
    if (filter === "active") return s.status === "at_large" || s.status === "wanted";
    if (filter === "interpol") return s.interpol_notice;
    if (filter === "extreme") return s.threat_level === "extreme";
    return true;
  });

  const stats = {
    atLarge: suspects.filter(s => s.status === "at_large").length,
    wanted: suspects.filter(s => s.status === "wanted").length,
    extreme: suspects.filter(s => s.threat_level === "extreme").length,
    interpol: suspects.filter(s => s.interpol_notice).length,
    captured: suspects.filter(s => s.status === "in_custody").length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h1 className="text-2xl font-bold text-white">🔴 Active Pursuit Tracker</h1>
        </div>
        <p className="text-slate-400 text-sm">Real-time tracking of wanted suspects and active hunts worldwide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "At Large", val: stats.atLarge, color: "from-red-700 to-red-800", icon: "🚨" },
          { label: "Wanted", val: stats.wanted, color: "from-orange-600 to-orange-700", icon: "⚠️" },
          { label: "Extreme Threat", val: stats.extreme, color: "from-red-900 to-slate-800", icon: "💀" },
          { label: "INTERPOL", val: stats.interpol, color: "from-purple-700 to-purple-800", icon: "🌍" },
          { label: "Captured", val: stats.captured, color: "from-green-700 to-green-800", icon: "✅" },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.val}</p>
            <p className="text-white/70 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { id: "active", label: "🚨 Active Hunts" },
          { id: "extreme", label: "💀 Extreme Threat" },
          { id: "interpol", label: "🌍 INTERPOL" },
          { id: "all", label: "👤 All Suspects" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.id ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><div className="text-4xl mb-3">✅</div><p>No active pursuits in this category.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className={`border-2 rounded-2xl p-5 transition-all hover:scale-[1.01] ${THREAT_COLORS[s.threat_level] || "border-slate-600 bg-slate-800"}`}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-900 to-slate-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0 border border-red-700/40">
                  {s.full_name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{s.full_name}</h3>
                  {s.alias && <p className="text-slate-400 text-xs">aka "{s.alias}"</p>}
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${THREAT_BADGE[s.threat_level] || "bg-slate-600 text-white"}`}>
                      {s.threat_level?.toUpperCase()} THREAT
                    </span>
                    {s.interpol_notice && <span className="text-xs bg-purple-900 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-full">🌍 INTERPOL</span>}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 ${s.status === "at_large" ? "bg-red-900/40 border border-red-700/30" : s.status === "wanted" ? "bg-orange-900/40 border border-orange-700/30" : s.status === "in_custody" ? "bg-green-900/40 border border-green-700/30" : "bg-slate-700"}`}>
                <div className={`w-2 h-2 rounded-full ${s.status === "at_large" || s.status === "wanted" ? "bg-red-400 animate-pulse" : "bg-green-400"}`} />
                <span className="text-white text-sm font-semibold capitalize">{s.status?.replace("_", " ").toUpperCase()}</span>
              </div>

              {/* Intel */}
              <div className="space-y-1.5 mb-3">
                {s.last_known_location && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-red-400">📍</span>
                    <span className="font-medium">Last Seen:</span>
                    <span className="text-white">{s.last_known_location}</span>
                  </div>
                )}
                {s.nationality && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>🌍</span><span className="font-medium">Nationality:</span><span>{s.nationality}</span>
                  </div>
                )}
                {s.charges && (
                  <div className="text-xs text-red-300 bg-red-900/20 rounded-lg px-2 py-1.5 border border-red-800/30">
                    ⚖️ {s.charges.slice(0, 80)}{s.charges.length > 80 ? "..." : ""}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button onClick={() => { setSelected(s); setUpdateForm({ last_known_location: s.last_known_location || "", status: s.status, notes: "", threat_level: s.threat_level }); setShowUpdate(true); }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors">
                  📡 Update Intel
                </button>
                {s.status !== "in_custody" && (
                  <button onClick={async () => { await Suspect.update(s.id, { status: "in_custody" }); load(); }}
                    className="flex-1 py-2 bg-green-700 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors">
                    🔒 Mark Captured
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {showUpdate && selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-red-700/40 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-white font-bold text-lg mb-1">📡 Update Intel</h2>
            <p className="text-red-400 text-sm mb-5 font-medium">{selected.full_name}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">New Last Known Location</label>
                <input value={updateForm.last_known_location} onChange={e => setUpdateForm({...updateForm, last_known_location: e.target.value})}
                  placeholder="City, Country or coordinates"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Update Status</label>
                <select value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  {["at_large","wanted","in_custody","cleared","deceased"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Threat Level</label>
                <select value={updateForm.threat_level} onChange={e => setUpdateForm({...updateForm, threat_level: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  {["extreme","high","medium","low"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Intelligence Note</label>
                <textarea rows={3} value={updateForm.notes} onChange={e => setUpdateForm({...updateForm, notes: e.target.value})}
                  placeholder="New field intelligence, sightings, tips..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowUpdate(false)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-700">Cancel</button>
              <button onClick={updateSuspect} disabled={saving} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                {saving ? "Saving..." : "📡 Submit Intel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
