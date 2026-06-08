import React, { useState, useEffect } from "react";
import { Patient, Appointment, MedicalRecord, Doctor, Notification, User } from "@/api/entities";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);

  const [newPatient, setNewPatient] = useState({
    full_name: "", date_of_birth: "", gender: "", phone: "", email: "",
    address: "", blood_type: "", allergies: "", chronic_conditions: "",
    insurance_provider: "", insurance_id: "", status: "Active", notes: ""
  });

  const [newAppointment, setNewAppointment] = useState({
    patient_id: "", patient_name: "", patient_email: "", date: "", time: "",
    type: "General Checkup", doctor: "", status: "Pending", notes: ""
  });

  const [newDoctor, setNewDoctor] = useState({
    full_name: "", specialty: "", phone: "", email: "",
    license_number: "", department: "", status: "Active", bio: ""
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, a, d] = await Promise.all([
        Patient.list(),
        Appointment.list(),
        Doctor.list(),
      ]);
      setPatients(p);
      setAppointments(a.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setDoctors(d);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadPatientRecords = async (patientId) => {
    const recs = await MedicalRecord.filter({ patient_id: patientId });
    setPatientRecords(recs);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    await Patient.create(newPatient);
    setShowAddPatient(false);
    setNewPatient({ full_name: "", date_of_birth: "", gender: "", phone: "", email: "", address: "", blood_type: "", allergies: "", chronic_conditions: "", insurance_provider: "", insurance_id: "", status: "Active", notes: "" });
    loadAll();
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const p = patients.find(pt => pt.id === newAppointment.patient_id);
    await Appointment.create({ ...newAppointment, patient_name: p?.full_name || "", patient_email: p?.email || "" });
    // Send notification to patient
    if (p) {
      await Notification.create({
        patient_id: p.id,
        title: "New Appointment Scheduled",
        message: `Your ${newAppointment.type} appointment with Dr. ${newAppointment.doctor} is scheduled for ${newAppointment.date} at ${newAppointment.time}.`,
        type: "Appointment Reminder",
        status: "Unread",
        scheduled_for: newAppointment.date,
        sent_at: new Date().toISOString(),
      });
    }
    setShowAddAppointment(false);
    setNewAppointment({ patient_id: "", patient_name: "", patient_email: "", date: "", time: "", type: "General Checkup", doctor: "", status: "Pending", notes: "" });
    loadAll();
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    await Doctor.create(newDoctor);
    setShowAddDoctor(false);
    setNewDoctor({ full_name: "", specialty: "", phone: "", email: "", license_number: "", department: "", status: "Active", bio: "" });
    loadAll();
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm("Delete this patient record?")) {
      await Patient.delete(id);
      loadAll();
    }
  };

  const filteredPatients = patients.filter(p =>
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.insurance_provider?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter(a => a.date === today);
  const pendingAppts = appointments.filter(a => a.status === "Pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900">HealthBridge</span>
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAddPatient(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <span>+</span> Add Patient
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {["overview", "patients", "appointments", "doctors"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Patients", value: patients.length, icon: "👥", color: "blue" },
                { label: "Today's Appointments", value: todayAppts.length, icon: "📅", color: "teal" },
                { label: "Pending Appointments", value: pendingAppts.length, icon: "⏳", color: "yellow" },
                { label: "Active Doctors", value: doctors.filter(d => d.status === "Active").length, icon: "🩺", color: "green" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              {todayAppts.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No appointments today</p>
              ) : (
                <div className="space-y-3">
                  {todayAppts.map(a => (
                    <div key={a.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-16 text-center">
                        <span className="text-sm font-bold text-blue-600">{a.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{a.patient_name}</p>
                        <p className="text-xs text-gray-500">{a.type} · Dr. {a.doctor}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        a.status === "Confirmed" ? "bg-green-100 text-green-700" :
                        a.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recently Added Patients</h3>
              <div className="space-y-3">
                {patients.slice(-5).reverse().map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {p.full_name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{p.full_name}</p>
                      <p className="text-xs text-gray-500">{p.insurance_provider || "No insurance on file"}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PATIENTS */}
        {activeTab === "patients" && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => setShowAddPatient(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">
                + Add Patient
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Patient", "Contact", "Insurance", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {p.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{p.full_name}</p>
                            <p className="text-xs text-gray-500">{p.date_of_birth}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600">{p.phone}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600">{p.insurance_provider || "—"}</p>
                        <p className="text-xs text-gray-400">{p.insurance_id}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          p.status === "Active" ? "bg-green-100 text-green-700" :
                          p.status === "Inactive" ? "bg-gray-100 text-gray-600" :
                          "bg-red-100 text-red-700"
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setSelectedPatient(p); loadPatientRecords(p.id); setActiveTab("patientDetail"); }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >View</button>
                          <button onClick={() => handleDeletePatient(p.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPatients.length === 0 && (
                <div className="text-center py-12 text-gray-400">No patients found</div>
              )}
            </div>
          </div>
        )}

        {/* PATIENT DETAIL */}
        {activeTab === "patientDetail" && selectedPatient && (
          <div className="space-y-4">
            <button onClick={() => setActiveTab("patients")} className="text-sm text-blue-600 flex items-center gap-1">
              ← Back to Patients
            </button>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-bold">
                  {selectedPatient.full_name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPatient.full_name}</h2>
                  <p className="text-gray-500">{selectedPatient.email} · {selectedPatient.phone}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: "Date of Birth", value: selectedPatient.date_of_birth },
                  { label: "Gender", value: selectedPatient.gender },
                  { label: "Blood Type", value: selectedPatient.blood_type },
                  { label: "Insurance", value: selectedPatient.insurance_provider },
                  { label: "Insurance ID", value: selectedPatient.insurance_id },
                  { label: "Status", value: selectedPatient.status },
                ].map((f, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">{f.label}</p>
                    <p className="font-medium text-gray-900 mt-0.5">{f.value || "—"}</p>
                  </div>
                ))}
              </div>
              {selectedPatient.allergies && (
                <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-xs font-semibold text-red-600 mb-1">⚠️ ALLERGIES</p>
                  <p className="text-sm text-red-700">{selectedPatient.allergies}</p>
                </div>
              )}
              {selectedPatient.chronic_conditions && (
                <div className="mt-4 bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-xs font-semibold text-orange-600 mb-1">Chronic Conditions</p>
                  <p className="text-sm text-orange-700">{selectedPatient.chronic_conditions}</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Medical Records</h3>
              {patientRecords.length === 0 ? (
                <p className="text-gray-400 text-sm">No records on file</p>
              ) : (
                <div className="space-y-3">
                  {patientRecords.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">{r.title}</h4>
                        <span className="text-xs text-gray-500">{r.record_date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{r.type} · Dr. {r.doctor}</p>
                      {r.description && <p className="text-sm text-gray-600 mt-2">{r.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">All Appointments</h2>
              <button onClick={() => setShowAddAppointment(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                + Schedule Appointment
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Patient", "Date & Time", "Type", "Doctor", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{a.patient_name}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">{new Date(a.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{a.time}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{a.type}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{a.doctor}</td>
                      <td className="px-5 py-4">
                        <select
                          value={a.status}
                          onChange={async (e) => {
                            await Appointment.update(a.id, { status: e.target.value });
                            loadAll();
                          }}
                          className={`text-xs px-2 py-1 rounded-full border-0 font-medium focus:ring-2 focus:ring-blue-500 ${
                            a.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            a.status === "Cancelled" ? "bg-red-100 text-red-700" :
                            a.status === "Completed" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={async () => { await Appointment.delete(a.id); loadAll(); }} className="text-xs text-red-500 hover:text-red-700">Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && (
                <div className="text-center py-12 text-gray-400">No appointments scheduled</div>
              )}
            </div>
          </div>
        )}

        {/* DOCTORS */}
        {activeTab === "doctors" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Medical Staff</h2>
              <button onClick={() => setShowAddDoctor(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                + Add Doctor
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(d => (
                <div key={d.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                      {d.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Dr. {d.full_name}</p>
                      <p className="text-xs text-gray-500">{d.specialty}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>📞 {d.phone || "—"}</p>
                    <p>✉️ {d.email || "—"}</p>
                    <p>🏥 {d.department || "—"}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      d.status === "Active" ? "bg-green-100 text-green-700" :
                      d.status === "On Leave" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{d.status}</span>
                    <button onClick={async () => { await Doctor.delete(d.id); loadAll(); }} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-400">No doctors added yet</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ADD PATIENT MODAL */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add New Patient</h2>
              <button onClick={() => setShowAddPatient(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", key: "full_name", type: "text", required: true },
                  { label: "Date of Birth", key: "date_of_birth", type: "date" },
                  { label: "Phone", key: "phone", type: "tel" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Insurance Provider", key: "insurance_provider", type: "text" },
                  { label: "Insurance ID", key: "insurance_id", type: "text" },
                  { label: "Blood Type", key: "blood_type", type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type} required={f.required} value={newPatient[f.key]}
                      onChange={e => setNewPatient(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select value={newPatient.gender} onChange={e => setNewPatient(p => ({ ...p, gender: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    {["Male", "Female", "Other", "Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={newPatient.address} onChange={e => setNewPatient(p => ({ ...p, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allergies</label>
                <textarea value={newPatient.allergies} onChange={e => setNewPatient(p => ({ ...p, allergies: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Chronic Conditions</label>
                <textarea value={newPatient.chronic_conditions} onChange={e => setNewPatient(p => ({ ...p, chronic_conditions: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddPatient(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">Add Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD APPOINTMENT MODAL */}
      {showAddAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Schedule Appointment</h2>
              <button onClick={() => setShowAddAppointment(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Patient *</label>
                <select required value={newAppointment.patient_id} onChange={e => setNewAppointment(a => ({ ...a, patient_id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" required value={newAppointment.date} onChange={e => setNewAppointment(a => ({ ...a, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time *</label>
                  <input type="time" required value={newAppointment.time} onChange={e => setNewAppointment(a => ({ ...a, time: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select value={newAppointment.type} onChange={e => setNewAppointment(a => ({ ...a, type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {["General Checkup", "Follow-up", "Specialist Consultation", "Lab Work", "Imaging", "Urgent Care", "Telehealth"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Doctor</label>
                <select value={newAppointment.doctor} onChange={e => setNewAppointment(a => ({ ...a, doctor: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.full_name}>Dr. {d.full_name} — {d.specialty}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={newAppointment.notes} onChange={e => setNewAppointment(a => ({ ...a, notes: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddAppointment(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DOCTOR MODAL */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add Doctor</h2>
              <button onClick={() => setShowAddDoctor(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", key: "full_name", type: "text", required: true },
                  { label: "Specialty", key: "specialty", type: "text" },
                  { label: "Phone", key: "phone", type: "tel" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "License Number", key: "license_number", type: "text" },
                  { label: "Department", key: "department", type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                    <input type={f.type} required={f.required} value={newDoctor[f.key]}
                      onChange={e => setNewDoctor(d => ({ ...d, [f.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
                <textarea value={newDoctor.bio} onChange={e => setNewDoctor(d => ({ ...d, bio: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddDoctor(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700">Add Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
