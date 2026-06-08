# GitHub Actions iOS Build — Setup Guide
## How to build & submit HealthBridge without a Mac

This workflow runs on GitHub's cloud Mac machines automatically.
Once set up, pushing to `main` triggers a full build and uploads to App Store Connect.

---

## Prerequisites

1. **Apple Developer Account** — $99/yr at developer.apple.com
2. **GitHub account** with the HealthBridge repo pushed to it
3. **App Store Connect app listing created** (bundle ID: com.healthbridge.universal)

---

## Step 1 — Push the project to GitHub

```bash
# From the healthbridge/ folder on any computer (even Windows/Linux):
git init
git add .
git commit -m "Initial commit — HealthBridge Universal v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/healthbridge-universal.git
git push -u origin main
```

---

## Step 2 — Create a Distribution Certificate

1. Go to **developer.apple.com → Certificates, IDs & Profiles → Certificates**
2. Click **+** → choose **Apple Distribution**
3. Follow the CSR instructions and download the `.cer` file
4. Double-click to install it in Keychain Access on any Mac (or use a friend's Mac just for this step)
5. In Keychain Access → right-click the certificate → **Export** → save as `.p12`
6. Convert to base64:
   ```bash
   base64 -i certificate.p12 | pbcopy   # copies to clipboard
   ```
7. Save this base64 string — you'll need it for GitHub Secrets

---

## Step 3 — Create a Provisioning Profile

1. Go to **developer.apple.com → Profiles → +**
2. Choose **App Store Distribution**
3. Select App ID: `com.healthbridge.universal`
4. Select your Distribution Certificate
5. Download the `.mobileprovision` file
6. Convert to base64:
   ```bash
   base64 -i healthbridge.mobileprovision | pbcopy
   ```

---

## Step 4 — Get an App-Specific Password

1. Go to **appleid.apple.com → Sign-In and Security → App-Specific Passwords**
2. Generate a new password for "HealthBridge GitHub Actions"
3. Save it securely

---

## Step 5 — Add GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add ALL of these:

| Secret Name | Value |
|---|---|
| `CERTIFICATE_BASE64` | Base64 string of your .p12 certificate |
| `CERTIFICATE_PASSWORD` | Password you set when exporting the .p12 |
| `KEYCHAIN_PASSWORD` | Any strong password (used only during build) |
| `PROVISIONING_PROFILE_BASE64` | Base64 string of your .mobileprovision |
| `APPLE_TEAM_ID` | Your 10-character team ID from developer.apple.com |
| `APPLE_ID` | Your Apple ID email address |
| `APP_SPECIFIC_PASSWORD` | The app-specific password from Step 4 |

---

## Step 6 — Trigger the Build

**Option A — Automatic:** Push any change to `main` branch
**Option B — Manual:** GitHub repo → **Actions tab → iOS Build workflow → Run workflow**

The workflow will:
1. Install dependencies
2. Build the React/Vite web app
3. Run `npx cap sync ios`
4. Install CocoaPods
5. Sign the app with your certificate
6. Archive and export an IPA
7. Upload directly to App Store Connect

Total build time: ~15–25 minutes

---

## Monitoring the Build

- Go to your GitHub repo → **Actions** tab
- Click the running workflow to see live logs
- If it fails, the error message will tell you exactly what went wrong
- The IPA is also saved as a build artifact for 30 days (downloadable from Actions)

---

## After Upload

Once the IPA uploads successfully:
1. Go to **App Store Connect → TestFlight** — the build will appear within 15–30 minutes
2. Add it to a TestFlight group for internal testing
3. Once satisfied, go to **App Store Connect → App Store → + Version** and submit for review

---

## Troubleshooting

**"No signing certificate found"**
→ Check that CERTIFICATE_BASE64 and CERTIFICATE_PASSWORD secrets are set correctly

**"No profiles for bundle ID"**
→ Verify the provisioning profile is for `com.healthbridge.universal`

**"Invalid credentials"**
→ Regenerate your app-specific password and update the secret

**Build succeeds but nothing appears in App Store Connect**
→ Wait 30 minutes — processing can be slow. Check your Apple ID email for any notices.
