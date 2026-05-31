import { useState, useEffect } from "react";
import { OfficerProfile } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const SPEC_ICONS = { homicide:"🔪", cyber:"💻", narcotics:"💊", organized_crime:"🕵️", patrol:"🚔", detective:"🔍", forensics:"🔬", international:"🌍", general:"👮" };

export default function Officers() {
  const { t } = useLanguage();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [form, setForm] = useState({ full_name:"", badge_number:"", rank:"", department:"", country:"", specialization:"general", status:"active", clearance_level:"level1", cases_assigned:0, cases_solved:0, contact_email:"", contact_phone:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    try { setOfficers(await OfficerProfile.list()); } catch(e) { console.error(e); }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (selected) await OfficerProfile.update(selected.id, form);
      else await OfficerProfile.create(form);
      setShowForm(false); setSelected(null); load();
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const filtered = officers.filter(o => !searchQ || o.full_name?.toLowerCase().includes(searchQ.toLowerCase()) || o.badge_number?.toLowerCase().includes(searchQ.toLowerCase()) || o.country?.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">👮 {t("officers")}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{officers.length} registered officers worldwide</p>
        </div>
        <button onClick={() => { setShowForm(true); setSelected(null); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm">
          + Register Officer
        </button>
      </div>

      <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={t("search")}
        className="w-full max-w-md px-4 py-2 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-5" />

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><div className="text-4xl mb-3">👮</div><p>{t("noResults")}</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(o => (
            <div key={o.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-slate-500 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-800 to-slate-700 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {SPEC_ICONS[o.specialization] || "👮"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{o.full_name}</h3>
                  <p className="text-slate-400 text-xs">{o.rank} · Badge {o.badge_number}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${o.status === "active" ? "bg-green-900/50 text-green-300" : o.status === "suspended" ? "bg-red-900/50 text-red-300" : "bg-slate-700 text-slate-400"}`}>{o.status}</span>
                    <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">{o.clearance_level}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1 mb-3">
                <p>🌍 {o.country} · {o.department}</p>
                <p>🔍 {o.specialization?.replace("_"," ")}</p>
                {o.contact_email && <p>✉️ {o.contact_email}</p>}
              </div>
              <div className="flex gap-4 text-xs text-center mb-3">
                <div className="flex-1 bg-slate-700/50 rounded-lg py-2">
                  <p className="text-white font-bold text-base">{o.cases_assigned || 0}</p>
                  <p className="text-slate-400">Assigned</p>
                </div>
                <div className="flex-1 bg-green-900/30 rounded-lg py-2">
                  <p className="text-green-400 font-bold text-base">{o.cases_solved || 0}</p>
                  <p className="text-slate-400">Solved</p>
                </div>
              </div>
              <button onClick={() => { setSelected(o); setForm(o); setShowForm(true); }}
                className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-medium">✏️ Edit</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-5">{selected ? "✏️ Edit Officer" : "👮 Register Officer"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input value={form.full_name} onChange={e => setForm({...form,full_name:e.target.value})} placeholder="Officer full name"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Badge #</label>
                <input value={form.badge_number} onChange={e => setForm({...form,badge_number:e.target.value})} placeholder="Badge number"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Rank</label>
                <input value={form.rank} onChange={e => setForm({...form,rank:e.target.value})} placeholder="e.g. Detective"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Department</label>
                <input value={form.department} onChange={e => setForm({...form,department:e.target.value})} placeholder="Agency/Dept"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Country</label>
                <input value={form.country} onChange={e => setForm({...form,country:e.target.value})} placeholder="Country"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Specialization</label>
                <select value={form.specialization} onChange={e => setForm({...form,specialization:e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {Object.keys(SPEC_ICONS).map(s => <option key={s} value={s}>{SPEC_ICONS[s]} {s.replace("_"," ")}</option>)}</select></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {["active","off_duty","suspended","retired"].map(s => <option key={s} value={s}>{s.replace("_"," ")}</option>)}</select></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Clearance Level</label>
                <select value={form.clearance_level} onChange={e => setForm({...form,clearance_level:e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {["level1","level2","level3","classified"].map(l => <option key={l} value={l}>{l}</option>)}</select></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Email</label>
                <input type="email" value={form.contact_email} onChange={e => setForm({...form,contact_email:e.target.value})} placeholder="officer@dept.gov"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Phone</label>
                <input value={form.contact_phone} onChange={e => setForm({...form,contact_phone:e.target.value})} placeholder="Contact number"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => {setShowForm(false);setSelected(null);}} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700">{t("cancel")}</button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? t("loading") : t("save")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
