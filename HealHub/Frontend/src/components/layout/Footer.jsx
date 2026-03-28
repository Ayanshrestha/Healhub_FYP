import { ShieldCheck, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">HealHub</span>
          </Link>
          <p className="text-sm font-medium leading-relaxed max-w-xs opacity-80">
            Revolutionizing healthcare accessibility across Nepal. Connecting patients with trusted clinics and specialists.
          </p>
          <div className="flex space-x-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all text-slate-500">
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column */}
        <div className="space-y-6">
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Ecosystem</h4>
          <ul className="space-y-3">
            {["Home", "Features", "For Clinics", "How It Works"].map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-bold hover:text-teal-500 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div className="space-y-6">
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Resources</h4>
          <ul className="space-y-3">
            {["About Us", "Privacy Policy", "Terms of Service", "Support Center"].map((link) => (
              <li key={link}>
                <a href="#" className="text-sm font-bold hover:text-teal-500 transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-teal-600 rounded-full mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-6">
          <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Contact</h4>
          <ul className="space-y-5">
            <li className="flex items-center space-x-3.5">
              <div className="w-9 h-9 bg-teal-600/10 rounded-xl flex items-center justify-center shrink-0 border border-teal-500/10">
                <Mail className="w-4.5 h-4.5 text-teal-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Email</p>
                <a href="mailto:info@healhub.com.np" className="text-sm font-bold text-white/90 hover:text-teal-500 transition-colors">info@healhub.com.np</a>
              </div>
            </li>
            <li className="flex items-center space-x-3.5">
              <div className="w-9 h-9 bg-emerald-600/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/10">
                <Phone className="w-4.5 h-4.5 text-emerald-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Call</p>
                <p className="text-sm font-bold text-white/90">+977 1-234567</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          &copy; {currentYear} HealHub Nepal. Built for a healthier future.
        </p>
        <div className="flex items-center space-x-6 text-[9px] font-black uppercase tracking-widest">
          <Link to="/admin/login" className="flex items-center space-x-2 text-slate-700 hover:text-teal-500 transition-colors group">
            <ExternalLink className="w-3 h-3 group-hover:rotate-12 transition-transform" />
            <span>Admin Terminal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
