import { useState, useEffect } from "react";
import { User } from "./api/entities";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Suspects from "./pages/Suspects";
import EvidenceLog from "./pages/EvidenceLog";
import Officers from "./pages/Officers";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
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
      </div>
    </div>
  );

  if (!user) return <Login onLogin={checkAuth} />;

  const NAV = [
    { id: "dashboard", icon: "📊", label: t("dashboard") },
    { id: "cases", icon: "📁", label: t("cases") },
    { id: "suspects", icon: "👤", label: t("suspects") },
    { id: "evidence", icon: "🔬", label: t("evidence") },
    { id: "officers", icon: "👮", label: t("officers") },
  ];

  const renderPage = () => {
    switch(page) {
      case "cases": return <Cases />;
      case "suspects": return <Suspects />;
      case "evidence": return <EvidenceLog />;
      case "officers": return <Officers />;
      default: return <Dashboard currentUser={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-800 border-r border-slate-700 shrink-0">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">CrimeTrack</p>
              <p className="text-slate-400 text-xs">Universal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${page === n.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
              <span className="text-lg">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="mb-3"><LanguageSwitcher /></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.full_name?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.full_name || user.email}</p>
              <p className="text-slate-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">{t("logout")}</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <span className="text-white font-bold text-sm">CrimeTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={logout} className="text-xs text-slate-400 px-2 py-1">{t("logout")}</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{renderPage()}</main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex bg-slate-800 border-t border-slate-700">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${page === n.id ? "text-blue-400" : "text-slate-500"}`}>
              <span className="text-lg mb-0.5">{n.icon}</span>
              <span className="hidden xs:inline">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
