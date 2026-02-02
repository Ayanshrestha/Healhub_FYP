import React from "react";
import { HeartPulse, Bell, LogOut, LayoutDashboard, Users, Building, BarChart3, Settings } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";

import NotificationDropdown from "../../patient/components/NotificationDropdown";

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAdmin();
        navigate("/admin/login");
    };

    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Clinics", path: "/admin/clinics", icon: Building },
        { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <NavLink to="/admin/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110">
                            <HeartPulse className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 hidden md:block tracking-tight">HealHub Admin</h1>
                    </NavLink>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                                    ${isActive
                                        ? "bg-teal-50 text-teal-600 shadow-sm shadow-teal-100"
                                        : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"}
                                `}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationDropdown />

                        <div className="flex items-center space-x-3 border-l pl-4 border-gray-100">
                            <div className="flex items-center space-x-3 cursor-pointer p-1.5 rounded-xl hover:bg-gray-50 transition-all group">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-all">
                                    SA
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-bold text-gray-900 leading-tight">System Admin</p>
                                    <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Root Access</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
