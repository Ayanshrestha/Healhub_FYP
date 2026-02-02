import { ShieldCheck, TrendingUp, Users, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ClinicsSection() {
  const benefits = [
    "Digital Appointment Ecosystem",
    "Real-time Patient Management",
    "Encrypted Consultation Chat",
    "Home-Visit Logistics Tool",
    "Advanced Practice Analytics",
    "Cross-Platform Accessibility"
  ];

  return (
    <section id="for-clinics" className="py-32 px-6 bg-slate-900 overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[150px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

        {/* Left Side: Content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Provider Solutions</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Modernize Your Practice <br />in Minutes.
            </h3>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
              HealHub provides small clinics, dental practices, and therapists in Nepal with high-end tools to reach more patients and manage operations seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-slate-300 font-bold text-sm tracking-tight">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <a
              href="/signup"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-900/40 group"
            >
              <span>Partner With HealHub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Side: Visual Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-4 hover:bg-white/10 transition-colors">
                <TrendingUp className="w-10 h-10 text-emerald-400" />
                <h4 className="text-white font-black text-lg">Growth</h4>
                <p className="text-slate-500 text-xs font-medium">Boost clinic visibility across Nepal's regions.</p>
              </div>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-4 hover:bg-white/10 transition-colors">
                <Users className="w-10 h-10 text-teal-400" />
                <h4 className="text-white font-black text-lg">Patient Sata</h4>
                <p className="text-slate-500 text-xs font-medium">Digital records for all your patients.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-3xl border border-white/5 space-y-4 col-span-2 relative overflow-hidden group/card shadow-2xl">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    <h4 className="text-white font-black text-xl">Verified Security</h4>
                    <p className="text-slate-400 text-sm font-medium">Healthcare data protected by enterprise encryption.</p>
                  </div>
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
