import React, { useState } from "react";

// Components
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/layout/HeroSection";
import FeaturesSection from "../components/layout/FeaturesSection";
import HowItWorks from "../components/layout/HowItWorks";
import ClinicsSection from "../components/layout/ClinicsSection";
import CTASection from "../components/layout/CTASection";

import { FaLock } from "react-icons/fa";

export default function Home() {
  const [loginModal, setLoginModal] = useState(false);

  const openLogin = () => setLoginModal(true);
  const closeLogin = () => setLoginModal(false);

  return (
    <div className="bg-white min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Sections */}
      <HeroSection />
      <FeaturesSection openLogin={openLogin} />
      <HowItWorks />
      <ClinicsSection />
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* LOGIN MODAL */}
      {loginModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white p-10 rounded-[3rem] max-w-md w-full shadow-2xl text-center animate-fadeIn relative overflow-hidden border border-slate-100">
            {/* Decorative Background for Modal */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="w-20 h-20 bg-teal-600/10 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
              <FaLock className="text-3xl text-teal-600" />
            </div>

            <div className="space-y-4 mb-10">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                Portal Access Required
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                To access advanced features like AI scanning and real-time chat, please log in to your HealHub account.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="/login"
                className="bg-teal-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-900/20"
              >
                Log In to Portal
              </a>

              <button
                onClick={closeLogin}
                className="text-slate-400 py-3 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}