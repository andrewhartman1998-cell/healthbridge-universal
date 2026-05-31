import { useState, useEffect } from "react";
import { SafeMatchProfile, SafeMatchReport, SafeMatchApplication } from "@/api/entities";
import { useLanguage } from "../i18n/LanguageContext";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, banned: 0, openReports: 0, pendingApps: 0 });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [apps, rpts, profs] = await Promise.all([
        SafeMatchApplication.list(),
        SafeMatchReport.list(),
        SafeMatchProfile.list(),
      ]);
      setApplications(apps); setReports(rpts); setProfiles(profs);
      setStats({
        total: profs.length,
        verified: profs.filter(p => p.verified_status === "verified").length,
        pending: profs.filter(p => p.verified_status === "pending").length,
        banned: profs.filter(p => p.is_banned).length,
        openReports: rpts.filter(r => r.status === "open").length,
        pendingApps: apps.filter(a => a.status === "pending").length,
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const reviewApp = async (id, status, notes = "") => {
    await SafeMatchApplication.update(id, { status, admin_notes: notes });
    loadAll();
  };

  const resolveReport = async (id, action) => {
    await SafeMatchReport.update(id, { status: "resolved", action_taken: action });
    loadAll();
  };

  const toggleBan = async (profile, ban) => {
    await SafeMatchProfile.update(profile.id, { is_banned: ban, ban_reason: ban ? "Admin action" : "" });
    loadAll();
  };

  const verifyProfile = async (id) => {
    await SafeMatchProfile.update(id, { verified_status: "verified" });
    loadAll();
  };

  const TABS = [
    { id: "applications", label: "Applications", count: stats.pendingApps, icon: "📋" },
    { id: "reports", label: "Reports", count: stats.openReports, icon: "🚩" },
    { id: "members", label: "Members", count: stats.total, icon: "👥" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🛡️ {t("adminDashboard")}</h1>
        <p className="text-gray-500 text-sm mt-1">Review applications, moderate reports, and manage members.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Members", val: stats.total, color: "bg-purple-50 text-purple-700" },
          { label: "Verified", val: stats.verified, color: "bg-green-50 text-green-700" },
          { label: "Pending Verify", val: stats.pending, color: "bg-yellow-50 text-yellow-700" },
          { label: "Banned", val: stats.banned, color: "bg-red-50 text-red-700" },
          { label: "Open Reports", val: stats.openReports, color: "bg-orange-50 text-orange-700" },
          { label: "Pending Apps", val: stats.pendingApps, color: "bg-blue-50 text-blue-700" },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-xl p-3 text-center col-span-1`}>
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {TABS.map(tab_ => (
          <button key={tab_.id} onClick={() => setTab(tab_.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === tab_.id ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
            {tab_.icon} {tab_.label}
            {tab_.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === tab_.id ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>{tab_.count}</span>}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="animate-spin w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full" /></div> : (

        <div className="space-y-3">
          {/* Applications */}
          {tab === "applications" && applications.filter(a => a.status === "pending").map(app => (
            <div key={app.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{app.applicant_name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{t("pending")}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{app.email} · {app.phone}</p>
                  <p className="text-xs text-gray-500 mb-1"><span className="font-medium">Gender:</span> {app.gender_identity}</p>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">{app.reason}</p>
                  {app.references && <p className="text-xs text-gray-500"><span className="font-medium">References:</span> {app.references}</p>}
                  <p className="text-xs mt-1 text-gray-400">Background check consent: {app.background_check_consent ? "✅ Yes" : "❌ No"}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => reviewApp(app.id, "approved")}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700">
                    ✅ {t("approveUser")}
                  </button>
                  <button onClick={() => reviewApp(app.id, "denied")}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600">
                    ❌ {t("denyUser")}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {tab === "applications" && applications.filter(a => a.status === "pending").length === 0 && (
            <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">📋</div><p>No pending applications.</p></div>
          )}

          {/* Reports */}
          {tab === "reports" && reports.filter(r => r.status === "open").map(rep => (
            <div key={rep.id} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-500 font-bold text-sm">🚩 {rep.reason?.replace("_", " ")}</span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Open</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Reported user: <span className="font-medium text-gray-700">{rep.reported_user_name || rep.reported_user_id}</span></p>
                  <p className="text-sm text-gray-700">{rep.description}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => resolveReport(rep.id, "warning")}
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-xl text-xs font-semibold">⚠️ Warning</button>
                  <button onClick={() => resolveReport(rep.id, "temp_ban")}
                    className="px-3 py-1.5 bg-orange-500 text-white rounded-xl text-xs font-semibold">⏸ Temp Ban</button>
                  <button onClick={() => resolveReport(rep.id, "permanent_ban")}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold">🚫 {t("banUser")}</button>
                  <button onClick={() => resolveReport(rep.id, "none")}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold">Dismiss</button>
                </div>
              </div>
            </div>
          ))}
          {tab === "reports" && reports.filter(r => r.status === "open").length === 0 && (
            <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">✅</div><p>No open reports. Community is safe.</p></div>
          )}

          {/* Members */}
          {tab === "members" && profiles.map(p => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0">
                {p.display_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{p.display_name || "Unnamed"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.verified_status === "verified" ? "bg-green-100 text-green-700" : p.verified_status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{p.verified_status}</span>
                  {p.is_banned && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Banned</span>}
                  <span className="text-xs text-gray-400">🌟 {p.trust_score || 100} · 🚩 {p.flag_count || 0}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {p.verified_status === "pending" && (
                  <button onClick={() => verifyProfile(p.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">Verify</button>
                )}
                {!p.is_banned ? (
                  <button onClick={() => toggleBan(p, true)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200">Ban</button>
                ) : (
                  <button onClick={() => toggleBan(p, false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200">Unban</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
