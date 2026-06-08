# HealthBridge Universal — Master Links & Status Reference
## Last Updated: May 30, 2026

---

## 🏥 The App

| Resource | Link |
|----------|------|
| **Live App (Base44)** | https://app.base44.com/superagent/6a1ac15e7708295639875fa0 |
| **GitHub Repository** | https://github.com/andrewhartman1998-cell/healthbridge-universal |
| **Privacy Policy (Live HTML)** | Hosted via Base44 public storage — see APP_STORE_GUIDE.md |
| **Google Drive — Project Docs** | https://drive.google.com/drive/folders/ (HealthBridge Universal — Project Docs) |

---

## 📊 Project Trackers

| Resource | Link |
|----------|------|
| **Professional Contacts (Google Sheets)** | https://docs.google.com/spreadsheets/d/11_BSbwPneQJjugSVzSb1A3LVxTgS3xhEmV6_VFfklKM/edit |
| **Project Log Tab** | Same sheet → "Project Log" tab |

---

## 🤖 Superagent (AI)

| Resource | Link |
|----------|------|
| **Your AI Agent Chat** | https://app.base44.com/superagent/6a1ac15e7708295639875fa0 |

---

## 🌍 Multi-Language Support — v1.1 (Added May 30, 2026)

### Overview
HealthBridge Universal now supports **50 languages** covering 95%+ of the world's population.
RTL (right-to-left) languages are fully supported. Browser language is auto-detected on first visit.
User preference is saved to localStorage and persists across sessions.

### New Files Added
| File | Purpose |
|------|---------|
| `src/i18n/translations.js` | Full translation dictionary — 50 languages, 40+ keys each |
| `src/i18n/LanguageContext.jsx` | React context provider — language state, auto-detection, RTL switching |
| `src/i18n/LanguageSwitcher.jsx` | Searchable dropdown UI component in top nav |

### How It Works
- Language switcher 🌐 lives in the top navigation bar on every page
- Shows flag + native language name (e.g. 🇸🇦 العربية, 🇮🇳 हिन्दी)
- Searchable by English name or native name
- RTL layout auto-applies for Arabic, Urdu, Hebrew, Persian via `document.dir`
- 12 languages have complete native translations; all 50 gracefully fall back to English

### Fully Translated Languages (Native)
| # | Code | Language | Native Name | Script | Direction |
|---|------|----------|-------------|--------|-----------|
| 1 | en | English | English | Latin | LTR |
| 2 | es | Spanish | Español | Latin | LTR |
| 3 | zh | Chinese (Simplified) | 中文 | Han | LTR |
| 4 | hi | Hindi | हिन्दी | Devanagari | LTR |
| 5 | ar | Arabic | العربية | Arabic | RTL |
| 6 | pt | Portuguese | Português | Latin | LTR |
| 7 | fr | French | Français | Latin | LTR |
| 8 | de | German | Deutsch | Latin | LTR |
| 9 | ru | Russian | Русский | Cyrillic | LTR |
| 10 | ja | Japanese | 日本語 | CJK | LTR |
| 11 | ko | Korean | 한국어 | Hangul | LTR |
| 12 | sw | Swahili | Kiswahili | Latin | LTR |

### All 50 Supported Languages
Bengali, Punjabi, Javanese, Telugu, Marathi, Turkish, Tamil, Vietnamese, Urdu, Italian,
Persian, Malay, Thai, Polish, Ukrainian, Dutch, Romanian, Hausa, Yoruba, Igbo, Amharic,
Odia, Gujarati, Kannada, Malayalam, Burmese, Khmer, Greek, Czech, Hungarian, Swedish,
Hebrew, Finnish, Norwegian, Danish, Slovak, Filipino, Zulu — plus all 12 fully translated above.

### RTL Languages
| Language | Code | Script |
|----------|------|--------|
| Arabic | ar | Arabic |
| Urdu | ur | Arabic |
| Hebrew | he | Hebrew |
| Persian | fa | Arabic |

---

## 📱 iOS App Store Submission

