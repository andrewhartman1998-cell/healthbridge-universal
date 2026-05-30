import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import Login from "./pages/Login";
import PatientPortal from "./pages/PatientPortal";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorView from "./pages/DoctorView";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg font-medium">HealthBridge Universal</p>
          <p className="text-sm opacity-70 mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  // Route by role
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "doctor":
      return <DoctorView />;
    case "patient":
    default:
      return <PatientPortal />;
  }
}
