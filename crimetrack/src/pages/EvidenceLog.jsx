import { useState, useEffect } from "react";
import { Evidence } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const TYPE_ICONS = { photo:"📷", video:"🎥", document:"📄", physical:"🧪", digital:"💻", witness_statement:"👁️", forensic:"🔬", other:"📦" };
const STATUS_COLORS = {
  pending_review: "bg-yellow-900/40 text-yellow-300",
  verified: "bg-green-900/40 text-green-300",
  inadmissible: "bg-red-900/40 text-red-300",
  submitted_to_court: "bg-blue-900/40 text-blue-300",
};

export default function EvidenceLog() {
  const { t } = useLanguage();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [form, setForm] = useState({ case_number: "", type: "physical", title: "", description: "", collected_by: "", collected_date: "", location_collected: "", chain_of_custody: "", status: "pending_review", file_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    try { setEvidence(await Evidence.list()); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try { await Evidence.create(form); setShowForm(false); load(); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const filtered = evidence.filter(e => !searchQ || e.title?.toLowerCase().includes(searchQ.toLowerCase()) || e.case_number?.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🔬 {t("evidence")}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{evidence.length} items logged</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold text-sm transition-colors">
          + {t("addEvidence")}
        </button>
      </div>

      <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={`${t("search")} by title or case #`}
        className="w-full max-w-md px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-5" />

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><div className="text-4xl mb-3">🔬</div><p>{t("noResults")}</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(e => (
            <div key={e.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {TYPE_ICONS[e.type] || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">{e.title}</h3>
                  <p className="text-slate-400 text-xs">Case: {e.case_number || "—"}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_COLORS[e.status] || "bg-slate-700 text-slate-300"}`}>
                {e.status?.replace("_"," ")}
              </span>
              {e.description && <p className="text-slate-400 text-xs mt-2 line-clamp-2">{e.description}</p>}
              <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-1 text-xs text-slate-500">
                {e.collected_by && <span>👤 {e.collected_by}</span>}
                {e.collected_date && <span>📅 {e.collected_date}</span>}
                {e.location_collected && <span className="col-span-2">📍 {e.location_collected}</span>}
              </div>
              {e.chain_of_custody && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">🔗 Chain: {e.chain_of_custody}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-5">🔬 Log Evidence</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Case Number</label>
                  <input value={form.case_number} onChange={e => setForm({...form, case_number: e.target.value})} placeholder="CT-XXXXXX"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Evidence Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    {Object.keys(TYPE_ICONS).map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t.replace("_"," ")}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Brief evidence title"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detailed description of the evidence..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Collected By</label>
                  <input value={form.collected_by} onChange={e => setForm({...form, collected_by: e.target.value})} placeholder="Officer name"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Date Collected</label>
                  <input type="date" value={form.collected_date} onChange={e => setForm({...form, collected_date: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Location Collected</label>
                <input value={form.location_collected} onChange={e => setForm({...form, location_collected: e.target.value})} placeholder="Where evidence was found"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Chain of Custody</label>
                <input value={form.chain_of_custody} onChange={e => setForm({...form, chain_of_custody: e.target.value})} placeholder="Who handled the evidence and when"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {["pending_review","verified","inadmissible","submitted_to_court"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700">{t("cancel")}</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? t("loading") : "Log Evidence"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
