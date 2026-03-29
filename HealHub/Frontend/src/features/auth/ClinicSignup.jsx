import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Globe,
  Plus
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { toast } from "react-hot-toast";
import { startRegistration } from "./services/authService";

export default function ClinicSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clinicName: "",
    ownerName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
    role: "clinic",
    licenseDocument: null
  });

  const handleChange = (e) => {
    if (e.target.name === "licenseDocument") {
      setForm({ ...form, licenseDocument: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.licenseDocument) {
      toast.error("Please upload the clinic registration license.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      await startRegistration(formData);
      toast.success("Registration started. OTP sent successfully.");
      navigate("/verify-otp", { state: { email: form.email, role: "clinic" } });
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
        <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 max-w-md text-center text-white">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl scale-110">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Partner with <br />HealHub.</h1>
            <p className="text-xl text-emerald-50 font-medium leading-relaxed opacity-90">
              Modernize your patient booking, management systems and grow your clinic's reach.
            </p>

            <div className="mt-16 space-y-6">
              <div className="flex items-center space-x-4 text-left p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Verified Facility</h4>
                  <p className="text-xs opacity-70">Build trust with verified clinic profiles.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-left p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Digital Reach</h4>
                  <p className="text-xs opacity-70">Connect with more patients in your region.</p>
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
                <div className="inline-flex lg:hidden w-12 h-12 bg-emerald-600 rounded-xl items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Clinic Enrollment</h2>
                <p className="text-slate-500 font-medium">List your health facility on Nepal's modern health platform.</p>
              </div>
              <Link to="/login" className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline px-4 py-2 bg-emerald-50 rounded-full">
                Already Partnered?
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">

              {/* Section 1: Clinic Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-emerald-600 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinic Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clinic Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                        <Building2 className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        name="clinicName"
                        value={form.clinicName}
                        onChange={handleChange}
                        placeholder="ABC Medical Center"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person / Owner</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                        <User className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        name="ownerName"
                        value={form.ownerName}
                        onChange={handleChange}
                        placeholder="Dr. Sita Sharma"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Official Credentials */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Credentials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* License Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration License No.</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                        <FileText className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        placeholder="LM-XXXXXX"
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* License Document Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Document (PDF/Image)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                        <Plus className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="file"
                        name="licenseDocument"
                        onChange={handleChange}
                        accept=".pdf,image/*"
                        required
                        className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-500 font-bold file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* Section 3: Connectivity */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-sky-500 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Connectivity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                        <Mail className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="contact@abcclinic.com"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                        <Phone className="h-4.5 w-4.5 text-slate-300" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Location */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-orange-400 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Physical Location</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Address</label>
                  <div className="relative group">
                    <div className="absolute top-3.5 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-600 transition-colors">
                      <MapPin className="h-4.5 w-4.5 text-slate-300" />
                    </div>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Lalitpur, Nepal"
                      rows="2"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all resize-none shadow-sm"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-emerald-200 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Enroll Clinic</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-left">
                  Already registered?
                  <Link to="/login" className="text-emerald-600 font-black ml-2 hover:underline">Login here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
