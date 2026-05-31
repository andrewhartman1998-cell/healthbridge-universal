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
      label: "Intelligence",
      items: [
        { id: "dashboard", icon: "📊", label: t("dashboard") },
        { id: "cases", icon: "📁", label: t("cases") },
        { id: "evidence", icon: "🔬", label: t("evidence") },
      ]
    },
    {
      label: "Pursuit",
      items: [
        { id: "pursuit", icon: "🔴", label: "Active Pursuit" },
        { id: "suspects", icon: "👤", label: t("suspects") },
        { id: "arrest", icon: "🔒", label: "Arrest & Booking" },
        { id: "interpol", icon: "🌍", label: "INTERPOL" },
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
      default: return <Dashboard currentUser={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-slate-800 border-r border-slate-700 shrink-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">CrimeTrack</p>
              <p className="text-blue-400 text-xs font-medium">Universal v2.0</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">System Online</span>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-4">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider px-3 mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(n => (
                  <button key={n.id} onClick={() => setPage(n.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${page === n.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
                    <span className="text-base">{n.icon}</span>
                    {n.label}
                    {n.id === "pursuit" && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="mb-3"><LanguageSwitcher /></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.full_name || user.email}</p>
              <p className="text-slate-400 text-xs capitalize">{user.role} · Active</p>
            </div>
          </div>
          <button onClick={logout} className="w-full py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">{t("logout")}</button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <div>
              <span className="text-white font-bold text-sm">CrimeTrack</span>
              <span className="text-blue-400 text-xs ml-1">Universal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white bg-slate-700 rounded-lg">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 p-3 z-40">
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

        {/* Mobile Bottom Nav — key pages only */}
        <nav className="md:hidden flex bg-slate-800 border-t border-slate-700 overflow-x-auto">
          {[
            { id: "dashboard", icon: "📊" },
            { id: "pursuit", icon: "🔴" },
            { id: "cases", icon: "📁" },
            { id: "suspects", icon: "👤" },
            { id: "arrest", icon: "🔒" },
            { id: "interpol", icon: "🌍" },
          ].map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors min-w-[50px] relative ${page === n.id ? "text-blue-400" : "text-slate-500"}`}>
              <span className="text-lg">{n.icon}</span>
              {n.id === "pursuit" && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
