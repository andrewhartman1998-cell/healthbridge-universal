import { useState, useEffect } from "react";
import { CrimeReport } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const PRIORITY_BADGE = {
  critical: "bg-red-600 text-white", high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black", low: "bg-green-600 text-white"
};
const STATUS_BADGE = {
  open: "bg-orange-900/40 text-orange-300 border border-orange-700/40",
  under_investigation: "bg-blue-900/40 text-blue-300 border border-blue-700/40",
  solved: "bg-green-900/40 text-green-300 border border-green-700/40",
  closed: "bg-slate-700 text-slate-400",
  cold_case: "bg-purple-900/40 text-purple-300 border border-purple-700/40",
};

export default function Cases() {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [form, setForm] = useState({ title: "", crime_type: "other", status: "open", priority: "medium", location_city: "", location_country: "", description: "", incident_date: "", assigned_officer_name: "", department: "", witnesses: "", evidence_notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCases(); }, []);

  const loadCases = async () => {
    setLoading(true);
    try { setCases(await CrimeReport.list()); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const caseNum = `CT-${Date.now().toString().slice(-6)}`;
      if (selected) { await CrimeReport.update(selected.id, form); }
      else { await CrimeReport.create({ ...form, case_number: caseNum }); }
      setShowForm(false); setSelected(null);
      setForm({ title: "", crime_type: "other", status: "open", priority: "medium", location_city: "", location_country: "", description: "", incident_date: "", assigned_officer_name: "", department: "", witnesses: "", evidence_notes: "" });
      loadCases();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const openEdit = (c) => { setSelected(c); setForm(c); setShowForm(true); };

  const filtered = cases.filter(c => {
    const matchSearch = !searchQ || c.title?.toLowerCase().includes(searchQ.toLowerCase()) || c.case_number?.toLowerCase().includes(searchQ.toLowerCase()) || c.location_city?.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchPriority = filterPriority === "all" || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📁 {t("cases")}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{cases.length} total cases in system</p>
        </div>
        <button onClick={() => { setShowForm(true); setSelected(null); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
          + {t("newCase")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={t("search")}
          className="flex-1 min-w-48 px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          {["open","under_investigation","solved","closed","cold_case"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Priority</option>
          {["critical","high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><div className="text-4xl mb-3">📁</div><p>{t("noResults")}</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-slate-400 text-xs font-mono">{c.case_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${PRIORITY_BADGE[c.priority] || "bg-slate-600 text-white"}`}>{c.priority?.toUpperCase()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[c.status] || "bg-slate-700 text-slate-300"}`}>{c.status?.replace("_"," ")}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-1">{c.title || "Untitled Case"}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>🔍 {c.crime_type?.replace("_"," ")}</span>
                    <span>📍 {c.location_city}{c.location_country ? `, ${c.location_country}` : ""}</span>
                    {c.assigned_officer_name && <span>👮 {c.assigned_officer_name}</span>}
                    {c.incident_date && <span>📅 {c.incident_date}</span>}
                  </div>
                  {c.description && <p className="text-slate-400 text-xs mt-2 line-clamp-2">{c.description}</p>}
                </div>
                <button onClick={() => openEdit(c)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors shrink-0">
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-5">{selected ? "✏️ Edit Case" : "📁 " + t("newCase")}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Case Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Brief case title"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("crimeType")}</label>
                <select value={form.crime_type} onChange={e => setForm({...form, crime_type: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["assault","theft","homicide","fraud","cybercrime","trafficking","terrorism","drug_offense","vandalism","kidnapping","other"].map(t => <option key={t} value={t}>{t.replace("_"," ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("priority")}</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["critical","high","medium","low"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("status")}</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["open","under_investigation","solved","closed","cold_case"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("incidentDate")}</label>
                <input type="date" value={form.incident_date} onChange={e => setForm({...form, incident_date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">City</label>
                <input value={form.location_city} onChange={e => setForm({...form, location_city: e.target.value})} placeholder="City"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("country")}</label>
                <input value={form.location_country} onChange={e => setForm({...form, location_country: e.target.value})} placeholder="Country"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("assignedOfficer")}</label>
                <input value={form.assigned_officer_name} onChange={e => setForm({...form, assigned_officer_name: e.target.value})} placeholder="Officer name"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t("department")}</label>
                <input value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Dept / Agency"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">{t("description")}</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Full incident description..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Witnesses</label>
                <input value={form.witnesses} onChange={e => setForm({...form, witnesses: e.target.value})} placeholder="Witness names and contact info"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Evidence Notes</label>
                <textarea rows={2} value={form.evidence_notes} onChange={e => setForm({...form, evidence_notes: e.target.value})} placeholder="Initial evidence notes..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); setSelected(null); }}
                className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700">{t("cancel")}</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? t("loading") : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
