import { useState, useEffect } from "react";
import { SafeMatchProfile } from "@/api/entities";
import { useLanguage } from "../i18n/LanguageContext";

export default function Discover({ currentUser }) {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [interested, setInterested] = useState([]);

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const all = await SafeMatchProfile.filter({ verified_status: "verified", is_banned: false, visibility: "public" });
      setProfiles(all.filter(p => p.user_id !== currentUser?.id));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const pass = () => setCurrent(c => c + 1);
  const sendInterest = () => {
    setInterested(prev => [...prev, profiles[current]?.id]);
    setCurrent(c => c + 1);
  };

  const profile = profiles[current];

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full" />
    </div>
  );

  if (!profile || current >= profiles.length) return (
    <div className="flex flex-col items-center justify-center h-96 text-center px-6">
      <div className="text-5xl mb-4">💜</div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">{t("noMatches")}</h2>
      <p className="text-gray-400 text-sm">Check back soon — new verified members join daily.</p>
      <button onClick={() => { setCurrent(0); loadProfiles(); }}
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">
        Refresh
      </button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Safety Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 flex items-center gap-2 mb-4">
        <span className="text-purple-600">🛡️</span>
        <span className="text-purple-700 text-xs font-medium">{t("safeSpace")} All profiles are verified.</span>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Photo */}
        <div className="relative bg-gradient-to-br from-purple-200 to-pink-200 h-80 flex items-center justify-center">
          {profile.photos?.[0] ? (
            <img src={profile.photos[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="text-8xl">👤</div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            {profile.verified_status === "verified" && (
              <span className="bg-white/90 text-purple-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                ✅ {t("verified")}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h2 className="text-white text-2xl font-bold">{profile.display_name}, {profile.age}</h2>
            <p className="text-white/80 text-sm">📍 {profile.location_city || "—"}</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{profile.gender_identity}</span>
            <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">{profile.orientation}</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
              🌟 {profile.trust_score || 100}
            </span>
          </div>

          {profile.bio && <p className="text-gray-600 text-sm mb-3 line-clamp-3">{profile.bio}</p>}

          {profile.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.interests.slice(0, 5).map((i, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{i}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={pass}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-2xl font-semibold hover:bg-gray-50 transition-colors">
              Pass
            </button>
            <button onClick={sendInterest}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity">
              💜 {t("sendInterest")}
            </button>
          </div>

          {/* Safety actions */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <button onClick={() => setShowReport(true)}
              className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              🚩 {t("report")}
            </button>
            <button className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              🚫 {t("block")}
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <p className="text-center text-gray-400 text-xs mt-4">{current + 1} of {profiles.length} profiles</p>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">🚩 {t("reportUser")}</h3>
            {["harassment", "fake_profile", "inappropriate_content", "threats", "spam", "other"].map(r => (
              <button key={r} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-700 text-sm font-medium capitalize mb-1 transition-colors"
                onClick={() => { setShowReport(false); pass(); }}>
                {r.replace("_", " ")}
              </button>
            ))}
            <button onClick={() => setShowReport(false)}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium mt-2 hover:bg-gray-200">
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
