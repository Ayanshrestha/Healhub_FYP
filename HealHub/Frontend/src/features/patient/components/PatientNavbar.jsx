import React, { useState } from "react";
import {
    HeartPulse,
    LayoutDashboard,
    Search,
    Calendar,
    Pill,
    FileText,
    User,
    LogOut,
    Menu,
    X,
    Settings
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const PatientNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard },
        { name: "Clinics", path: "/patient/clinics", icon: Search },
        { name: "Appointments", path: "/patient/appointments", icon: Calendar },
        { name: "Medicines", path: "/patient/medicines", icon: Pill },
        { name: "Reports", path: "/patient/reports", icon: FileText },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
    };

    // Close dropdowns on route change
    React.useEffect(() => {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 font-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link
                        to="/patient/dashboard"
                        className="flex-shrink-0 flex items-center space-x-2 focus:outline-none cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:rotate-12 group-hover:scale-110 transition-all font-bold">
                            <HeartPulse className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">HealHub</span>
                    </Link>

                    {/* Navigation Links - Centered */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname.startsWith(link.path);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${isActive
                                        ? "bg-teal-50 text-teal-600 shadow-sm shadow-teal-100"
                                        : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <NotificationDropdown />

                        <div className="relative ml-4 pl-4 border-l border-gray-100">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 focus:outline-none cursor-pointer group"
                            >
                                <div className="text-right hidden xl:block">
                                    <p className="text-xs font-bold text-gray-900 leading-none group-hover:text-teal-600 transition-colors uppercase tracking-tight">{user.fullName || "Patient"}</p>
                                    <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">Verified Account</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all border-2 border-white">
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="User" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        (user.fullName?.charAt(0) || "P").toUpperCase()
                                    )}
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-slideDown">
                                        <button
                                            onClick={() => navigate("/patient/profile")}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => navigate("/patient/settings")}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                        <div className="my-1 border-t border-gray-50"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <NotificationDropdown />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none cursor-pointer transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 pb-3 pt-2 animate-fadeIn">
                    <div className="space-y-1 px-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname.startsWith(link.path);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold w-full text-left cursor-pointer transition-colors ${isActive
                                        ? "bg-teal-50 text-teal-700"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                        <div className="border-t border-gray-50 my-2 pt-2">
                            <button
                                onClick={() => {
                                    navigate("/patient/profile");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold w-full text-left text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                <User className="w-5 h-5" />
                                <span>My Profile</span>
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/patient/settings");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold w-full text-left text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PatientNavbar;
