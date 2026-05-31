import { useState, useEffect } from "react";
import { CrimeReport, Suspect } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

export default function AlertSystem() {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ct_alerts") || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "suspect_sighted", title: "", message: "", priority: "high", location: "", broadcast_to: "all", related_case: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); generateAutoAlerts(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([CrimeReport.list(), Suspect.list()]);
      setCases(c); setSuspects(s);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const generateAutoAlerts = async () => {
    try {
      const [c, s] = await Promise.all([CrimeReport.list(), Suspect.list()]);
      const autoAlerts = [];
      // Critical cases
      c.filter(x => x.priority === "critical" && x.status === "open").forEach(x => {
        if (!alerts.find(a => a.auto_id === `critical_${x.id}`)) {
          autoAlerts.push({ id: Date.now() + Math.random(), auto_id: `critical_${x.id}`, type: "critical_case", title: `🚨 CRITICAL CASE: ${x.title}`, message: `Case ${x.case_number} is open and critical priority. Requires immediate response.`, priority: "critical", location: x.location_city, status: "active", timestamp: new Date().toLocaleString(), broadcast_to: "all" });
        }
      });
      // Extreme threat suspects at large
      s.filter(x => x.threat_level === "extreme" && (x.status === "at_large" || x.status === "wanted")).forEach(x => {
        if (!alerts.find(a => a.auto_id === `extreme_${x.id}`)) {
          autoAlerts.push({ id: Date.now() + Math.random(), auto_id: `extreme_${x.id}`, type: "extreme_suspect", title: `💀 EXTREME THREAT AT LARGE: ${x.full_name}`, message: `${x.full_name}${x.alias ? ` (${x.alias})` : ""} is an extreme threat suspect currently at large. Last seen: ${x.last_known_location || "Unknown"}. Do NOT approach without armed backup.`, priority: "critical", location: x.last_known_location, status: "active", timestamp: new Date().toLocaleString(), broadcast_to: "all" });
        }
      });
      if (autoAlerts.length > 0) {
        const updated = [...autoAlerts, ...alerts];
        setAlerts(updated);
        localStorage.setItem("ct_alerts", JSON.stringify(updated));
      }
    } catch (e) { console.error(e); }
  };

  const createAlert = () => {
    setSaving(true);
    const alert = {
      id: Date.now(),
      ...form,
      status: "active",
      timestamp: new Date().toLocaleString(),
    };
    const updated = [alert, ...alerts];
    setAlerts(updated);
    localStorage.setItem("ct_alerts", JSON.stringify(updated));
    setShowForm(false);
    setForm({ type: "suspect_sighted", title: "", message: "", priority: "high", location: "", broadcast_to: "all", related_case: "" });
    setSaving(false);
  };

  const dismissAlert = (id) => {
    const updated = alerts.map(a => a.id === id ? { ...a, status: "dismissed" } : a);
    setAlerts(updated);
    localStorage.setItem("ct_alerts", JSON.stringify(updated));
  };

  const ALERT_STYLES = {
    critical: "border-red-600 bg-red-900/20",
    high: "border-orange-500 bg-orange-900/10",
    medium: "border-yellow-500 bg-yellow-900/10",
    low: "border-blue-500 bg-blue-900/10",
  };
  const ALERT_BADGE = {
    critical: "bg-red-600 text-white animate-pulse",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-blue-600 text-white",
  };
  const ALERT_ICONS = {
    suspect_sighted: "👁️", critical_case: "🚨", extreme_suspect: "💀",
    officer_down: "🆘", bolo: "📢", threat_warning: "⚠️", all_clear: "✅", custom: "🔔"
  };

  const activeAlerts = alerts.filter(a => a.status === "active");
  const dismissedAlerts = alerts.filter(a => a.status === "dismissed");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {activeAlerts.length > 0 && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
          <div>
            <h1 className="text-2xl font-bold text-white">🔔 Alert System</h1>
            <p className="text-slate-400 text-sm mt-0.5">{activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""} · Broadcast to all officers</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm">
          + Issue Alert
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{activeAlerts.filter(a => a.priority === "critical").length}</p>
          <p className="text-white/70 text-sm">🚨 Critical Active</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{activeAlerts.length}</p>
          <p className="text-white/70 text-sm">🔔 Total Active</p>
        </div>
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{dismissedAlerts.length}</p>
          <p className="text-white/70 text-sm">✅ Resolved</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" /></div>
      ) : activeAlerts.length === 0 ? (
        <div className="bg-slate-800 border border-green-700/30 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-green-400 font-bold text-lg">All Clear</p>
          <p className="text-slate-400 text-sm mt-1">No active alerts. System monitoring all cases and suspects.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {activeAlerts.map(a => (
            <div key={a.id} className={`border-2 rounded-2xl p-5 ${ALERT_STYLES[a.priority] || "border-slate-600 bg-slate-800"}`}>
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">{ALERT_ICONS[a.type] || "🔔"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${ALERT_BADGE[a.priority]}`}>
                      {a.priority?.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full capitalize">{a.type?.replace(/_/g," ")}</span>
                    {a.broadcast_to === "all" && <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">📢 All Officers</span>}
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">{a.title}</h3>
                  <p className="text-slate-300 text-sm mb-2">{a.message}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {a.location && <span>📍 {a.location}</span>}
                    <span>🕐 {a.timestamp}</span>
                  </div>
                </div>
                <button onClick={() => dismissAlert(a.id)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-green-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium shrink-0 transition-colors">
                  ✅ Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dismissedAlerts.length > 0 && (
        <div>
          <h2 className="text-slate-500 font-bold text-sm mb-2">✅ Resolved Alerts ({dismissedAlerts.length})</h2>
          <div className="space-y-2">
            {dismissedAlerts.slice(0,5).map(a => (
              <div key={a.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-slate-600">{ALERT_ICONS[a.type] || "🔔"}</span>
                <p className="text-slate-500 text-sm flex-1 truncate">{a.title}</p>
                <span className="text-slate-600 text-xs shrink-0">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-red-700/40 rounded-2xl w-full max-w-lg p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-5">🔔 Issue Alert</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Alert Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    {["suspect_sighted","bolo","officer_down","threat_warning","all_clear","custom"].map(t => <option key={t} value={t}>{ALERT_ICONS[t]} {t.replace(/_/g," ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    {["critical","high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Alert Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Short descriptive title"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Alert Message *</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Full alert details for officers..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City or area"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Broadcast To</label>
                  <select value={form.broadcast_to} onChange={e => setForm({...form, broadcast_to: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="all">All Officers</option>
                    <option value="local">Local Dept Only</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-700">Cancel</button>
              <button onClick={createAlert} disabled={saving || !form.title || !form.message}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                {saving ? "Broadcasting..." : "🔔 Broadcast Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
