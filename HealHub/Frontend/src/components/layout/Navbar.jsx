import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "../common/Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Features", href: "/#features" },
    { label: "For Clinics", href: "/#for-clinics" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 w-full z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="focus:outline-none">
            <Logo />
          </Link>


          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-bold text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
            >
              Portal Login
            </Link>

            <Link
              to="/signup"
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-50 p-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-slate-50 flex flex-col space-y-2">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
            >
              Portal Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-3 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
