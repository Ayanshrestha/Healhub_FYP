import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    BarChart,
    DollarSign,
    Settings,
    User,
    Bell,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import clinicService from "../services/clinicService";
import { clearSession, getAssetUrl } from "../../../services/api";
import NotificationDropdown from "../../patient/components/NotificationDropdown";
import { useSocket } from "../../../context/SocketContext";
import Logo from "../../../components/common/Logo";

const ClinicNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
    
    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem("user") || "{}"));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const navLinks = [
        { name: "Dashboard", path: "/clinic/dashboard", icon: LayoutDashboard },
        { name: "Doctors", path: "/clinic/doctors", icon: Users },
        { name: "Appointments", path: "/clinic/appointments", icon: ClipboardList },
        { name: "Patients", path: "/clinic/patients", icon: Calendar },
        { name: "Analytics", path: "/clinic/analytics", icon: BarChart },
        { name: "Billing", path: "/clinic/billing", icon: DollarSign }
    ];

    const handleLogout = () => {
        clearSession();
        navigate("/login");
    };

    const [unreadStats, setUnreadStats] = useState({ total: 0, byAppointment: {} });
    const { socket } = useSocket();

    const fetchUnread = async () => {
        try {
            const stats = await clinicService.getUnreadCounts();
            setUnreadStats(stats);
        } catch (error) {
            console.error("Failed to fetch unread counts:", error);
        }
    };

    useEffect(() => {
        fetchUnread();
        // Refresh every 30 seconds for non-socket updates
        const interval = setInterval(fetchUnread, 30000);

        // Listen for real-time updates
        if (socket) {
            socket.on('unread_count_update', (data) => {
                console.log("📥 Real-time unread update received:", data);
                fetchUnread();
            });
        }

        // Listen for local "Read" events
        const handleRead = () => {
            console.log("✅ Local read event received - refreshing Navbar");
            fetchUnread();
        };
        window.addEventListener('clinical_messages_read', handleRead);

        return () => {
            clearInterval(interval);
            if (socket) socket.off('unread_count_update');
            window.removeEventListener('clinical_messages_read', handleRead);
        };
    }, [socket]);

    // Close dropdowns on route change
    useEffect(() => {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 font-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <button
                        onClick={() => navigate("/clinic/dashboard")}
                        className="focus:outline-none"
                    >
                        <Logo />
                    </button>



                    {/* Navigation Links - Centered */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const hasBadge = (link.name === "Appointments" || link.name === "Patients") && unreadStats.total > 0;

                            return (
                                <button
                                    key={link.name}
                                    onClick={() => navigate(link.path)}
                                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${isActive
                                        ? "bg-teal-50 text-teal-600 shadow-sm shadow-teal-100"
                                        : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    <span>{link.name}</span>
                                    {hasBadge && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm font-black animate-bounce-subtle">
                                            {unreadStats.total > 9 ? "9+" : unreadStats.total}
                                        </span>
                                    )}
                                </button>
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
                                    <p className="text-xs font-bold text-gray-900 leading-none group-hover:text-teal-600 transition-colors uppercase tracking-tight">{user.fullName || "Clinic Admin"}</p>
                                    <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">Verified Clinic</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all border-2 border-white overflow-hidden">
                                    {(user.profilePhoto || user.clinicLogo) ? (
                                        <img 
                                            src={getAssetUrl(user.profilePhoto || user.clinicLogo)} 
                                            alt="User" 
                                            className="w-full h-full object-cover rounded-full" 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "C")}&background=0D9488&color=fff`;
                                            }}
                                        />
                                    ) : (
                                        (user.fullName?.charAt(0) || "C").toUpperCase()
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
                                            onClick={() => navigate("/clinic/profile")}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={() => navigate("/clinic/settings")}
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
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none cursor-pointer"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 pb-3 pt-2">
                    <div className="space-y-1 px-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => {
                                        navigate(link.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold w-full text-left cursor-pointer ${isActive
                                        ? "bg-teal-50 text-teal-700"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span>{link.name}</span>
                                </button>
                            );
                        })}

                        <div className="border-t border-gray-50 my-2 pt-2">
                            <button
                                onClick={() => navigate("/clinic/profile")}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold w-full text-left text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={() => navigate("/clinic/settings")}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold w-full text-left text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
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

export default ClinicNavbar;
