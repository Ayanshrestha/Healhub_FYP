import { ChevronRight, Search, MapPin, Calendar, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-50/50 -skew-x-12 translate-x-1/4 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Side: Content */}
        <div className="text-left space-y-8 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 border border-teal-100 rounded-full">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-black text-teal-700 uppercase tracking-widest">Healthcare Evolution in Nepal</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Your Health, <span className="text-teal-600 underline decoration-teal-200 decoration-8 underline-offset-4">Simplified.</span>
          </h1>

          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
            Connect with top-rated clinics, specialist therapists, and home-visit doctors across Nepal. Manage your entire medical journey from one secure portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/signup"
              className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-200 flex items-center justify-center space-x-2 group"
            >
              <span>Initialize Health Profile</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Learn More
            </a>
          </div>

          {/* Search Preview (Visual Only) */}
          <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-2xl shadow-teal-900/5 max-w-2xl transform lg:-rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-2xl group border border-transparent focus-within:border-teal-100 transition-all">
                <MapPin className="w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                <input disabled placeholder="City, Area" className="bg-transparent border-none text-sm font-bold placeholder:text-slate-300 focus:ring-0 w-full" />
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-2xl group border border-transparent focus-within:border-teal-100 transition-all">
                <Search className="w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                <input disabled placeholder="Doctor/Clinic" className="bg-transparent border-none text-sm font-bold placeholder:text-slate-300 focus:ring-0 w-full" />
              </div>
              <button disabled className="bg-slate-900 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-widest opacity-80 cursor-not-allowed">
                Portal Required
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Illustration */}
        <div className="relative lg:block hidden animate-float">
          <div className="absolute inset-0 bg-teal-200 blur-[120px] opacity-20 transform translate-x-12 translate-y-12"></div>
          <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(13,148,136,0.15)] border border-white/20 scale-105 transform rotate-2">
            <img
              src="/healthcare_hero_illustration_1770010678924.png"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1631217818242-277900354236?auto=format&fit=crop&q=80";
              }}
              alt="Healthcare Illustration"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Floating Stats Card */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-50 animate-bounce-slow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Booked Today</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">1,240+</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
