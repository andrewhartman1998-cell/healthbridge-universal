import { useState, useEffect } from "react";
import { User } from "./api/entities";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Suspects from "./pages/Suspects";
import EvidenceLog from "./pages/EvidenceLog";
import Officers from "./pages/Officers";
import ActivePursuit from "./pages/ActivePursuit";
import InterpolAlerts from "./pages/InterpolAlerts";
import ArrestBooking from "./pages/ArrestBooking";
import CaseConnections from "./pages/CaseConnections";
import IntelSharing from "./pages/IntelSharing";
import AlertSystem from "./pages/AlertSystem";
import HeatMap from "./pages/HeatMap";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { checkAuth(); }, []);
  const checkAuth = async () => {
    try { setUser(await User.me()); } catch { setUser(null); }
    setLoading(false);
  };
  const logout = async () => { await User.logout(); setUser(null); };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🌐</div>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-slate-400 text-sm font-medium">CrimeTrack Universal</p>
        <p className="text-slate-600 text-xs mt-1">Global Law Enforcement Intelligence</p>
      </div>
    </div>
  );

  if (!user) return <Login onLogin={checkAuth} />;

  const NAV_GROUPS = [
    {
      label: "Overview",
      items: [
        { id: "dashboard", icon: "📊", label: t("dashboard") },
        { id: "heatmap", icon: "🗺️", label: "Heat Map" },
        { id: "alerts", icon: "🔔", label: "Alerts", pulse: true },
      ]
    },
    {
      label: "Cases & Evidence",
      items: [
        { id: "cases", icon: "📁", label: t("cases") },
        { id: "evidence", icon: "🔬", label: t("evidence") },
        { id: "connections", icon: "🧠", label: "Connections" },
      ]
    },
    {
      label: "Pursuit & Arrest",
      items: [
        { id: "pursuit", icon: "🔴", label: "Active Pursuit", pulse: true },
        { id: "suspects", icon: "👤", label: t("suspects") },
        { id: "arrest", icon: "🔒", label: "Arrest & Booking" },
      ]
    },
    {
      label: "Intelligence",
      items: [
        { id: "interpol", icon: "🌍", label: "INTERPOL" },
        { id: "intel", icon: "📡", label: "Intel Sharing" },
      ]
    },
    {
      label: "Personnel",
      items: [
        { id: "officers", icon: "👮", label: t("officers") },
      ]
    }
  ];

  const ALL_NAV = NAV_GROUPS.flatMap(g => g.items);

  const renderPage = () => {
    switch(page) {
      case "cases": return <Cases />;
      case "suspects": return <Suspects />;
      case "evidence": return <EvidenceLog />;
      case "officers": return <Officers />;
      case "pursuit": return <ActivePursuit />;
      case "interpol": return <InterpolAlerts />;
      case "arrest": return <ArrestBooking />;
      case "connections": return <CaseConnections />;
      case "intel": return <IntelSharing />;
      case "alerts": return <AlertSystem />;
      case "heatmap": return <HeatMap />;
      default: return <Dashboard currentUser={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-slate-800 border-r border-slate-700 shrink-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">CrimeTrack</p>
              <p className="text-blue-400 text-xs font-medium">Universal v3.0</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs">System Online · 50 Languages</span>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto space-y-3">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider px-3 mb-1">{group.label}</p>
              {group.items.map(n => (
                <button key={n.id} onClick={() => setPage(n.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left mb-0.5 ${page === n.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
                  <span className="text-base">{n.icon}</span>
                  <span className="flex-1">{n.label}</span>
                  {n.pulse && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="mb-3"><LanguageSwitcher /></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.full_name || user.email}</p>
              <p className="text-slate-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">{t("logout")}</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <span className="text-white font-bold text-sm">CrimeTrack <span className="text-blue-400">Universal</span></span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-white bg-slate-700 rounded-lg text-sm">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 p-3 z-40 max-h-96 overflow-y-auto">
            {ALL_NAV.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 text-left ${page === n.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700"}`}>
                <span>{n.icon}</span>{n.label}
              </button>
            ))}
            <button onClick={logout} className="w-full mt-2 py-2 text-xs text-slate-500 hover:text-white">{t("logout")}</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{renderPage()}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex bg-slate-800 border-t border-slate-700">
          {[
            { id: "dashboard", icon: "📊" },
            { id: "alerts", icon: "🔔", pulse: true },
            { id: "pursuit", icon: "🔴", pulse: true },
            { id: "cases", icon: "📁" },
            { id: "heatmap", icon: "🗺️" },
            { id: "interpol", icon: "🌍" },
          ].map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex-1 flex flex-col items-center py-2.5 relative ${page === n.id ? "text-blue-400" : "text-slate-500"}`}>
              <span className="text-lg">{n.icon}</span>
              {n.pulse && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
