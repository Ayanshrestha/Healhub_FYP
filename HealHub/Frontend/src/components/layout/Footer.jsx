import { ShieldCheck, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

        {/* Brand Column */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">HealHub</span>
          </Link>
          <p className="text-sm font-medium leading-relaxed max-w-xs">
            Revolutionizing healthcare accessibility across Nepal. Connecting patients with trusted clinics and specialists since 2024.
          </p>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column */}
        <div className="space-y-8">
          <h4 className="text-white font-black text-xs uppercase tracking-widest">Ecosystem</h4>
          <ul className="space-y-4">
            {["Home", "Features", "For Clinics", "How It Works"].map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-bold hover:text-teal-500 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div className="space-y-8">
          <h4 className="text-white font-black text-xs uppercase tracking-widest">Resources</h4>
          <ul className="space-y-4">
            {["About Us", "Privacy Policy", "Terms of Service", "Support Center"].map((link) => (
              <li key={link}>
                <a href="#" className="text-sm font-bold hover:text-teal-500 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-8">
          <h4 className="text-white font-black text-xs uppercase tracking-widest">Contact Office</h4>
          <ul className="space-y-6">
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-teal-600/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-teal-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Us</p>
                <a href="mailto:info@healhub.com.np" className="text-sm font-bold text-white hover:text-teal-500 transition-colors">info@healhub.com.np</a>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Call Us</p>
                <p className="text-sm font-bold text-white">+977 1-234567</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 px-6">
        <p className="text-xs font-bold uppercase tracking-widest flex items-center">
          &copy; {currentYear} HealHub Nepal. Built with pride for a healthier future.
        </p>
        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest">
          <Link to="/admin/login" className="flex items-center space-x-2 text-slate-600 hover:text-teal-500 transition-colors">
            <ExternalLink className="w-3 h-3" />
            <span>Admin Terminal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
