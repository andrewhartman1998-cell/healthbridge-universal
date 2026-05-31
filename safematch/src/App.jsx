import { useState, useEffect } from "react";
import { User } from "@/api/entities";
import Landing from "./pages/Landing";
import Discover from "./pages/Discover";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("discover");
  const { t } = useLanguage();

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try { setUser(await User.me()); } catch { setUser(null); }
    setLoading(false);
  };

  const logout = async () => { await User.logout(); setUser(null); };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-5xl mb-4">🛡️</div>
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-3" />
        <p className="font-semibold">SafeMatch</p>
      </div>
    </div>
  );

  if (!user) return <Landing onLogin={checkAuth} />;

  const isAdmin = user.role === "admin";

  const NAV = isAdmin
    ? [{ id: "admin", icon: "🛡️", label: t("admin") }]
    : [
        { id: "discover", icon: "✨", label: t("discover") },
        { id: "messages", icon: "💬", label: t("messages") },
        { id: "profile", icon: "👤", label: t("profile") },
      ];

  const renderPage = () => {
    if (isAdmin) return <AdminDashboard />;
    switch (page) {
      case "messages": return <Messages currentUser={user} />;
      case "profile": return <Profile currentUser={user} />;
      default: return <Discover currentUser={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-purple-900 text-lg">
            <span>🛡️</span><span>SafeMatch</span>
          </div>
          <div className="flex items-center gap-1">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${page === n.id ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                <span>{n.icon}</span><span className="hidden sm:inline">{n.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {/* Emergency Exit */}
            <button onClick={() => window.location.href = "https://google.com"}
              className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors"
              title="Emergency Exit — leaves app immediately">
              🚨 Exit
            </button>
            <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5">{t("logout")}</button>
          </div>
        </div>
      </nav>

      <main className="flex-1">{renderPage()}</main>

      {/* Bottom Nav (mobile) */}
      {!isAdmin && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors ${page === n.id ? "text-purple-600" : "text-gray-400"}`}>
              <span className="text-xl mb-0.5">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
