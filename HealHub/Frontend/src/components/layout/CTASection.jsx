import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="w-full py-24 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div
        className="
          relative
          rounded-[3rem]
          bg-slate-900
          text-white
          p-12 md:p-20
          shadow-2xl
          overflow-hidden
          flex flex-col lg:flex-row lg:items-center lg:justify-between
          gap-12
        "
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-[100px] pointer-events-none"></div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Join the healthcare revolution</span>
          </div>

          <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to experience <br />
            <span className="text-emerald-400">smarter care?</span>
          </h3>

          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Whether you're a patient seeking care or a provider managing a practice, HealHub is your one-stop hub for all health needs in Nepal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <Link
            to="/signup"
            className="
              w-full sm:w-auto
              px-10 py-5
              bg-emerald-500
              text-white
              rounded-2xl
              font-black
              text-sm
              uppercase
              tracking-widest
              shadow-xl shadow-emerald-900/40
              hover:bg-emerald-600
              hover:-translate-y-1
              transition-all
              flex items-center justify-center space-x-3
            "
          >
            <span>Create Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="
              w-full sm:w-auto
              px-10 py-5
              bg-white/5
              text-white
              border border-white/10
              rounded-2xl
              font-black
              text-sm
              uppercase
              tracking-widest
              hover:bg-white/10
              transition-all
              flex items-center justify-center
            "
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
