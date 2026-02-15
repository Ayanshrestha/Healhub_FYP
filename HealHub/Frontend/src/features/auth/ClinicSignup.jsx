import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Lock
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await startRegistration({ ...form, role: "clinic" });
      if (res.success) {
        alert(res.message || "OTP sent!");
        navigate(`/verify-otp?email=${form.email}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          <Link to="/signup" className="inline-flex items-center space-x-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-teal-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Registration Node Select</span>
          </Link>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-teal-900/5 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar Info */}
            <div className="md:w-1/3 bg-emerald-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">Clinic Enrollment</h2>
                <p className="text-emerald-50 font-medium opacity-80 text-sm leading-relaxed">
                  List your health facility on HealHub to modernize your patient booking and management systems.
                </p>
              </div>

              <div className="relative z-10 pt-10">
                <div className="flex items-center space-x-3 text-xs font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                  <span>Verified Medical Partner</span>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-10 lg:p-14">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Clinic Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Name</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="text"
                        name="clinicName"
                        required
                        value={form.clinicName}
                        onChange={handleChange}
                        placeholder="ABC Medical Center"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="text"
                        name="ownerName"
                        required
                        value={form.ownerName}
                        onChange={handleChange}
                        placeholder="Dr. Sita Sharma"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Clinic Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* License Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License No. (Opt)</label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="text"
                        name="licenseNumber"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        placeholder="LM-123456"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Lalitpur, Nepal"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-slate-400 text-sm font-medium">
                    Already registered?
                    <Link to="/clinic-login" className="text-emerald-600 font-black ml-2 hover:underline">Clinic Node Access</Link>
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-emerald-200"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
