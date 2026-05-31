import { useState, useEffect } from "react";
import { CrimeReport, Suspect, OfficerProfile } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const AGENCIES = [
  "FBI", "INTERPOL", "CIA", "DEA", "ATF", "ICE", "Europol", "Scotland Yard",
  "Mossad", "MI6", "BKA (Germany)", "DGSE (France)", "FSB (Russia)", "RAW (India)",
  "AFP (Australia)", "RCMP (Canada)", "NPA (Japan)", "Guardia Civil (Spain)",
  "National Police (Netherlands)", "SAPS (South Africa)", "Custom Agency", "Local Department"
];

export default function IntelSharing() {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [shares, setShares] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ct_intel_shares") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({
    case_id: "", target_agency: "", custom_agency: "", classification: "confidential",
    intel_type: "case_update", summary: "", requesting_officer: "", priority: "medium"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [c, o] = await Promise.all([CrimeReport.list(), OfficerProfile.list()]);
      setCases(c); setOfficers(o);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitIntel = async () => {
    setSaving(true);
    try {
      const agency = form.target_agency === "Custom Agency" ? form.custom_agency : form.target_agency;
      const selectedCase = cases.find(c => c.id === form.case_id);
      const share = {
        id: Date.now().toString(),
        case_number: selectedCase?.case_number || "N/A",
        case_title: selectedCase?.title || "Unknown",
        target_agency: agency,
        classification: form.classification,
        intel_type: form.intel_type,
        summary: form.summary,
        requesting_officer: form.requesting_officer,
        priority: form.priority,
        status: "transmitted",
        timestamp: new Date().toLocaleString(),
        ref: `INT-${Date.now().toString().slice(-6)}`,
      };
      const updated = [share, ...shares];
      setShares(updated);
      localStorage.setItem("ct_intel_shares", JSON.stringify(updated));
      setShowForm(false);
      setForm({ case_id: "", target_agency: "", custom_agency: "", classification: "confidential", intel_type: "case_update", summary: "", requesting_officer: "", priority: "medium" });
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const CLASSIFICATION_COLORS = {
    top_secret: "bg-red-700 text-white",
    secret: "bg-orange-600 text-white",
    confidential: "bg-yellow-600 text-black",
    unclassified: "bg-green-700 text-white",
  };

  const PRIORITY_COLORS = {
    critical: "text-red-400", high: "text-orange-400", medium: "text-yellow-400", low: "text-green-400"
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📡 Cross-Agency Intel Sharing</h1>
          <p className="text-slate-400 text-sm mt-0.5">Transmit intelligence to partner agencies worldwide</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold text-sm">
          + Share Intel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Transmissions", val: shares.length, icon: "📡", color: "from-cyan-700 to-cyan-800" },
          { label: "Active Cases Shared", val: new Set(shares.map(s => s.case_number)).size, icon: "📁", color: "from-blue-700 to-blue-800" },
          { label: "Agencies Contacted", val: new Set(shares.map(s => s.target_agency)).size, icon: "🌍", color: "from-purple-700 to-purple-800" },
          { label: "Critical Intel", val: shares.filter(s => s.priority === "critical").length, icon: "🚨", color: "from-red-700 to-red-800" },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.val}</p>
            <p className="text-white/70 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Intel Log */}
      <h2 className="text-white font-bold mb-3">📋 Transmission Log</h2>
      {shares.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center text-slate-400">
          <div className="text-4xl mb-3">📡</div>
          <p>No intel transmissions yet.</p>
          <p className="text-sm mt-1">Share intelligence with partner agencies using the button above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shares.map(s => (
            <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-slate-400 text-xs font-mono">Ref: {s.ref}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${CLASSIFICATION_COLORS[s.classification] || "bg-slate-600 text-white"}`}>
                      {s.classification?.replace("_"," ").toUpperCase()}
                    </span>
                    <span className={`text-xs font-bold ${PRIORITY_COLORS[s.priority] || "text-slate-400"}`}>
                      {s.priority?.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-xs bg-green-900/50 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full">✅ TRANSMITTED</span>
                  </div>
                  <p className="text-white font-semibold">{s.case_title} <span className="text-slate-400 font-normal text-sm">({s.case_number})</span></p>
                  <p className="text-slate-400 text-sm mt-0.5">→ <span className="text-cyan-400 font-medium">{s.target_agency}</span> · {s.intel_type?.replace("_"," ")} · {s.requesting_officer}</p>
                  {s.summary && <p className="text-slate-400 text-xs mt-2 line-clamp-2">{s.summary}</p>}
                </div>
                <p className="text-slate-500 text-xs shrink-0">{s.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-cyan-700/40 rounded-2xl w-full max-w-lg p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-5">📡 Transmit Intelligence</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Related Case *</label>
                <select value={form.case_id} onChange={e => setForm({...form, case_id: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">-- Select case --</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.case_number} — {c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Agency *</label>
                <select value={form.target_agency} onChange={e => setForm({...form, target_agency: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">-- Select agency --</option>
                  {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {form.target_agency === "Custom Agency" && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Agency Name</label>
                  <input value={form.custom_agency} onChange={e => setForm({...form, custom_agency: e.target.value})} placeholder="Enter agency name"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Classification</label>
                  <select value={form.classification} onChange={e => setForm({...form, classification: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    {["top_secret","secret","confidential","unclassified"].map(c => <option key={c} value={c}>{c.replace("_"," ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    {["critical","high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Intel Type</label>
                <select value={form.intel_type} onChange={e => setForm({...form, intel_type: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {["case_update","suspect_sighting","evidence_share","arrest_warrant","threat_alert","witness_protection","extradition_request"].map(t => <option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Requesting Officer</label>
                <input value={form.requesting_officer} onChange={e => setForm({...form, requesting_officer: e.target.value})} placeholder="Your name & badge #"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Intelligence Summary *</label>
                <textarea rows={4} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})}
                  placeholder="Detailed summary of intelligence being shared..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-700">Cancel</button>
              <button onClick={submitIntel} disabled={saving || !form.case_id || !form.target_agency || !form.summary}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                {saving ? "Transmitting..." : "📡 Transmit Intel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
