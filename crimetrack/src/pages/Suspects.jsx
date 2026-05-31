import { useState, useEffect } from "react";
import { Suspect } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const THREAT_COLORS = {
  extreme: "bg-red-600", high: "bg-orange-500", medium: "bg-yellow-500", low: "bg-green-600"
};
const STATUS_COLORS = {
  at_large: "bg-red-900/50 text-red-300 border border-red-700/40",
  wanted: "bg-orange-900/50 text-orange-300 border border-orange-700/40",
  in_custody: "bg-green-900/50 text-green-300 border border-green-700/40",
  cleared: "bg-slate-700 text-slate-400",
  deceased: "bg-slate-800 text-slate-500",
};

export default function Suspects() {
  const { t } = useLanguage();
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [form, setForm] = useState({ full_name: "", alias: "", dob: "", nationality: "", gender: "", height_cm: "", weight_kg: "", eye_color: "", hair_color: "", distinguishing_marks: "", last_known_location: "", status: "wanted", threat_level: "medium", charges: "", known_associates: "", notes: "", interpol_notice: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setSuspects(await Suspect.list()); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (selected) { await Suspect.update(selected.id, form); }
      else { await Suspect.create(form); }
      setShowForm(false); setSelected(null); load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const filtered = suspects.filter(s => {
    const matchSearch = !searchQ || s.full_name?.toLowerCase().includes(searchQ.toLowerCase()) || s.alias?.toLowerCase().includes(searchQ.toLowerCase()) || s.nationality?.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">👤 {t("suspects")}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{suspects.length} records in database</p>
        </div>
        <button onClick={() => { setShowForm(true); setSelected(null); setForm({ full_name: "", alias: "", dob: "", nationality: "", gender: "", height_cm: "", weight_kg: "", eye_color: "", hair_color: "", distinguishing_marks: "", last_known_location: "", status: "wanted", threat_level: "medium", charges: "", known_associates: "", notes: "", interpol_notice: false }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors">
          + {t("newSuspect")}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={t("search")}
          className="flex-1 min-w-48 px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
          <option value="all">All Status</option>
          {["at_large","wanted","in_custody","cleared","deceased"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><div className="text-4xl mb-3">👤</div><p>{t("noResults")}</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-900 to-slate-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {s.full_name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base truncate">{s.full_name}</h3>
                  {s.alias && <p className="text-slate-400 text-xs">aka {s.alias}</p>}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${STATUS_COLORS[s.status] || "bg-slate-700 text-slate-300"}`}>{s.status?.replace("_"," ")}</span>
                    {s.interpol_notice && <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700/40 px-1.5 py-0.5 rounded-full">INTERPOL</span>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
                {s.nationality && <span>🌍 {s.nationality}</span>}
                {s.dob && <span>🎂 {s.dob}</span>}
                {s.height_cm && <span>📏 {s.height_cm}cm</span>}
                {s.weight_kg && <span>⚖️ {s.weight_kg}kg</span>}
                {s.eye_color && <span>👁️ {s.eye_color}</span>}
                {s.hair_color && <span>💇 {s.hair_color}</span>}
              </div>
              {s.last_known_location && <p className="text-slate-400 text-xs mb-2">📍 {s.last_known_location}</p>}
              {s.charges && <p className="text-red-400 text-xs mb-3 line-clamp-2">⚖️ {s.charges}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${THREAT_COLORS[s.threat_level] || "bg-slate-400"}`} />
                  <span className="text-xs text-slate-400 capitalize">{s.threat_level} threat</span>
                </div>
                <button onClick={() => { setSelected(s); setForm(s); setShowForm(true); }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium">✏️ Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-5">{selected ? "✏️ Edit Suspect" : "👤 New Suspect"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Legal full name"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("alias")}</label>
                <input value={form.alias} onChange={e => setForm({...form, alias: e.target.value})} placeholder="Nicknames / aliases"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("nationality")}</label>
                <input value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} placeholder="Country of origin"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Gender</label>
                <input value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} placeholder="Gender"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("status")}</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  {["at_large","wanted","in_custody","cleared","deceased"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("threatLevel")}</label>
                <select value={form.threat_level} onChange={e => setForm({...form, threat_level: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  {["extreme","high","medium","low"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Height (cm)</label>
                <input type="number" value={form.height_cm} onChange={e => setForm({...form, height_cm: e.target.value})} placeholder="175"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Weight (kg)</label>
                <input type="number" value={form.weight_kg} onChange={e => setForm({...form, weight_kg: e.target.value})} placeholder="80"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Eye Color</label>
                <input value={form.eye_color} onChange={e => setForm({...form, eye_color: e.target.value})} placeholder="Brown"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Hair Color</label>
                <input value={form.hair_color} onChange={e => setForm({...form, hair_color: e.target.value})} placeholder="Black"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Distinguishing Marks</label>
                <input value={form.distinguishing_marks} onChange={e => setForm({...form, distinguishing_marks: e.target.value})} placeholder="Tattoos, scars, birthmarks..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">{t("lastKnownLocation")}</label>
                <input value={form.last_known_location} onChange={e => setForm({...form, last_known_location: e.target.value})} placeholder="City, Country"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">{t("charges")}</label>
                <textarea rows={2} value={form.charges} onChange={e => setForm({...form, charges: e.target.value})} placeholder="List of charges..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Known Associates</label>
                <input value={form.known_associates} onChange={e => setForm({...form, known_associates: e.target.value})} placeholder="Names of known associates"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">{t("notes")}</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Additional intelligence notes..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.interpol_notice} onChange={e => setForm({...form, interpol_notice: e.target.checked})} className="accent-red-500 w-4 h-4" />
                  <span className="text-sm text-slate-300">{t("interpol")} — Issue international notice</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); setSelected(null); }}
                className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700">{t("cancel")}</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? t("loading") : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
