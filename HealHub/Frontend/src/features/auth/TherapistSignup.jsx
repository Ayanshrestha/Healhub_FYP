import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Users,
  Stethoscope,
  IdCard,
  Award,
  MapPin,
  ArrowRight,
  Loader2,
  ShieldPlus,
  Smile,
  Zap
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { toast } from "react-hot-toast";
import { startRegistration } from "./services/authService";

export default function TherapistSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: "",
    licenseNumber: "",
    experienceYears: "",
    workAddress: "",
    role: "therapist",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = { ...form, role: "therapist" };

    try {
      await startRegistration(formData);
      toast.success("Registration started. OTP sent successfully.");
      navigate("/verify-otp", { state: { email: formData.email, role: "therapist" } });
    } catch (err) {
      console.error(err);
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
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-teal-600 to-emerald-700 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 max-w-md text-center text-white">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl scale-110">
              <Smile className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Heal with <br />HealHub.</h1>
            <p className="text-xl text-teal-50 font-medium leading-relaxed opacity-90">
              Join Nepal's premier network of therapists and counselors providing essential mental health and rehabilitation care.
            </p>

            <div className="mt-16 space-y-6">
              <div className="flex items-center space-x-4 text-left p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Certified Professional</h4>
                  <p className="text-xs opacity-70">Showcase your clinical expertise to a wider audience.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-left p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Growth Platform</h4>
                  <p className="text-xs opacity-70">Access powerful tools to manage and grow your practice.</p>
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
                <div className="inline-flex lg:hidden w-12 h-12 bg-teal-600 rounded-xl items-center justify-center mb-4 shadow-lg shadow-teal-200">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Therapist Registration</h2>
                <p className="text-slate-500 font-medium">Register as a certified therapist or counselor.</p>
              </div>
              <Link to="/login" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline px-4 py-2 bg-teal-50 rounded-full">
                Already Registered?
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">

              {/* Section 1: Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-teal-600 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Basic Information</h3>
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
                        value={form.fullName}
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
                        value={form.gender}
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
                        value={form.email}
                        onChange={handleChange}
                        placeholder="therapist@example.com"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
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
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+977-98XXXXXXXX"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Professional Details */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Background</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specialization */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Therapeutic specialty</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <Stethoscope className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <select
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        required
                        className="block w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold appearance-none focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all cursor-pointer"
                      >
                        <option value="">Select Specialty</option>
                        <option value="Physiotherapy">Physiotherapy</option>
                        <option value="Counseling">Counseling</option>
                        <option value="Psychotherapy">Psychotherapy</option>
                        <option value="Rehabilitation Therapy">Rehabilitation Therapy</option>
                        <option value="Occupational Therapy">Occupational Therapy</option>
                        <option value="Speech Therapy">Speech Therapy</option>
                      </select>
                    </div>
                  </div>

                  {/* License */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Certification ID</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <IdCard className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        placeholder="THER-XXXXX"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years in Practice</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                        <Award className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="number"
                        name="experienceYears"
                        value={form.experienceYears}
                        onChange={handleChange}
                        placeholder="3"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Workplace */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-sky-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workplace Address</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic / Practice Location</label>
                  <div className="relative group">
                    <div className="absolute top-3.5 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                      <MapPin className="h-4.5 w-4.5 text-slate-300" />
                    </div>
                    <textarea
                      name="workAddress"
                      value={form.workAddress}
                      onChange={handleChange}
                      placeholder="Full Workplace Address"
                      rows="2"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-teal-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-teal-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue registration</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400 mt-6 font-medium uppercase tracking-widest">
                  Secure processing by HealHub Verification Systems
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
