# SafeMatch — Architecture & Safety Design
## Version 1.0 | May 30, 2026

---

## Mission
A safety-first dating platform built for women and LGBTQ users.
Every design decision prioritizes user protection over engagement metrics.

---

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| Member | Women / LGBTQ users | Full platform access after ID verification |
| Applicant | Men applying to join | Limited — application form only until approved |
| Admin | Platform moderators | Full moderation dashboard |

---

## Core Entities

### User (extended)
- role, verified_status, trust_score, flag_count, is_banned, ban_reason
- gender_identity, orientation, location_city (never exact)
- id_verified_at, photo_verified, phone_verified

### Profile
- display_name, bio, age, photos[], interests[]
- visibility (public / matches_only / hidden)
- verified_badge (true after admin ID approval)

### Match
- user_a_id, user_b_id, status (pending/active/blocked)
- matched_at, initiated_by

### Message
- sender_id, recipient_id, thread_id, body
- moderation_status (pending/approved/flagged/blocked)
- sent_at, is_read, is_deleted

### Report
- reporter_id, reported_user_id, reason, description
- status (open/reviewed/resolved), admin_notes, action_taken

### Application (for male applicants)
- applicant_name, email, phone, reason, references
- status (pending/approved/denied), reviewed_by, reviewed_at

---

## Safety Architecture

### Layer 1 — Verification Gate
No one accesses the platform without:
1. Email confirmation
2. SMS OTP (phone)
3. Photo ID upload + selfie (admin-reviewed)
4. Admin approval

### Layer 2 — Message Moderation
Every message passes through a moderation pipeline before delivery:
1. Keyword filter (harassment, threats, explicit content)
2. Sentiment analysis flag
3. If flagged → held for admin review, sender notified generically
4. If approved → delivered normally

### Layer 3 — Trust Scoring
- New accounts: 5 messages/day limit, no photo sharing for 7 days
- Trust score increases with: positive time on platform, no flags, verified ID
- Trust score decreases with: reports received, flagged messages
- Accounts below threshold: auto-restricted pending admin review

### Layer 4 — Reporting & Response
- Report button on every profile, every message
- 3 reports from different users → auto-suspend + admin queue
- Admin reviews within 24 hours
- Outcome: warning / temporary ban / permanent ban
- Banned users blocklisted by phone hash + email hash

### Layer 5 — Privacy Controls
- Location: city-level only, never exact coordinates
- Online status: hidden by default, user controls visibility
- Read receipts: off by default
- Profile visibility: user controls who can see them
- Full data deletion within 30 days of account removal

---

## Pages to Build

| Page | Role | Purpose |
|------|------|---------|
| Landing / Login | All | Signup, login, application form for men |
| Onboarding | Member | ID upload, profile setup, safety tour |
| Discover | Member | Browse verified profiles, send interest |
| Matches | Member | Active matches, message threads |
| Messages | Member | Safe threaded messaging |
| Profile | Member | Edit profile, privacy settings |
| Report Center | Member | File and track reports |
| Admin Dashboard | Admin | Moderation queue, applications, bans |
| Application Form | Applicant | Men apply to join |

---

## Tech Stack
- Frontend: React + Tailwind (Base44)
- Backend: Base44 entities + backend functions
- i18n: 50 languages (same system as HealthBridge)
- Hosting: Base44 PWA
- iOS: Capacitor (future)

---

## What This App Does NOT Do
- No microphone access or audio monitoring
- No location tracking beyond city level
- No data sold to third parties
- No shadow profiles or hidden data collection
