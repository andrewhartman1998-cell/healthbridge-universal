import { useState, useEffect } from "react";
import { SafeMatchProfile } from "@/api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const INTERESTS = ["Hiking","Reading","Music","Travel","Cooking","Art","Fitness","Movies","Gaming","Yoga","Photography","Volunteering","Dancing","Nature","Meditation"];

export default function Profile({ currentUser }) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const profiles = await SafeMatchProfile.filter({ user_id: currentUser?.id });
      if (profiles[0]) { setProfile(profiles[0]); setForm(profiles[0]); }
      else { setEditing(true); }
    } catch (e) { console.error(e); }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (profile) {
        await SafeMatchProfile.update(profile.id, form);
      } else {
        const created = await SafeMatchProfile.create({ ...form, user_id: currentUser?.id, verified_status: "pending", trust_score: 100, flag_count: 0, is_banned: false, role: "member" });
        setProfile(created);
      }
      setSaved(true); setEditing(false);
      setTimeout(() => setSaved(false), 2000);
      loadProfile();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const toggleInterest = (interest) => {
    const current = form.interests || [];
    setForm({ ...form, interests: current.includes(interest) ? current.filter(i => i !== interest) : [...current, interest] });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
            {profile?.display_name?.[0]?.toUpperCase() || "👤"}
          </div>
          <h2 className="text-white text-xl font-bold">{profile?.display_name || currentUser?.full_name || "Your Profile"}</h2>
          {profile?.verified_status === "verified" && (
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">
              ✅ {t("verified")}
            </span>
          )}
          {profile?.verified_status === "pending" && (
            <span className="inline-flex items-center gap-1 bg-yellow-400/30 text-white text-xs px-3 py-1 rounded-full mt-2">
              ⏳ Verification Pending
            </span>
          )}
        </div>

        <div className="p-6">
          {saved && <div className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-xl mb-4 text-center">✅ Profile saved!</div>}

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Display Name</label>
                  <input value={form.display_name || ""} onChange={e => setForm({...form, display_name: e.target.value})}
                    placeholder="How you appear to others" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t("age")}</label>
                  <input type="number" value={form.age || ""} onChange={e => setForm({...form, age: parseInt(e.target.value)})}
                    placeholder="Age" min="18" max="99" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t("gender")}</label>
                  <input value={form.gender_identity || ""} onChange={e => setForm({...form, gender_identity: e.target.value})}
                    placeholder="e.g. Woman, Non-binary..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{t("orientation")}</label>
                  <input value={form.orientation || ""} onChange={e => setForm({...form, orientation: e.target.value})}
                    placeholder="e.g. Lesbian, Bisexual..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">City (general area only)</label>
                <input value={form.location_city || ""} onChange={e => setForm({...form, location_city: e.target.value})}
                  placeholder="e.g. New York, London..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t("bio")}</label>
                <textarea rows={3} value={form.bio || ""} onChange={e => setForm({...form, bio: e.target.value})}
                  placeholder="Tell others a bit about yourself..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">{t("interests")}</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${(form.interests || []).includes(i) ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t("visibility")}</label>
                <select value={form.visibility || "public"} onChange={e => setForm({...form, visibility: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="public">Public — anyone can see me</option>
                  <option value="matches_only">Matches only</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-sm text-gray-700 font-medium">{t("showOnline")}</label>
                <button onClick={() => setForm({...form, show_online_status: !form.show_online_status})}
                  className={`w-11 h-6 rounded-full transition-colors ${form.show_online_status ? "bg-purple-600" : "bg-gray-300"} relative`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.show_online_status ? "left-6" : "left-1"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">{t("cancel")}</button>
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? t("loading") : t("save")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Age</span><p className="font-medium mt-0.5">{profile?.age || "—"}</p></div>
                <div><span className="text-gray-400">Location</span><p className="font-medium mt-0.5">📍 {profile?.location_city || "—"}</p></div>
                <div><span className="text-gray-400">Gender</span><p className="font-medium mt-0.5">{profile?.gender_identity || "—"}</p></div>
                <div><span className="text-gray-400">Orientation</span><p className="font-medium mt-0.5">{profile?.orientation || "—"}</p></div>
              </div>

              {profile?.bio && <div><p className="text-gray-400 text-xs mb-1">About</p><p className="text-gray-700 text-sm">{profile.bio}</p></div>}

              {profile?.interests?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i, idx) => <span key={idx} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{i}</span>)}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-purple-600">🌟</span>
                <span className="text-sm text-gray-700 font-medium">{t("trustScore")}: {profile?.trust_score || 100}/100</span>
              </div>

              <button onClick={() => setEditing(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90">
                ✏️ {t("editProfile")}
              </button>

              <button className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50">
                🗑️ {t("deleteAccount")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="mt-4 bg-purple-50 rounded-2xl p-4">
        <h3 className="font-semibold text-purple-900 text-sm mb-2">🛡️ {t("safetyTips")}</h3>
        <ul className="space-y-1.5 text-xs text-purple-700">
          <li>• Never share your home address or exact location</li>
          <li>• Meet in public places for first dates</li>
          <li>• Tell a friend where you're going</li>
          <li>• Trust your instincts — report anything that feels wrong</li>
          <li>• Use the emergency exit button if you ever feel unsafe</li>
        </ul>
      </div>
    </div>
  );
}
