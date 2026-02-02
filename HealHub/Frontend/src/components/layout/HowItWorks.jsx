import { Search, Calendar, Heart, GraduationCap, ChevronRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Discover",
      icon: Search,
      desc: "Find verified clinics or specialists near you using our smart search.",
      color: "bg-teal-600"
    },
    {
      title: "Schedule",
      icon: Calendar,
      desc: "Choose a convenient time slot and book instantly from your portal.",
      color: "bg-emerald-600"
    },
    {
      title: "Consult",
      icon: Heart,
      desc: "Visit the clinic or receive care at home from our trusted providers.",
      color: "bg-teal-500"
    },
    {
      title: "Wellness",
      icon: GraduationCap,
      desc: "Access your medical records and receive follow-up guidance.",
      color: "bg-slate-900"
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Decorative Path Line (Desktop) */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 hidden lg:block z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">Process Flow</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How HealHub Works</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-6 relative group">
              <div className={`${step.color} w-20 h-20 flex items-center justify-center rounded-[2rem] mx-auto text-white shadow-xl shadow-teal-900/10 group-hover:rotate-6 transition-transform duration-500`}>
                <step.icon className="w-10 h-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-900 text-xs font-black shadow-lg">
                  0{index + 1}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{step.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed max-w-[200px] mx-auto">
                  {step.desc}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-10 -right-6 text-slate-200">
                  <ChevronRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
