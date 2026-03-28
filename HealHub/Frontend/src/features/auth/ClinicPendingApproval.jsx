import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Building2, Clock, Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function ClinicPendingApproval() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 relative flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-emerald-50/60 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-lg text-center">
          {/* Icon */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-200">
              <Building2 className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
            Registration Submitted!
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
            Your clinic registration is now under review by the HealHub team.
            We'll get back to you as soon as possible.
          </p>

          {/* Steps card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 mb-8 text-left">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
              What Happens Next
            </h2>
            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">OTP Verified ✓</p>
                  <p className="text-slate-400 text-xs mt-0.5">Your email has been verified successfully.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Awaiting Admin Approval</p>
                  <p className="text-slate-400 text-xs mt-0.5">Our team is reviewing your clinic details.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-sky-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Approval Email Sent to You</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Once approved, you'll receive an email with a link to set your password.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Set Password & Subscribe</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Click the link in the email, set your password, then choose a subscription plan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-slate-400 text-sm font-medium mb-6">
            Please check your inbox (and spam folder) after approval.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
