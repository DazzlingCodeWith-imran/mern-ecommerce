import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRegister from "./components/AdminRegister";
import VerifyOTP from "./components/VerifyOTP";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
  <Route path="/admin/register" element={<AdminRegister />} />
  <Route path="/verify-otp" element={<VerifyOTP />} />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="*" element={<h1 className="text-center mt-10">404 - Page Not Found</h1>} />
</Routes>
    </Router>
  );
};

export default App;