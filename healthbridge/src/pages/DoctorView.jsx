import React, { useState, useEffect } from "react";
import { Patient, Appointment, MedicalRecord, Doctor, Notification, User } from "@/api/entities";

export default function DoctorView() {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState("schedule");
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    patient_id: "", patient_name: "", record_date: new Date().toISOString().split("T")[0],
    type: "Visit Summary", title: "", description: "", doctor: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser.linked_doctor_id) {
        const doctorData = await Doctor.get(currentUser.linked_doctor_id);
        setDoctor(doctorData);
        const appts = await Appointment.filter({ doctor: doctorData.full_name });
        setAppointments(appts.sort((a, b) => new Date(a.date) - new Date(b.date)));
      }
      const allPatients = await Patient.list();
      setPatients(allPatients);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadPatientRecords = async (patientId) => {
    const recs = await MedicalRecord.filter({ patient_id: patientId });
    setPatientRecords(recs.sort((a, b) => new Date(b.record_date) - new Date(a.record_date)));
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    await MedicalRecord.create({
      ...newRecord,
      doctor: doctor?.full_name || user?.full_name || "Doctor",
      patient_id: selectedPatient?.id || newRecord.patient_id,
      patient_name: selectedPatient?.full_name || newRecord.patient_name,
    });
    // Notify patient
    if (selectedPatient) {
      await Notification.create({
        patient_id: selectedPatient.id,
        title: "New Medical Record Added",
        message: `Dr. ${doctor?.full_name || user?.full_name} added a new ${newRecord.type}: ${newRecord.title}`,
        type: "Lab Result",
        status: "Unread",
        sent_at: new Date().toISOString(),
      });
    }
    setShowAddRecord(false);
    setNewRecord({ patient_id: "", patient_name: "", record_date: new Date().toISOString().split("T")[0], type: "Visit Summary", title: "", description: "", doctor: "" });
    if (selectedPatient) loadPatientRecords(selectedPatient.id);
  };

  const updateAppointmentStatus = async (id, status) => {
    await Appointment.update(id, { status });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.date === today);
  const upcomingAppts = appointments.filter(a => a.date > today && a.status !== "Cancelled");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900">{doctor ? `Dr. ${doctor.full_name}` : user?.full_name}</span>
              <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">{doctor?.specialty || "Doctor"}</span>
            </div>
          </div>
          <button onClick={() => setShowAddRecord(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-1">
            + Add Record
          </button>
        </div>
      </header>

      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1">
            {["schedule", "patients", "records"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* SCHEDULE */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Today", value: todayAppts.length, icon: "📅", sub: "appointments" },
                { label: "Upcoming", value: upcomingAppts.length, icon: "🗓️", sub: "scheduled" },
                { label: "My Patients", value: patients.length, icon: "👥", sub: "total" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label} {s.sub}</div>
                </div>
              ))}
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
              {todayAppts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">☀️</div>
                  <p className="text-sm">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppts.map(a => (
                    <div key={a.id} className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                      <div className="text-center min-w-[3rem]">
                        <span className="text-sm font-bold text-teal-700">{a.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{a.patient_name}</p>
                        <p className="text-sm text-gray-500">{a.type}</p>
                        {a.notes && <p className="text-xs text-gray-400 italic mt-1">Note: {a.notes}</p>}
                      </div>
                      <div className="flex gap-2">
                        {a.status === "Pending" || a.status === "Confirmed" ? (
                          <>
                            <button onClick={() => updateAppointmentStatus(a.id, "Completed")}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200">
                              Complete
                            </button>
                            <button onClick={() => {
                              const p = patients.find(pt => pt.id === a.patient_id);
                              setSelectedPatient(p);
                              setNewRecord(r => ({ ...r, patient_id: a.patient_id, patient_name: a.patient_name }));
                              setShowAddRecord(true);
                            }} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200">
                              Add Note
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs px-3 py-1 rounded-lg font-medium ${
                            a.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                          }`}>{a.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            {upcomingAppts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                <div className="space-y-2">
                  {upcomingAppts.slice(0, 10).map(a => (
                    <div key={a.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-12 text-center">
                        <div className="text-xs font-bold text-gray-500">{new Date(a.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</div>
                        <div className="text-lg font-bold text-gray-900">{new Date(a.date).getDate()}</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{a.patient_name}</p>
                        <p className="text-xs text-gray-500">{a.type} at {a.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        a.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PATIENTS */}
        {activeTab === "patients" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Patient List</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {patients.map(p => (
                <div key={p.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition-all ${
                    selectedPatient?.id === p.id ? "border-teal-400 ring-2 ring-teal-100" : "border-gray-100 hover:border-teal-200"
                  }`}
                  onClick={() => { setSelectedPatient(p); loadPatientRecords(p.id); setActiveTab("patientDetail"); }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                      {p.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{p.full_name}</p>
                      <p className="text-xs text-gray-500">{p.gender} · {p.date_of_birth}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {p.blood_type && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🩸 {p.blood_type}</span>}
                    {p.allergies && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⚠️ Allergies</span>}
                    {p.chronic_conditions && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">💊 Chronic</span>}
                  </div>
                </div>
              ))}
              {patients.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-400">No patients found</div>
              )}
            </div>
          </div>
        )}

        {/* PATIENT DETAIL */}
        {activeTab === "patientDetail" && selectedPatient && (
          <div className="space-y-4">
            <button onClick={() => setActiveTab("patients")} className="text-sm text-teal-600 flex items-center gap-1">← Back to Patients</button>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 text-xl font-bold">
                    {selectedPatient.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPatient.full_name}</h2>
                    <p className="text-gray-500 text-sm">{selectedPatient.email} · {selectedPatient.phone}</p>
                  </div>
                </div>
                <button onClick={() => {
                  setNewRecord(r => ({ ...r, patient_id: selectedPatient.id, patient_name: selectedPatient.full_name }));
                  setShowAddRecord(true);
                }} className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700">
                  + Add Record
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm mb-5">
                {[
                  { label: "DOB", value: selectedPatient.date_of_birth },
                  { label: "Blood Type", value: selectedPatient.blood_type },
                  { label: "Insurance", value: selectedPatient.insurance_provider },
                ].map((f, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">{f.label}</p>
                    <p className="font-semibold text-gray-900">{f.value || "—"}</p>
                  </div>
                ))}
              </div>
              {selectedPatient.allergies && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-3">
                  <p className="text-xs font-semibold text-red-600 mb-1">⚠️ ALLERGIES</p>
                  <p className="text-sm text-red-700">{selectedPatient.allergies}</p>
                </div>
              )}
              {selectedPatient.chronic_conditions && (
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-xs font-semibold text-orange-600 mb-1">Chronic Conditions</p>
                  <p className="text-sm text-orange-700">{selectedPatient.chronic_conditions}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Medical Records</h3>
              {patientRecords.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No records yet — add the first one</p>
              ) : (
                <div className="space-y-3">
                  {patientRecords.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{r.title}</h4>
                        <span className="text-xs text-gray-400">{r.record_date}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.type === "Lab Result" ? "bg-purple-100 text-purple-700" :
                        r.type === "Prescription" ? "bg-blue-100 text-blue-700" :
                        r.type === "Imaging" ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{r.type}</span>
                      {r.description && <p className="text-sm text-gray-600 mt-2">{r.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECORDS TAB */}
        {activeTab === "records" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Medical Records — All Patients</h2>
              <button onClick={() => setShowAddRecord(true)} className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700">
                + Add Record
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {patients.flatMap(p => patientRecords.filter(r => r.patient_id === p.id)).length === 0 && (
                  <div className="text-center py-12 text-gray-400">No records yet — click a patient to view their records</div>
                )}
              </div>
              <div className="p-4 text-center text-sm text-gray-500">
                Click a patient from the <span className="text-teal-600 cursor-pointer" onClick={() => setActiveTab("patients")}>Patients tab</span> to view and add their records.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD MEDICAL RECORD MODAL */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add Medical Record</h2>
              <button onClick={() => setShowAddRecord(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Patient *</label>
                <select required value={newRecord.patient_id}
                  onChange={e => {
                    const p = patients.find(pt => pt.id === e.target.value);
                    setSelectedPatient(p);
                    setNewRecord(r => ({ ...r, patient_id: e.target.value, patient_name: p?.full_name || "" }));
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Record Type</label>
                  <select value={newRecord.type} onChange={e => setNewRecord(r => ({ ...r, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {["Visit Summary", "Lab Result", "Prescription", "Imaging", "Referral", "Procedure Note", "Other"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={newRecord.record_date} onChange={e => setNewRecord(r => ({ ...r, record_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={newRecord.title} onChange={e => setNewRecord(r => ({ ...r, title: e.target.value }))}
                  placeholder="e.g. Annual Blood Panel, Chest X-Ray Results..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Clinical Notes</label>
                <textarea value={newRecord.description} onChange={e => setNewRecord(r => ({ ...r, description: e.target.value }))} rows={4}
                  placeholder="Add findings, prescriptions, follow-up instructions..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddRecord(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-teal-700">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
