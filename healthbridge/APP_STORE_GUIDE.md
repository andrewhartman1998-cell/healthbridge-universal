# HealthBridge Universal — App Store Publishing Guide

## Overview
HealthBridge is a React PWA wrapped with Capacitor to create a native iOS app.

---

## Prerequisites
- Mac with Xcode 15+ installed
- Apple Developer Account ($99/year at developer.apple.com)
- Node.js 18+
- iOS device or simulator for testing

---

## Step 1: Set Up Your Environment

```bash
# Install dependencies
npm install

# Install Capacitor CLI globally
npm install -g @capacitor/cli
```

---

## Step 2: Build the Web App

```bash
npm run build
```
This creates the `dist/` folder with your compiled app.

---

## Step 3: Add iOS Platform

```bash
npx cap add ios
npx cap sync ios
```

---

## Step 4: Generate App Icons

You need icons in all required sizes. Use a tool like:
- https://appicon.co (recommended — free)
- https://makeappicon.com

Upload a 1024x1024 PNG of the HealthBridge logo. Download the iOS set and place them in:
`ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Required sizes: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024 px

---

## Step 5: Generate Splash Screens

Use Capacitor's splash screen generator or Appicon.co.
Place splash images in: `ios/App/App/Assets.xcassets/Splash.imageset/`

---

## Step 6: Configure the iOS Project in Xcode

```bash
npx cap open ios
```

In Xcode:
1. Select the `App` target
2. **General tab:**
   - Display Name: `HealthBridge Universal`
   - Bundle Identifier: `com.healthbridge.universal`
   - Version: `1.0.0`
   - Build: `1`
   - Deployment Target: iOS 15.0+
3. **Signing & Capabilities tab:**
   - Team: Select your Apple Developer team
   - Enable Push Notifications capability
   - Enable Background Modes → Remote notifications
4. **Info tab:**
   - Add `NSHealthUpdateUsageDescription` and `NSHealthShareUsageDescription` if using HealthKit
   - Add Privacy descriptions for camera, microphone if needed

---

## Step 7: Configure Push Notifications (APNs)

1. Go to developer.apple.com → Certificates, Identifiers & Profiles
2. Create an App ID for `com.healthbridge.universal`
3. Enable Push Notifications capability
4. Create an APNs authentication key (.p8 file)
5. Add the key to your notification service (if using Firebase, add to FCM)

In your `capacitor.config.json`, push notifications are already configured.

---

## Step 8: Test on Device / Simulator

In Xcode:
1. Select target (your device or iPhone simulator)
2. Press ▶️ Run

Check:
- Login screen renders correctly
- Role-based routing works (patient/doctor/admin)
- Notifications appear
- Safe area insets are correct on iPhone with notch/Dynamic Island

---

## Step 9: Archive & Upload to App Store Connect

1. In Xcode → Product → Archive
2. In the Organizer window → Distribute App → App Store Connect
3. Follow the upload wizard

---

## Step 10: App Store Connect Setup

1. Go to appstoreconnect.apple.com
2. Create a new App
3. Fill in:
   - **Name:** HealthBridge Universal
   - **Bundle ID:** com.healthbridge.universal
   - **SKU:** healthbridge-universal-001
   - **Category:** Medical (Primary) / Health & Fitness (Secondary)
4. Upload screenshots (required sizes: 6.7", 6.5", 5.5", 12.9" iPad)
5. Write App Description (highlight HIPAA compliance, role-based access)
6. Set Age Rating: 17+ (Medical)
7. Submit for Review

---

## App Store Description (Draft)

**HealthBridge Universal**
*Connecting communities to care.*

HealthBridge Universal is a comprehensive healthcare management platform designed to serve patients, doctors, and administrators in one secure, elegant interface.

**For Patients:**
• View upcoming and past appointments
• Access your complete medical records
• Receive real-time health notifications
• Track allergies, conditions, and insurance

**For Doctors:**
• Manage your daily and upcoming schedule
• View full patient histories and add clinical notes
• Send notifications to patients directly
• Access records instantly

**For Administrators:**
• Manage all patients and staff
• Schedule and track appointments
• Oversee the entire care operation

**Privacy & Security:**
HealthBridge Universal is built with security at its core. All data is encrypted and access is strictly role-based. Designed for underserved communities and healthcare organizations.

---

## Health App Privacy Compliance

For medical apps, Apple requires:
1. A privacy policy URL (host at your domain)
2. HIPAA compliance statement
3. Data handling disclosures in App Privacy section
4. No collection of health data without explicit user consent

---

## Updating the App

When you make changes:
```bash
npm run build
npx cap sync ios
# Open Xcode, increment build number, Archive again
```

---

## Troubleshooting

**White screen on launch:** Check that `webDir` in capacitor.config.json points to `dist`
**API not working:** Make sure your Base44 API URL is accessible over HTTPS
**Push notifications not working:** Verify APNs keys are correctly configured
**Safe area issues:** Ensure `viewport-fit=cover` is set in index.html (already done)
