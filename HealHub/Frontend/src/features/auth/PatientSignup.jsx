import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Users
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { startRegistration } from "./services/authService";

export default function PatientSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await startRegistration(formData);
      toast.success("Registration started. OTP sent successfully.");
      navigate("/verify-otp", { state: { email: formData.email, role: "patient" } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Visual Context & Impact */}
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-teal-500 to-sky-600 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 max-w-md text-center text-white">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl scale-110">
              <HeartPulse className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Your Health, <br />Simplified.</h1>
            <p className="text-xl text-sky-50 font-medium leading-relaxed opacity-90">
              Join thousands of patients managing their health records and appointments securely with HealHub.
            </p>

            <div className="mt-16 space-y-6">
              <div className="flex items-center space-x-4 text-left p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Secure & Encrypted</h4>
                  <p className="text-xs opacity-70">Your medical data is protected with industry-standard encryption.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-left p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">One-Tap Booking</h4>
                  <p className="text-xs opacity-70">Easy appointment scheduling with top medical professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50/30">
          <div className="w-full max-w-3xl">
            <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="inline-flex lg:hidden w-12 h-12 bg-teal-500 rounded-xl items-center justify-center mb-4 shadow-lg shadow-teal-200">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Patient Signup</h2>
                <p className="text-slate-500 font-medium">Create your secure HealHub health account.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Link to="/login" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline px-4 py-2 bg-teal-50 rounded-full">
                  Have an account?
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">

              {/* Section 1: Personal Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personal Identity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <User className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Ram Sharma"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <Users className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="block w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <Calendar className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Location */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-sky-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Location</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <Mail className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="patient@example.com"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <Phone className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Home Address</label>
                  <div className="relative group">
                    <div className="absolute top-3.5 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                      <MapPin className="h-4.5 w-4.5 text-slate-300" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Kathmandu, Nepal"
                      rows="2"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none shadow-sm"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-teal-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-teal-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue to OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-left">
                  Secured by HealHub Systems
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
