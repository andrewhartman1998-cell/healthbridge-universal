import { useState, useEffect } from "react";
import { CrimeReport, Suspect, Evidence, OfficerProfile } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const CRIME_COLORS = {
  assault: "bg-red-500", theft: "bg-orange-500", homicide: "bg-red-700",
  fraud: "bg-yellow-500", cybercrime: "bg-blue-500", trafficking: "bg-purple-600",
  terrorism: "bg-red-900", drug_offense: "bg-green-600", vandalism: "bg-gray-500",
  kidnapping: "bg-pink-600", other: "bg-slate-500"
};

const PRIORITY_COLORS = {
  critical: "bg-red-500 text-white", high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black", low: "bg-green-500 text-white"
};

export default function Dashboard({ currentUser }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, open: 0, solved: 0, suspects: 0, evidence: 0, officers: 0, critical: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [wantedSuspects, setWantedSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crimeBreakdown, setCrimeBreakdown] = useState({});

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cases, suspects, evid, officers] = await Promise.all([
        CrimeReport.list(), Suspect.list(), Evidence.list(), OfficerProfile.list()
      ]);
      const breakdown = {};
      cases.forEach(c => { breakdown[c.crime_type] = (breakdown[c.crime_type] || 0) + 1; });
      setCrimeBreakdown(breakdown);
      setStats({
        total: cases.length, open: cases.filter(c => c.status === "open" || c.status === "under_investigation").length,
        solved: cases.filter(c => c.status === "solved").length,
        suspects: suspects.length, evidence: evid.length, officers: officers.length,
        critical: cases.filter(c => c.priority === "critical").length,
      });
      setRecentCases(cases.slice(-5).reverse());
      setWantedSuspects(suspects.filter(s => s.status === "wanted" || s.status === "at_large").slice(0, 4));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center text-slate-400">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm">{t("loading")}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{t("dashboard")}</h1>
        <p className="text-slate-400 text-sm mt-1">{t("globalStats")} · Real-time intelligence overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: t("totalCases"), val: stats.total, icon: "📁", color: "from-blue-600 to-blue-700" },
          { label: t("activeCases"), val: stats.open, icon: "🔍", color: "from-orange-500 to-orange-600" },
          { label: t("solvedCases"), val: stats.solved, icon: "✅", color: "from-green-600 to-green-700" },
          { label: "Critical", val: stats.critical, icon: "🚨", color: "from-red-600 to-red-700" },
          { label: t("suspects"), val: stats.suspects, icon: "👤", color: "from-purple-600 to-purple-700" },
          { label: "Evidence Items", val: stats.evidence, icon: "🔬", color: "from-cyan-600 to-cyan-700" },
          { label: t("officers"), val: stats.officers, icon: "👮", color: "from-slate-600 to-slate-700" },
          { label: "Wanted", val: wantedSuspects.length, icon: "⚠️", color: "from-yellow-600 to-yellow-700" },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.val}</p>
            <p className="text-white/70 text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            📋 {t("recentCases")}
          </h2>
          {recentCases.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <div className="text-3xl mb-2">📁</div>
              <p>No cases yet. File the first report.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCases.map(c => (
                <div key={c.id} className="bg-slate-700/50 rounded-xl p-4 flex items-start gap-3 hover:bg-slate-700 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${CRIME_COLORS[c.crime_type] || "bg-slate-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-medium text-sm truncate">{c.title || `Case ${c.case_number}`}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[c.priority] || "bg-slate-600 text-white"}`}>{c.priority}</span>
                    </div>
                    <p className="text-slate-400 text-xs">{c.crime_type?.replace("_", " ")} · {c.location_city}, {c.location_country}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg shrink-0 ${c.status === "solved" ? "bg-green-900/50 text-green-400" : c.status === "open" ? "bg-orange-900/50 text-orange-400" : "bg-slate-600 text-slate-300"}`}>
                    {c.status?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wanted Suspects */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            ⚠️ Wanted / At Large
          </h2>
          {wantedSuspects.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <div className="text-3xl mb-2">✅</div>
              <p>No active wanted notices.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wantedSuspects.map(s => (
                <div key={s.id} className="bg-slate-700/50 rounded-xl p-3 border border-red-900/30 hover:border-red-500/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-800 to-red-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {s.full_name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{s.full_name}</p>
                      {s.alias && <p className="text-slate-400 text-xs">aka {s.alias}</p>}
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${s.threat_level === "extreme" ? "bg-red-900 text-red-300" : s.threat_level === "high" ? "bg-orange-900 text-orange-300" : "bg-yellow-900 text-yellow-300"}`}>
                          {s.threat_level} threat
                        </span>
                        {s.interpol_notice && <span className="text-xs bg-purple-900 text-purple-300 px-1.5 py-0.5 rounded-full">INTERPOL</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">📍 {s.last_known_location || "Unknown location"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Crime Breakdown */}
        {Object.keys(crimeBreakdown).length > 0 && (
          <div className="lg:col-span-3 bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <h2 className="font-bold text-white mb-4">📊 Crime Type Breakdown</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(crimeBreakdown).sort((a,b) => b[1]-a[1]).map(([type, count]) => (
                <div key={type} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${CRIME_COLORS[type] || "bg-slate-600"} bg-opacity-20`}>
                  <div className={`w-2 h-2 rounded-full ${CRIME_COLORS[type] || "bg-slate-400"}`} />
                  <span className="text-white text-sm font-medium capitalize">{type.replace("_", " ")}</span>
                  <span className="text-white/70 text-sm font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
