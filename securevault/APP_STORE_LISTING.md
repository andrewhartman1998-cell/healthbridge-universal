# SecureMail — App Store Submission Package

## App Information
- **App Name:** SecureMail — Encrypted File Exchange
- **Bundle ID:** com.securemail.app
- **Version:** 1.0.0
- **Build:** 1
- **Category:** Business
- **Secondary Category:** Productivity
- **Age Rating:** 4+
- **Price:** Free

## Short Description (30 chars)
Zero-Knowledge Encrypted Mail

## Full Description
SecureMail is the world's first truly zero-knowledge encrypted email replacement — built for bookkeepers, accountants, lawyers, and anyone who sends sensitive documents.

**Why SecureMail beats email:**
Standard email (Gmail, Outlook, Yahoo) stores your attachments on servers that can be read, subpoenaed, hacked, or sold. SecureMail encrypts everything inside your device before it ever leaves. The server sees only unreadable ciphertext — we literally cannot read your files even if we wanted to.

**What makes it different:**
🔐 AES-256-GCM military-grade encryption — the same standard used by governments
🔗 HKDF key separation — each file uses an isolated cryptographic key
✅ SHA-256 file integrity — every file verified bit-for-bit on receipt
🔏 Signed headers — detects if anyone tampers with your mail settings
📬 Multi-recipient — send to multiple people, each with their own passphrase
🔥 Burn on open — mail self-destructs after first view
⏳ Auto-expiry — set files to vanish after 24 hours, 7 days, or 30 days
📁 Unlimited file sizes — send GB-scale files with chunked streaming encryption
🆓 Completely free — no subscription, no account, no limits

**Perfect for:**
• Bookkeepers sending tax returns and financial statements
• Lawyers exchanging contracts and NDA documents
• Accountants sharing payroll and audit files
• Medical practices sending patient records
• Anyone who needs to stop paying for "secure" file sharing services

**Built on open web standards:**
Web Crypto API · IndexedDB · AES-256-GCM · PBKDF2 · HKDF — all browser-native, zero proprietary dependencies.

## Keywords
encrypted email, secure file sharing, bookkeeping, AES encryption, zero knowledge, private messaging, tax documents, financial security, lawyer documents, hipaa

## Support URL
https://andrewhartman1998-cell.github.io/healthbridge-universal/securevault/

## Marketing URL
https://andrewhartman1998-cell.github.io/healthbridge-universal/securevault/

## Privacy Policy URL
https://andrewhartman1998-cell.github.io/healthbridge-universal/securevault/

## App Review Notes
This app uses the Web Crypto API (AES-256-GCM) for client-side encryption only.
No server communication occurs during encryption or decryption.
All data is stored locally in IndexedDB on the user's device.
The app requires no account, login, or personal information.
Test passphrase for review: TestSecureMail2026

## Required GitHub Secrets (already configured)
- CERTIFICATE_BASE64
- CERTIFICATE_PASSWORD
- KEYCHAIN_PASSWORD
- PROVISIONING_PROFILE_BASE64
- APPLE_TEAM_ID
- APPLE_ID
- APP_SPECIFIC_PASSWORD
