import { useState, useEffect } from "react";
import { Suspect, CrimeReport } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

export default function InterpolAlerts() {
  const { t } = useLanguage();
  const [suspects, setSuspects] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [noticeType, setNoticeType] = useState("red");
  const [noticeReason, setNoticeReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([Suspect.list(), CrimeReport.list()]);
      setSuspects(s);
      setCases(c);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const NOTICE_TYPES = {
    red: { color: "bg-red-600", label: "Red Notice", desc: "Wanted for prosecution or to serve a sentence", icon: "🔴" },
    blue: { color: "bg-blue-600", label: "Blue Notice", desc: "Collect additional information about a person", icon: "🔵" },
    green: { color: "bg-green-600", label: "Green Notice", desc: "Warning about a person's criminal activities", icon: "🟢" },
    yellow: { color: "bg-yellow-500", label: "Yellow Notice", desc: "Locate missing persons", icon: "🟡" },
    orange: { color: "bg-orange-500", label: "Orange Notice", desc: "Warn of threats from persons or items", icon: "🟠" },
    purple: { color: "bg-purple-600", label: "Purple Notice", desc: "Seek information on modus operandi", icon: "🟣" },
  };

  const generateNotice = async () => {
    if (!selectedSuspect || !noticeReason) return;
    setSaving(true);
    try {
      await Suspect.update(selectedSuspect.id, { interpol_notice: true, notes: (selectedSuspect.notes || "") + `\n[INTERPOL ${NOTICE_TYPES[noticeType].label} issued] ${noticeReason}` });
      const noticeNumber = `A-${Math.floor(Math.random()*9000)+1000}/${new Date().getFullYear()}`;
      setGenerated({
        suspect: selectedSuspect,
        type: noticeType,
        reason: noticeReason,
        number: noticeNumber,
        date: new Date().toLocaleDateString(),
      });
      load();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const interpolSuspects = suspects.filter(s => s.interpol_notice);
  const nonInterpolAtLarge = suspects.filter(s => !s.interpol_notice && (s.status === "at_large" || s.status === "wanted"));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🌍 INTERPOL Notices</h1>
          <p className="text-slate-400 text-sm mt-0.5">Generate and manage international wanted notices</p>
        </div>
        <button onClick={() => { setShowGenerator(true); setGenerated(null); }}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm">
          + Generate Notice
        </button>
      </div>

      {/* Notice Type Guide */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Object.entries(NOTICE_TYPES).map(([key, n]) => (
          <div key={key} className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{n.icon}</div>
            <p className="text-white text-xs font-bold">{n.label}</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-tight">{n.desc}</p>
          </div>
        ))}
      </div>

      {/* Active INTERPOL suspects */}
      <div className="mb-6">
        <h2 className="text-white font-bold mb-3">🔴 Active INTERPOL Notices ({interpolSuspects.length})</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>
        ) : interpolSuspects.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400">
            <div className="text-3xl mb-2">🌍</div>
            <p>No active INTERPOL notices. Generate one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {interpolSuspects.map(s => (
              <div key={s.id} className="bg-slate-800 border border-purple-700/40 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-purple-900 to-red-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {s.full_name?.[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold">{s.full_name}</p>
                    {s.alias && <p className="text-slate-400 text-xs">aka {s.alias}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-xs bg-red-900/50 text-red-300 border border-red-700/40 px-2 py-0.5 rounded-full">🌍 INTERPOL Active</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.threat_level === "extreme" ? "bg-red-600 text-white" : s.threat_level === "high" ? "bg-orange-500 text-white" : "bg-yellow-500 text-black"}`}>
                    {s.threat_level?.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  {s.nationality && <p>🌍 {s.nationality}</p>}
                  {s.last_known_location && <p>📍 {s.last_known_location}</p>}
                  {s.charges && <p className="text-red-400">⚖️ {s.charges.slice(0,60)}...</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidates for INTERPOL */}
      {nonInterpolAtLarge.length > 0 && (
        <div>
          <h2 className="text-white font-bold mb-3">⚠️ Candidates for INTERPOL Notice ({nonInterpolAtLarge.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {nonInterpolAtLarge.map(s => (
              <div key={s.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold shrink-0">{s.full_name?.[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{s.full_name}</p>
                  <p className="text-slate-400 text-xs capitalize">{s.status?.replace("_"," ")} · {s.threat_level} threat</p>
                </div>
                <button onClick={() => { setSelectedSuspect(s); setShowGenerator(true); setGenerated(null); }}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-medium shrink-0">
                  + Notice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-purple-700/40 rounded-2xl w-full max-w-lg p-6 my-4">
            {generated ? (
              <div>
                <div className="text-center mb-5">
                  <div className="text-5xl mb-3">🌍</div>
                  <h2 className="text-white font-bold text-xl">INTERPOL Notice Generated</h2>
                  <p className="text-green-400 text-sm mt-1">Successfully issued internationally</p>
                </div>
                <div className="bg-slate-900 border-2 border-purple-600 rounded-2xl p-5 mb-5">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <div className="text-2xl font-bold text-white">INTERPOL</div>
                    <div className="text-right">
                      <p className="text-purple-400 text-sm font-bold">{NOTICE_TYPES[generated.type].label}</p>
                      <p className="text-slate-400 text-xs">Notice #{generated.number}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Subject:</span><span className="text-white font-bold">{generated.suspect.full_name}</span></div>
                    {generated.suspect.alias && <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Alias:</span><span className="text-white">{generated.suspect.alias}</span></div>}
                    <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Notice Type:</span><span className="text-white">{NOTICE_TYPES[generated.type].label}</span></div>
                    <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Reason:</span><span className="text-white">{generated.reason}</span></div>
                    <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Issued:</span><span className="text-white">{generated.date}</span></div>
                    <div className="flex gap-2"><span className="text-slate-400 w-24 shrink-0">Status:</span><span className="text-green-400 font-bold">✅ ACTIVE — Distributed to 196 member countries</span></div>
                  </div>
                </div>
                <button onClick={() => { setShowGenerator(false); setSelectedSuspect(null); setGenerated(null); }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold">Done</button>
              </div>
            ) : (
              <div>
                <h2 className="text-white font-bold text-lg mb-5">🌍 Generate INTERPOL Notice</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Select Suspect *</label>
                    <select value={selectedSuspect?.id || ""} onChange={e => setSelectedSuspect(suspects.find(s => s.id === e.target.value) || null)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">-- Select suspect --</option>
                      {suspects.map(s => <option key={s.id} value={s.id}>{s.full_name}{s.alias ? ` (${s.alias})` : ""}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-2 block">Notice Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(NOTICE_TYPES).map(([key, n]) => (
                        <button key={key} onClick={() => setNoticeType(key)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors text-left ${noticeType === key ? "border-purple-500 bg-purple-900/30 text-white" : "border-slate-600 text-slate-400 hover:border-slate-500"}`}>
                          <span>{n.icon}</span><span className="font-medium">{n.label}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-slate-500 text-xs mt-2">{NOTICE_TYPES[noticeType].desc}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Reason / Charges *</label>
                    <textarea rows={3} value={noticeReason} onChange={e => setNoticeReason(e.target.value)}
                      placeholder="State the reason for the INTERPOL notice and relevant charges..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setShowGenerator(false); setSelectedSuspect(null); }} className="flex-1 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-700">Cancel</button>
                  <button onClick={generateNotice} disabled={saving || !selectedSuspect || !noticeReason}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                    {saving ? "Issuing..." : "🌍 Issue Notice"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
