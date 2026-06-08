# HealthBridge Universal — Apple App Review Submission Notes
## Prepared for App Store Connect → App Review Information

---

## NOTES FOR APPLE REVIEWER
*(Paste this directly into the "Notes" field in App Store Connect)*

```
Thank you for reviewing HealthBridge Universal.

HealthBridge is a healthcare management platform for patients, doctors, and administrators.
It uses role-based access control, so each user type sees a completely different interface.
Please use the demo credentials below to review all three experiences.

──────────────────────────────────────
DEMO LOGIN CREDENTIALS
──────────────────────────────────────

PATIENT VIEW
Email:    testpatient@healthbridge.app
Password: TestPatient123!

What you'll see:
• Health dashboard with upcoming appointments and health overview
• Appointments tab — confirmed, pending, and completed visit history
• Medical Records tab — lab results, prescriptions, visit summaries
• Notifications tab — real-time alerts with unread badge count
• Mark-as-read functionality on notifications

──────────────────────────────────────

DOCTOR VIEW
Email:    testdoctor@healthbridge.app
Password: TestDoctor123!

What you'll see:
• Today's appointment schedule with patient cards
• Upcoming appointments list
• Patient list with searchable full profiles
• Patient detail view — health flags, allergies, chronic conditions, records
• Add clinical note form — visit summary, lab result, prescription, imaging, referral
• One-tap patient notification on record save

──────────────────────────────────────

ADMIN VIEW
Email:    testadmin@healthbridge.app
Password: TestAdmin123!

What you'll see:
• Operations dashboard — stats cards, today's schedule, pending appointments
• Patients tab — full roster with search, add/edit patient profiles
• Appointments tab — schedule, confirm, complete, cancel appointments
• Doctors tab — staff directory with specialties and departments

──────────────────────────────────────

TECHNICAL NOTES

• Internet connection required — the app communicates with a secure cloud backend
• All data shown is synthetic test data — no real patient information is present
• Role routing is automatic: logging in with each account above routes to the
  correct interface immediately — no manual navigation required
• Push notifications are supported but require device-level permission grant
• The app is optimized for iPhone and iPad (universal binary)

──────────────────────────────────────

PRIVACY & HEALTHCARE COMPLIANCE

• Privacy Policy is live at: https://healthbridge.app/privacy
• The app is designed with HIPAA best practices for data security
• All health data is encrypted in transit (TLS 1.2+) and at rest (AES-256)
• Role-based access ensures users can only see data they are authorized to view
• No third-party advertising SDKs or data brokers are used

──────────────────────────────────────

ABOUT THIS APP

HealthBridge Universal was built to improve healthcare access for underserved communities.
It provides enterprise-grade healthcare management tools to community clinics, rural
practices, and growing medical organizations — without enterprise complexity or cost.

We have taken great care to ensure the app meets Apple's guidelines for the Medical
category, including appropriate age rating (17+), clear privacy disclosures, and
responsible handling of health information.

We are committed to a quick and smooth review. If any questions arise, please don't
hesitate to reach out via the App Review contact form and we will respond within 24 hours.

Thank you for your time and for the important work you do maintaining App Store quality.
```

---

## EXPORT COMPLIANCE
*(App Store Connect → Pricing and Availability)*

**Question: Does your app use encryption beyond what is provided by the OS?**
Answer: **No**

The app uses only standard HTTPS/TLS for data transmission (provided by the iOS operating
system and standard networking libraries). No custom encryption algorithms are implemented.
Select "No" for all export compliance questions.

---

## CONTENT RIGHTS
*(App Store Connect → App Information)*

**Does your app contain, display, or access third-party content?**
Answer: **No**

All content is user-generated within the app (patient records, appointments, clinical notes).
No third-party content is displayed.

---

## ADVERTISING IDENTIFIER (IDFA)
Answer: **No** — the app does not use the Advertising Identifier (IDFA).
No advertising SDKs are present.

---

## SIGN-IN REQUIRED
Answer: **Yes** — the app requires a user account to function (role-based healthcare platform).
Demo credentials are provided above.

---

## ADDITIONAL REVIEW TIPS

### If the reviewer cannot log in:
- Ensure the test device has an active internet connection
- Try force-closing and relaunching the app before logging in
- If login fails, it may indicate the demo account needs to be recreated in the backend

### If the reviewer sees a blank/empty state:
- Log out and log back in — the app fetches data on login
- Ensure the correct demo account is being used (each role has different data)

### App category justification (Medical):
HealthBridge directly manages Protected Health Information (PHI) including medical records,
diagnoses, prescriptions, and appointment history. The Medical category is the correct
classification per Apple's App Store category definitions.

### Age rating justification (17+):
The app displays medical and treatment information (lab results, diagnoses, prescription
details) which warrants the 17+ age rating per Apple's rating guidelines.

---

*Prepared May 30, 2026 — HealthBridge Universal v1.0.0*
