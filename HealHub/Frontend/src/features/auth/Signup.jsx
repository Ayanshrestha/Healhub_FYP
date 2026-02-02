import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Stethoscope,
  Building2,
  Activity,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";

export default function Signup() {
  const navigate = useNavigate();

  const selectionCards = [
    {
      id: "patient",
      title: "Patient",
      description: "Book appointments, chat with doctors, and manage your health records.",
      icon: User,
      color: "from-teal-500 to-teal-600",
      bg: "bg-teal-50",
      path: "/signup/patient"
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Grow your practice, manage appointments, and connect with patients.",
      icon: Stethoscope,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      path: "/signup/doctor"
    },
    {
      id: "clinic",
      title: "Clinic / Hospital",
      description: "Manage multiple doctors, staff, and streamline clinic operations.",
      icon: Building2,
      color: "from-sky-500 to-sky-600",
      bg: "bg-sky-50",
      path: "/signup/clinic"
    },
    {
      id: "therapist",
      title: "Therapist",
      description: "Provide specialized care and sessions to patients in need.",
      icon: Activity,
      color: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      path: "/signup/therapist"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 max-w-2xl mx-auto animate-fadeIn">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-black text-teal-700 uppercase tracking-widest">Join HealHub Network</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">Choose Your Portal</h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Select the account type that best describes you to get started with the most advanced healthcare platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {selectionCards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Background Decor */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${card.bg}`}></div>

                <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{card.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  {card.description}
                </p>

                <div className="flex items-center text-teal-600 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform duration-500">
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center text-slate-400 font-medium">
            <p>
              Already a member?
              <Link to="/login" className="text-teal-600 font-black ml-2 hover:underline">Direct Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