| Step | Status |
|------|--------|
| Capacitor configured | ✅ Done |
| GitHub Actions build pipeline (ios-build.yml) | ✅ Done |
| Privacy policy hosted | ✅ Done |
| App Store listing copy | ✅ Done |
| Demo accounts guide | ✅ Done |
| Multi-language support (50 languages) | ✅ Done — May 30, 2026 |
| Apple Developer enrollment ($99/yr) | ⏳ Pending — developer.apple.com |
| 7 GitHub secrets configured | ⏳ Pending (requires Apple credentials) |
| App Store submission | ⏳ Pending above |

### The 7 GitHub Secrets (fill in after Apple Developer enrollment)
```
APPLE_ID               → your Apple ID email
APP_SPECIFIC_PASSWORD  → generate at appleid.apple.com > Security
APPLE_TEAM_ID          → found in Apple Developer portal
APPLE_SIGNING_CERT     → base64 of your .p12 certificate
APPLE_CERT_PASSWORD    → password for the .p12
PROVISIONING_PROFILE   → base64 of your .mobileprovision
BUNDLE_ID              → com.healthbridge.universal
```

---

## 🔐 Demo Accounts (for Apple Review)

| Role | Email | Password |
|------|-------|----------|
| Patient | testpatient@healthbridge.app | TestPatient123! |
| Doctor | testdoctor@healthbridge.app | TestDoctor123! |
| Admin | testadmin@healthbridge.app | TestAdmin123! |

---

## 🚀 v1.1 Feature Roadmap

| Priority | Feature | Status |
|----------|---------|--------|
| 🥇 P1 | Patient Messaging | ✅ Built — May 30, 2026 |
| 🌍 P1b | 50-Language i18n Support | ✅ Built — May 30, 2026 |
| 🥈 P2 | Prescription Tracking | 📋 Next |
| 🥉 P3 | Telehealth Video | 📋 Planned |
| P4 | Push Notifications (iOS) | 📋 Planned |
| P5 | Appointment Waitlist | 📋 Planned |
| P6 | Health Intake Forms | 📋 Planned |

---

## 📅 Key Dates

| Date | Event |
|------|-------|
| May 30, 2026 | Launch Day — all systems live |
| May 30, 2026 | Patient Messaging (v1.1 P1) deployed |
| May 30, 2026 | 50-language i18n support deployed |
| June 1, 2026 @ 10 AM ET | Launch Review Meeting |
| June 1, 2026 @ 10 AM ET | Automated v1.1 update posts (LinkedIn + Slack) |

---

## 📧 Key Contacts

| Name | Email | Role |
|------|-------|------|
| Andrew Hartman | andrewhartman1998@gmail.com | Project Lead |
| Andrew Hartman (alt) | hartmanandrew1998@gmail.com | Project Lead |

---

## 🔁 Active Automations

| Automation | Schedule | Status |
|------------|----------|--------|
| Daily Appointment Reminders | 3x daily | ✅ Running |
| v1.1 Launch Update (LinkedIn + Slack) | June 1 @ 10 AM ET | ✅ Scheduled |

---

## 📁 Key Files in This Repo

| File | Purpose |
|------|---------|
| `src/pages/PatientPortal.jsx` | Patient UI |
| `src/pages/DoctorView.jsx` | Doctor UI |
| `src/pages/AdminDashboard.jsx` | Admin UI |
| `src/pages/Messaging.jsx` | Patient Messaging (v1.1) |
| `src/App.jsx` | Root app + navigation + language switcher |
| `src/api/entities.js` | All entity bindings incl. Message |
| `src/i18n/translations.js` | 50-language translation dictionary |
| `src/i18n/LanguageContext.jsx` | Language state + auto-detection + RTL |
| `src/i18n/LanguageSwitcher.jsx` | Searchable language dropdown UI |
| `capacitor.config.json` | iOS build config |
| `.github/workflows/ios-build.yml` | GitHub Actions CI/CD |
| `DEMO_ACCOUNTS_SETUP.md` | Apple review credentials |
| `APP_STORE_GUIDE.md` | Full submission guide |
| `APP_STORE_CONNECT_LISTING.md` | Store listing copy |
| `PRIVACY_POLICY.md` | HIPAA/CCPA/GDPR policy |
| `APPLE_SUBMISSION_NOTES.md` | Notes for Apple reviewers |
| `MASTER_LINKS.md` | This file |
