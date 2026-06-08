import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import Login from "./pages/Login";
import PatientPortal from "./pages/PatientPortal";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorView from "./pages/DoctorView";
import Messaging from "./pages/Messaging";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import { useLanguage } from "./i18n/LanguageContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const { t, lang } = useLanguage();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg font-medium">{t("appName")}</p>
          <p className="text-sm opacity-70 mt-1">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  const navItems = [
    { id: "home", label: t("home"), icon: "🏠" },
    { id: "messages", label: t("messages"), icon: "💬" },
  ];

  const renderPage = () => {
    if (activePage === "messages") return <Messaging currentUser={user} />;
    switch (user.role) {
      case "admin": return <AdminDashboard />;
      case "doctor": return <DoctorView />;
      case "patient":
      default: return <PatientPortal />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-blue-700">🏥 HealthBridge</span>
          <span className="text-xs text-gray-400 hidden sm:inline">Universal</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                activePage === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <span className="text-xs text-gray-500 hidden sm:inline">{user.full_name || user.email}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            user.role === "admin" ? "bg-purple-100 text-purple-700" :
            user.role === "doctor" ? "bg-blue-100 text-blue-700" :
            "bg-green-100 text-green-700"
          }`}>{user.role}</span>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
}
