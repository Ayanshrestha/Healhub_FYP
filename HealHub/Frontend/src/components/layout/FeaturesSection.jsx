import {
  Calendar,
  Home,
  Bell,
  Search,
  MessageSquare,
  Building2,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

export default function FeaturesSection({ openLogin }) {
  const features = [
    {
      icon: Calendar,
      title: "Appointment Booking",
      desc: "Instantly book slots with your preferred clinicians and specialists across Nepal.",
      color: "text-teal-600",
      bg: "bg-teal-50"
    },
    {
      icon: Home,
      title: "Home-Visit Service",
      desc: "Get professional care at your doorstep from certified doctors and therapists.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      desc: "Never miss a dose with our automated medicine notification system.",
      color: "text-sky-600",
      bg: "bg-sky-50"
    },
    {
      icon: Search,
      title: "AI Medicine Scanner",
      desc: "Instant information on medications using advanced AI scanning technology.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: MessageSquare,
      title: "Real-time Consult",
      desc: "Chat directly with healthcare providers for quick follow-ups and queries.",
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      icon: Building2,
      title: "Clinic Management",
      desc: "Tools for small clinics to modernize their operations and patient visibility.",
      color: "text-teal-700",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <section id="features" className="py-32 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">Core Ecosystem</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Comprehensive Digital <br />Healthcare Solutions
          </h3>
          <p className="text-slate-500 font-medium">Everything you need to manage your health in the modern age.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              onClick={openLogin}
              className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-teal-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>

              <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tight flex items-center">
                {item.title}
                <ArrowUpRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all text-teal-600" />
              </h4>

              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                {item.desc}
              </p>

              <div className="flex items-center text-teal-600 font-black text-[10px] uppercase tracking-widest pt-4 border-t border-slate-50 group-hover:border-teal-50 transition-colors">
                <span>Access Feature</span>
                <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
