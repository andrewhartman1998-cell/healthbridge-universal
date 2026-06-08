import React, { useState, useEffect } from "react";
import { Patient, Appointment, MedicalRecord, Notification, User } from "@/api/entities";

export default function PatientPortal() {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser.linked_patient_id) {
        const [patientData, appts, recs, notifs] = await Promise.all([
          Patient.get(currentUser.linked_patient_id),
          Appointment.filter({ patient_id: currentUser.linked_patient_id }),
          MedicalRecord.filter({ patient_id: currentUser.linked_patient_id }),
          Notification.filter({ user_id: currentUser.id }),
        ]);
        setPatient(patientData);
        setAppointments(appts.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setRecords(recs.sort((a, b) => new Date(b.record_date) - new Date(a.record_date)));
        setNotifications(notifs.filter(n => n.status === "Unread"));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const markNotificationRead = async (id) => {
    await Notification.update(id, { status: "Read" });
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const upcomingAppointments = appointments.filter(a =>
    new Date(a.date) >= new Date() && a.status !== "Cancelled"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500">Loading your health portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900">HealthBridge</span>
          </div>
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notifications.length}</span>
              </div>
            )}
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
              {user?.full_name?.charAt(0) || "P"}
            </div>
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-1">
            {["dashboard", "appointments", "records", "notifications"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {tab === "notifications" && notifications.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{notifications.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold">Welcome back, {patient?.full_name || user?.full_name || "Patient"}</h2>
              <p className="opacity-80 text-sm mt-1">Here's your health overview</p>
              {patient && (
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">Blood: {patient.blood_type || "N/A"}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Insurance: {patient.insurance_provider || "N/A"}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Upcoming Appts", value: upcomingAppointments.length, color: "blue", icon: "📅" },
                { label: "Medical Records", value: records.length, color: "green", icon: "📋" },
                { label: "Notifications", value: notifications.length, color: "orange", icon: "🔔" },
                { label: "Care Status", value: patient?.status || "Active", color: "teal", icon: "✅" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 3).map(appt => (
                    <div key={appt.id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                        {new Date(appt.date).getDate()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{appt.type}</p>
                        <p className="text-xs text-gray-500">Dr. {appt.doctor} · {appt.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        appt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                        appt.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{appt.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions & Allergies */}
            {patient && (patient.chronic_conditions || patient.allergies) && (
              <div className="grid md:grid-cols-2 gap-4">
                {patient.chronic_conditions && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">Chronic Conditions</h3>
                    <p className="text-sm text-gray-600">{patient.chronic_conditions}</p>
                  </div>
                )}
                {patient.allergies && (
                  <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
                    <h3 className="font-semibold text-red-700 mb-3">⚠️ Allergies</h3>
                    <p className="text-sm text-red-600">{patient.allergies}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">📅</div>
                <p className="text-gray-500">No appointments yet</p>
              </div>
            ) : (
              appointments.map(appt => (
                <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appt.type}</h3>
                      <p className="text-sm text-gray-500 mt-1">Dr. {appt.doctor}</p>
                      <p className="text-sm text-gray-500">{new Date(appt.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {appt.time}</p>
                      {appt.notes && <p className="text-sm text-gray-600 mt-2 italic">"{appt.notes}"</p>}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      appt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      appt.status === "Cancelled" ? "bg-red-100 text-red-700" :
                      appt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{appt.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === "records" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Medical Records</h2>
            {records.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-gray-500">No medical records on file</p>
              </div>
            ) : (
              records.map(rec => (
                <div key={rec.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          rec.type === "Lab Result" ? "bg-purple-100 text-purple-700" :
                          rec.type === "Prescription" ? "bg-blue-100 text-blue-700" :
                          rec.type === "Imaging" ? "bg-orange-100 text-orange-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>{rec.type}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Dr. {rec.doctor} · {new Date(rec.record_date).toLocaleDateString()}</p>
                      {rec.description && <p className="text-sm text-gray-600 mt-2">{rec.description}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            {notifications.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">🔔</div>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="bg-white rounded-xl shadow-sm border border-blue-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`inline-block text-xs px-2 py-0.5 rounded-full mb-2 font-medium ${
                        notif.type === "Urgent" ? "bg-red-100 text-red-700" :
                        notif.type === "Appointment Reminder" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{notif.type}</div>
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    </div>
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                    >
                      Mark read
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
