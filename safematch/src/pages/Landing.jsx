import { useState } from "react";
import { User } from "@/api/entities";
import { SafeMatchApplication } from "@/api/entities";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function Landing({ onLogin }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState("home"); // home | login | apply
  const [form, setForm] = useState({ email: "", password: "" });
  const [appForm, setAppForm] = useState({ applicant_name: "", email: "", phone: "", gender_identity: "", reason: "", references: "", background_check_consent: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appSubmitted, setAppSubmitted] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await User.login(form.email, form.password);
      onLogin();
    } catch {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SafeMatchApplication.create({ ...appForm, status: "pending" });
      setAppSubmitted(true);
    } catch { setError("Submission failed. Please try again."); }
    setLoading(false);
  };

  if (mode === "login") return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛡️</div>
          <h1 className="text-2xl font-bold text-purple-900">SafeMatch</h1>
          <p className="text-gray-500 text-sm mt-1">{t("tagline")}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" required value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
          <input type="password" placeholder="Password" required value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? t("loading") : t("signIn")}
          </button>
        </form>
        <button onClick={() => setMode("home")} className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600">{t("back")}</button>
      </div>
    </div>
  );

  if (mode === "apply") return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        {appSubmitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-purple-900 mb-2">Application Submitted</h2>
            <p className="text-gray-500 text-sm">Our safety team will review your application within 48 hours. You'll receive an email with the decision.</p>
            <button onClick={() => setMode("home")} className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">{t("back")}</button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">📋</div>
              <h2 className="text-xl font-bold text-purple-900">{t("applicationTitle")}</h2>
              <p className="text-gray-500 text-sm mt-1">{t("applicationSubtitle")}</p>
            </div>
            <form onSubmit={handleApply} className="space-y-3">
              <input required placeholder="Full Name" value={appForm.applicant_name}
                onChange={e => setAppForm({...appForm, applicant_name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <input required type="email" placeholder="Email" value={appForm.email}
                onChange={e => setAppForm({...appForm, email: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <input required placeholder="Phone Number" value={appForm.phone}
                onChange={e => setAppForm({...appForm, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <input required placeholder="Gender Identity" value={appForm.gender_identity}
                onChange={e => setAppForm({...appForm, gender_identity: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <textarea required rows={3} placeholder="Why do you want to join SafeMatch? (min. 100 words)" value={appForm.reason}
                onChange={e => setAppForm({...appForm, reason: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
              <textarea rows={2} placeholder="References (optional — name + contact)" value={appForm.references}
                onChange={e => setAppForm({...appForm, references: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required checked={appForm.background_check_consent}
                  onChange={e => setAppForm({...appForm, background_check_consent: e.target.checked})}
                  className="mt-1 accent-purple-600" />
                <span className="text-xs text-gray-600">I consent to a background check and agree to SafeMatch's community guidelines and safety policies.</span>
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50">
                {loading ? t("loading") : "Submit Application"}
              </button>
            </form>
            <button onClick={() => setMode("home")} className="mt-3 w-full text-center text-sm text-gray-400 hover:text-gray-600">{t("back")}</button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-600 flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <span>🛡️</span><span>SafeMatch</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button onClick={() => setMode("login")} className="px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">{t("signIn")}</button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="text-7xl mb-6">🛡️💜</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SafeMatch</h1>
        <p className="text-xl text-white/80 mb-2">{t("tagline")}</p>
        <p className="text-white/60 max-w-md mb-10 text-sm">A safety-first dating platform built for women and LGBTQ+ users. Every member is verified. Every interaction is protected.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button onClick={() => setMode("login")}
            className="px-8 py-4 bg-white text-purple-900 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-colors shadow-xl">
            {t("signIn")} 💜
          </button>
          <button onClick={() => setMode("apply")}
            className="px-8 py-4 bg-white/20 text-white border-2 border-white/40 rounded-2xl font-bold text-lg hover:bg-white/30 transition-colors">
            {t("apply")}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            { icon: "✅", title: "ID Verified", desc: "Every member manually verified by our safety team before they can interact." },
            { icon: "🤖", title: "AI Moderation", desc: "Every message is scanned before delivery. Harassment never reaches you." },
            { icon: "🚨", title: "One-Tap Safety", desc: "Block, report, or emergency exit on every screen. Always one tap away." },
          ].map((f, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-left border border-white/20">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-bold mb-1">{f.title}</h3>
              <p className="text-white/60 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-white/40 text-xs pb-6">
        SafeMatch — Built for safety. Designed for connection. 🌍 50 languages supported.
      </div>
    </div>
  );
}
