# Bridge to Stability — App Store Submission Guide
### June 1, 2026

---

## CURRENT STATUS

✅ App built and live on web (GitHub Pages)
✅ Capacitor configured (com.bridgetostability.app)
✅ GitHub Actions iOS pipeline ready (bridge/.github/workflows/ios-build.yml)
✅ App Store listing copy ready (APP_STORE_LISTING.md)
✅ LinkedIn launch announcement published

⏳ PENDING: Apple Developer enrollment ($99/yr)
⏳ PENDING: 7 GitHub Secrets configured
⏳ PENDING: App Store Connect app record created

---

## STEP 1 — Enroll in Apple Developer Program

🔗 https://developer.apple.com/programs/enroll/

- Cost: $99/year
- Use your personal Apple ID
- Individual enrollment (not organization)
- Takes 24–48 hours to approve
- You will receive: a Team ID (10-character code like AB12CD34EF)

---

## STEP 2 — Create the App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Bridge to Stability
   - Primary Language: English (U.S.)
   - Bundle ID: com.bridgetostability.app
   - SKU: bridge-to-stability-001
4. Save — you now have an App Store record

---

## STEP 3 — Create Distribution Certificate & Provisioning Profile

In your Apple Developer account:

**Certificate:**
1. Certificates, Identifiers & Profiles → Certificates → "+"
2. Choose "Apple Distribution"
3. Follow prompts to generate via Keychain Access on your Mac
4. Download → double-click to install in Keychain
5. Export as .p12 file with a password → base64 encode it:
   `base64 -i certificate.p12 | pbcopy`

**Provisioning Profile:**
1. Profiles → "+" → "App Store" distribution
2. Select: com.bridgetostability.app
3. Select your Distribution Certificate
4. Download → base64 encode:
   `base64 -i profile.mobileprovision | pbcopy`

---

## STEP 4 — Get App-Specific Password

1. Go to https://appleid.apple.com
2. Sign In → Security → App-Specific Passwords → Generate
3. Label: "GitHub Actions — Bridge"
4. Save the generated password (format: xxxx-xxxx-xxxx-xxxx)

---

## STEP 5 — Add 7 GitHub Secrets

Go to: https://github.com/andrewhartman1998-cell/healthbridge-universal/settings/secrets/actions

Add these secrets:

| Secret Name | Value |
|---|---|
| BRIDGE_CERTIFICATE_BASE64 | Base64-encoded .p12 file content |
| BRIDGE_CERTIFICATE_PASSWORD | Password you set when exporting .p12 |
| BRIDGE_KEYCHAIN_PASSWORD | Any strong password (e.g. Bridge2026!Key) |
| BRIDGE_PROVISIONING_PROFILE_BASE64 | Base64-encoded .mobileprovision file |
| BRIDGE_APPLE_TEAM_ID | Your 10-char Team ID from developer.apple.com |
| BRIDGE_APPLE_ID | Your Apple ID email address |
| BRIDGE_APP_SPECIFIC_PASSWORD | The app-specific password from Step 4 |

---

## STEP 6 — Trigger the Build

Once all 7 secrets are set:
1. Push any small change to the `bridge/` folder
2. OR go to: GitHub → Actions → "Bridge to Stability — iOS Build & Submit" → Run workflow
3. The pipeline will build, archive, and submit automatically

---

## STEP 7 — Complete App Store Connect Listing

After the IPA is submitted, go to App Store Connect and fill in:
- Description (copy from APP_STORE_LISTING.md)
- Keywords, subtitle, support URL
- Screenshots (5 required — see guide in APP_STORE_LISTING.md)
- Age rating questionnaire (answer: No to all → 4+)
- Pricing: Free

Then click "Submit for Review" — Apple reviews in 24–72 hours.

---

## BUNDLE ID
com.bridgetostability.app

## LIVE WEB VERSION (available now, no App Store needed)
https://andrewhartman1998-cell.github.io/healthbridge-universal/bridge/
