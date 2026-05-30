# HealthBridge Universal — Demo Accounts Setup Guide
## For Apple App Review Submission

This guide explains how to create the three demo accounts Apple reviewers will use
to test all three user roles in HealthBridge Universal.

---

## Overview

HealthBridge uses role-based access. Apple requires working demo credentials for every
distinct user experience. You need three accounts:

| Role | Email | Password | What Reviewer Sees |
|------|-------|----------|--------------------|
| Patient | testpatient@healthbridge.app | TestPatient123! | Portal, appointments, records, notifications |
| Doctor | testdoctor@healthbridge.app | TestDoctor123! | Schedule, patient list, clinical notes |
| Admin | testadmin@healthbridge.app | TestAdmin123! | Full dashboard, patient mgmt, staff directory |

---

## Step 1 — Create the User Accounts in Base44

Log into your Base44 app and create three User records manually via the Admin panel
or using the entity CRUD tools. Set the following fields:

### Patient Account
```json
{
  "email": "testpatient@healthbridge.app",
  "full_name": "Alex Johnson",
  "role": "patient",
  "phone": "555-0101",
  "date_of_birth": "1990-04-15",
  "gender": "Female",
  "onboarded": true
}
```

### Doctor Account
```json
{
  "email": "testdoctor@healthbridge.app",
  "full_name": "Dr. Sarah Patel",
  "role": "doctor",
  "phone": "555-0202",
  "onboarded": true
}
```

### Admin Account
```json
{
  "email": "testadmin@healthbridge.app",
  "full_name": "Admin User",
  "role": "admin",
  "phone": "555-0303",
  "onboarded": true
}
```

---

## Step 2 — Create a Demo Patient Record

Create a Patient entity record linked to the patient user so the portal has real data to show:

```json
{
  "full_name": "Alex Johnson",
  "date_of_birth": "1990-04-15",
  "gender": "Female",
  "phone": "555-0101",
  "email": "testpatient@healthbridge.app",
  "blood_type": "O+",
  "allergies": "Penicillin, Sulfa drugs",
  "chronic_conditions": "Type 2 Diabetes (well-controlled), Mild Hypertension",
  "insurance_provider": "Blue Cross Blue Shield",
  "insurance_id": "BCBS-7729301",
  "address": "123 Maple Street, Springfield, IL 62701",
  "status": "Active"
}
```

---

## Step 3 — Create Demo Appointments

Create 3–4 Appointment records for the demo patient so the reviewer sees a populated portal:

```json
[
  {
    "patient_name": "Alex Johnson",
    "patient_email": "testpatient@healthbridge.app",
    "date": "2026-06-05",
    "time": "10:00 AM",
    "type": "General Checkup",
    "doctor": "Sarah Patel",
    "status": "Confirmed",
    "notes": "Annual wellness visit"
  },
  {
    "patient_name": "Alex Johnson",
    "patient_email": "testpatient@healthbridge.app",
    "date": "2026-06-12",
    "time": "2:30 PM",
    "type": "Lab Work",
    "doctor": "Sarah Patel",
    "status": "Pending",
    "notes": "HbA1c and lipid panel"
  },
  {
    "patient_name": "Alex Johnson",
    "patient_email": "testpatient@healthbridge.app",
    "date": "2026-05-10",
    "time": "9:00 AM",
    "type": "Follow-up",
    "doctor": "Sarah Patel",
    "status": "Completed",
    "notes": "Reviewed blood pressure medication dosage"
  }
]
```

---

## Step 4 — Create Demo Medical Records

```json
[
  {
    "patient_name": "Alex Johnson",
    "record_date": "2026-05-10",
    "type": "Visit Summary",
    "title": "Follow-up Visit — Hypertension Review",
    "description": "Patient BP reading 128/82. Medication dosage maintained. Advised reduced sodium intake and daily 30-min walks. Follow-up in 4 weeks.",
    "doctor": "Sarah Patel"
  },
  {
    "patient_name": "Alex Johnson",
    "record_date": "2026-04-22",
    "type": "Lab Result",
    "title": "HbA1c Blood Panel — April 2026",
    "description": "HbA1c: 6.8% (target <7%). Fasting glucose: 112 mg/dL. Cholesterol: 188 mg/dL. Results within acceptable range. Continue current management plan.",
    "doctor": "Sarah Patel"
  },
  {
    "patient_name": "Alex Johnson",
    "record_date": "2026-03-15",
    "type": "Prescription",
    "title": "Metformin 500mg Renewal",
    "description": "Renewed prescription for Metformin 500mg twice daily with meals. 90-day supply, 2 refills. Patient counseled on side effects.",
    "doctor": "Sarah Patel"
  }
]
```

---

## Step 5 — Create Demo Doctor Record

Link to the doctor user account:

```json
{
  "full_name": "Sarah Patel",
  "specialty": "Internal Medicine",
  "phone": "555-0202",
  "email": "testdoctor@healthbridge.app",
  "license_number": "IL-MED-004821",
  "department": "Primary Care",
  "status": "Active",
  "bio": "Dr. Patel is a board-certified internist with 12 years of experience in primary care and chronic disease management."
}
```

---

## Step 6 — Create Demo Notifications

Add 2 unread notifications for the patient so the notification badge shows up:

```json
[
  {
    "title": "Appointment Reminder",
    "message": "Reminder: Your General Checkup with Dr. Sarah Patel is on June 5 at 10:00 AM.",
    "type": "Appointment Reminder",
    "status": "Unread"
  },
  {
    "title": "New Lab Results Available",
    "message": "Dr. Patel has added your April blood panel results to your medical record.",
    "type": "Lab Result",
    "status": "Unread"
  }
]
```

---

## Step 7 — App Review Notes (paste into App Store Connect)

Copy this text into the "Notes" field in the App Review Information section:

```
HealthBridge Universal uses role-based access control. Three user roles are available,
each with a distinct interface. Please use the following demo credentials to review all experiences:

PATIENT VIEW
Email: testpatient@healthbridge.app
Password: TestPatient123!
Shows: Health dashboard with upcoming appointments, medical records history,
allergy/condition overview, and real-time notifications.

DOCTOR VIEW
Email: testdoctor@healthbridge.app
Password: TestDoctor123!
Shows: Daily appointment schedule, upcoming appointments, patient list with
full health profiles, and clinical note creation.

ADMIN VIEW
Email: testadmin@healthbridge.app
Password: TestAdmin123!
Shows: Operations dashboard, full patient roster with search, appointment
scheduler across the organization, and medical staff directory.

All demo data is synthetic. No real patient information is present in the review environment.
The app requires an internet connection to function. Please ensure the test device has
Wi-Fi or cellular access during review.
```

---

## Important Notes

- Use a **separate build/environment** for App Review if possible, so demo data stays clean
- Make sure all three email addresses can actually log in via your auth provider
- Test each login yourself before submitting to confirm the experience is smooth
- Apple reviewers may test on older devices — verify on iPhone SE (small screen) too
