import { useState, useEffect } from "react";
import { Suspect, CrimeReport } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

export default function ArrestBooking() {
  const { t } = useLanguage();
  const [suspects, setSuspects] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [form, setForm] = useState({ arresting_officer: "", arrest_date: "", arrest_location: "", booking_number: "", charges_filed: "", bail_amount: "", cell_number: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([Suspect.list(), CrimeReport.list()]);
      setSuspects(s);
      setCases(c);
      setBookings(s.filter(x => x.status === "in_custody"));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const processArrest = async () => {
    if (!selectedSuspect) return;
    setSaving(true);
    try {
      const bookingNum = form.booking_number || `BK-${Date.now().toString().slice(-8)}`;
      const arrestNote = `[ARRESTED ${form.arrest_date}] By: ${form.arresting_officer} | Location: ${form.arrest_location} | Booking: ${bookingNum} | Charges: ${form.charges_filed} | Bail: $${form.bail_amount} | Cell: ${form.cell_number}`;
      await Suspect.update(selectedSuspect.id, {
        status: "in_custody",
        notes: (selectedSuspect.notes ? selectedSuspect.notes + "\n" : "") + arrestNote,
      });
      // Update related cases to solved
      const relatedCases = cases.filter(c => c.assigned_officer_name || c.title);
      setShowForm(false);
      setSelectedSuspect(null);
      setForm({ arresting_officer: "", arrest_date: "", arrest_location: "", booking_number: "", charges_filed: "", bail_amount: "", cell_number: "", notes: "" });
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const atLarge = suspects.filter(s => s.status === "at_large" || s.status === "wanted");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🔒 Arrest & Booking</h1>
          <p className="text-slate-400 text-sm mt-0.5">Process arrests and manage booking records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-white">{bookings.length}</p>
          <p className="text-white/70 text-sm mt-1">🔒 In Custody</p>
        </div>
        <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-white">{atLarge.length}</p>
          <p className="text-white/70 text-sm mt-1">🚨 Still At Large</p>
        </div>
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl p-5 text-center">
          <p className="text-4xl font-bold text-white">{suspects.filter(s => s.status === "cleared").length}</p>
          <p className="text-white/70 text-sm mt-1">✅ Cleared</p>
        </div>
      </div>

      {/* Process New Arrest */}
      {atLarge.length > 0 && (
        <div className="bg-slate-800 border border-red-700/30 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold mb-3">🚨 Process New Arrest</h2>
          <p className="text-slate-400 text-sm mb-4">Select a wanted/at-large suspect to process their arrest and booking.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {atLarge.map(s => (
              <button key={s.id} onClick={() => { setSelectedSuspect(s); setShowForm(true); }}
                className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-red-900/30 border border-slate-600 hover:border-red-600 rounded-xl text-left transition-colors">
                <div className="w-9 h-9 bg-red-900 rounded-lg flex items-center justify-center text-white font-bold shrink-0">{s.full_name?.[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{s.full_name}</p>
                  <p className="text-red-400 text-xs capitalize">{s.status?.replace("_"," ")} · {s.threat_level}</p>
                </div>
                <span className="text-green-400 text-xs font-bold">ARREST →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Bookings */}
      <div>
        <h2 className="text-white font-bold mb-3">🔒 Current Bookings ({bookings.length})</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>
        ) : bookings.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400">
            <div className="text-3xl mb-2">🔒</div><p>No suspects currently in custody.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookings.map(s => (
              <div key={s.id} className="bg-slate-800 border border-green-700/30 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-green-900 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">{s.full_name?.[0]}</div>
                  <div>
                    <p className="text-white font-bold">{s.full_name}</p>
                    {s.alias && <p className="text-slate-400 text-xs">aka {s.alias}</p>}
                  </div>
                </div>
                <span className="text-xs bg-green-900/50 text-green-300 border border-green-700/40 px-2 py-1 rounded-full">🔒 IN CUSTODY</span>
                <div className="mt-3 text-xs text-slate-400 space-y-1">
                  {s.nationality && <p>🌍 {s.nationality}</p>}
                  {s.charges && <p className="text-red-400">⚖️ {s.charges.slice(0,80)}</p>}
                  {s.notes && <p className="text-slate-500 line-clamp-2 mt-1">{s.notes.split("\n").pop()}</p>}
                </div>
                <button onClick={async () => { await Suspect.update(s.id, { status: "cleared" }); load(); }}
                  className="mt-3 w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-medium">
                  ✅ Mark as Cleared / Released
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrest Form Modal */}
      {showForm && selectedSuspect && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-green-700/40 rounded-2xl w-full max-w-lg p-6 my-4">
            <h2 className="text-white font-bold text-lg mb-1">🔒 Process Arrest</h2>
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3 mb-5">
              <p className="text-red-300 font-bold">{selectedSuspect.full_name}</p>
              {selectedSuspect.alias && <p className="text-slate-400 text-xs">aka {selectedSuspect.alias}</p>}
              {selectedSuspect.charges && <p className="text-red-400 text-xs mt-1">⚖️ {selectedSuspect.charges}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Arresting Officer *</label>
                <input value={form.arresting_officer} onChange={e => setForm({...form, arresting_officer: e.target.value})} placeholder="Officer name and badge #"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Arrest Date *</label>
                <input type="date" value={form.arrest_date} onChange={e => setForm({...form, arrest_date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Booking Number</label>
                <input value={form.booking_number} onChange={e => setForm({...form, booking_number: e.target.value})} placeholder="Auto-generated if blank"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500" /></div>
              <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Arrest Location</label>
                <input value={form.arrest_location} onChange={e => setForm({...form, arrest_location: e.target.value})} placeholder="Where the arrest was made"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500" /></div>
              <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Charges Filed</label>
                <input value={form.charges_filed} onChange={e => setForm({...form, charges_filed: e.target.value})} placeholder="Formal charges at time of arrest"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Bail Amount ($)</label>
                <input type="number" value={form.bail_amount} onChange={e => setForm({...form, bail_amount: e.target.value})} placeholder="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500" /></div>
              <div><label className="text-xs text-slate-400 mb-1 block">Cell / Block</label>
                <input value={form.cell_number} onChange={e => setForm({...form, cell_number: e.target.value})} placeholder="Cell assignment"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-500" /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); setSelectedSuspect(null); }} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-700">Cancel</button>
              <button onClick={processArrest} disabled={saving || !form.arresting_officer || !form.arrest_date}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                {saving ? "Processing..." : "🔒 Confirm Arrest"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
