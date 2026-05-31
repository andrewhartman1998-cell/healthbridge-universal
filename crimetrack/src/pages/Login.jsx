import { useState } from "react";
import { User } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function Login({ onLogin }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try { await User.login(form.email, form.password); onLogin(); }
    catch { setError("Invalid credentials. Contact your administrator."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4"><LanguageSwitcher /></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌐</div>
          <h1 className="text-3xl font-bold text-white">{t("appName")}</h1>
          <p className="text-slate-400 text-sm mt-2">{t("tagline")}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs bg-blue-900/50 text-blue-300 border border-blue-700/40 px-2 py-1 rounded-full">🔒 Secure Access</span>
            <span className="text-xs bg-green-900/50 text-green-300 border border-green-700/40 px-2 py-1 rounded-full">🌍 30+ Languages</span>
            <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-700/40 px-2 py-1 rounded-full">🛡️ Encrypted</span>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-white font-bold text-lg mb-1">{t("signIn")}</h2>
          <p className="text-slate-400 text-sm mb-5">Authorized law enforcement personnel only.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Badge Email / Officer ID</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="officer@department.gov"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Secure Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••••"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-700/40 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
              {loading ? t("loading") : `🔐 ${t("signIn")}`}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-700">
            <p className="text-slate-500 text-xs text-center">
              All access is logged and monitored. Unauthorized use is a criminal offense.
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          CrimeTrack Universal v1.0 · Built by Andrew Hartman · Secure encrypted platform
        </p>
      </div>
    </div>
  );
}
