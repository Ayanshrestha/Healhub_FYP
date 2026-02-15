import React, { useState, useEffect } from "react";
import patientService from "../services/patientService";
import {
    Loader2,
    Lock,
    Bell,
    Shield,
    Check,
    Pill,
    Calendar,
    FileText,
    Fingerprint,
    Info,
    Layout,
    ArrowRight,
    AtSign
} from "lucide-react";

/**
 * PatientSettings Component
 * Patient-Centric Design for Health and Security Management
 */
const PatientSettings = () => {
    // State management
    const [activeTab, setActiveTab] = useState("notifications"); // "notifications", "security", "account"
    const [preferences, setPreferences] = useState({
        medicationReminders: true,
        appointmentAlerts: true,
        reportNotifications: true,
        healthTips: false
    });
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Initial data fetch
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const data = await patientService.getProfile();

                // Prioritize notification preferences from profile
                const storedPrefs = data?.notificationPreferences;
                if (storedPrefs) {
                    setPreferences(prev => ({ ...prev, ...storedPrefs }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Preference toggling with optimistic UI
    const handlePreferenceToggle = async (key) => {
        const oldValue = preferences[key];
        const updated = { ...preferences, [key]: !oldValue };
        setPreferences(updated);

        try {
            await patientService.updatePreferences(updated);
        } catch (error) {
            console.error("Failed to sync preferences:", error);
            // Revert on failure
            setPreferences(prev => ({ ...prev, [key]: oldValue }));
        }
    };

    // Password change logic
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword.length < 6) {
            setMessage({ type: "error", text: "New password must be at least 6 characters." });
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }

        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await patientService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: "success", text: "Security settings updated successfully." });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });

            // Auto-hide success message
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Password update failed." });
        } finally {
            setSaving(false);
        }
    };

    // Navigation Menu Component
    const NavMenu = () => {
        const menuItems = [
            { id: "notifications", label: "Health Alerts", icon: Bell, desc: "Reminders & Pings" },
            { id: "security", label: "Security", icon: Shield, desc: "Account Access" },
            { id: "account", label: "Status", icon: Fingerprint, desc: "Account Tier" }
        ];

        return (
            <div className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-4 p-4 rounded-[2rem] transition-all duration-300 group ${activeTab === item.id
                                ? "bg-white shadow-xl shadow-teal-500/5 ring-1 ring-teal-50"
                                : "hover:bg-white/50"
                            }`}
                    >
                        <div className={`p-2.5 rounded-2xl transition-all duration-300 ${activeTab === item.id
                                ? "bg-teal-500 text-white scale-110 shadow-lg shadow-teal-500/20"
                                : "bg-gray-100 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-500"
                            }`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className={`text-sm font-black tracking-tight ${activeTab === item.id ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"}`}>
                                {item.label}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                <p className="text-gray-400 font-black text-xs uppercase tracking-widest animate-pulse">Loading Health Preferences...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-24 fadeIn font-primary">
            {/* Header Area */}
            <div className="mb-12 space-y-2">
                <div className="flex items-center space-x-2 text-teal-600 font-black text-xs uppercase tracking-[0.2em]">
                    <Layout className="w-4 h-4" />
                    <span>Account Configuration</span>
                </div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">Settings <span className="text-teal-500">.</span></h1>
            </div>

            {/* Notification Logic */}
            {message.text && (
                <div className={`mb-8 p-5 rounded-[2rem] font-bold flex items-center justify-between animate-slideIn ${message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm"
                        : "bg-red-50 text-red-700 border border-red-100 shadow-sm"
                    }`}>
                    <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-xl ${message.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                            {message.type === "success" ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        </div>
                        <span className="text-sm">{message.text}</span>
                    </div>
                    <button onClick={() => setMessage({ type: "", text: "" })} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <ArrowRight className="w-4 h-4 rotate-45" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <div className="sticky top-28 space-y-8">
                        <NavMenu />
                        <div className="p-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] text-white shadow-xl shadow-teal-500/20">
                            <p className="text-lg font-black tracking-tight leading-none mb-2">Health Safe</p>
                            <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider leading-relaxed">Your health data is encrypted and protected with HealHub Security Protocol.</p>
                            <div className="mt-6 flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-teal-200" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-teal-100">Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-8 animate-slideUp">
                    {activeTab === "notifications" && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <span>Health Alerts <span className="text-teal-500">.</span></span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: "medicationReminders", label: "Medications", icon: Pill, desc: "Dose time alerts." },
                                        { id: "appointmentAlerts", label: "Appointments", icon: Calendar, desc: "Booking pings." },
                                        { id: "reportNotifications", label: "Lab Reports", icon: FileText, desc: "New report ready." },
                                        { id: "healthTips", label: "Health Tips", icon: Info, desc: "Expert wellness feeds." }
                                    ].map((pref) => (
                                        <div
                                            key={pref.id}
                                            onClick={() => handlePreferenceToggle(pref.id)}
                                            className={`p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer group flex items-center justify-between ${preferences[pref.id]
                                                    ? "bg-white border-teal-500/10 shadow-lg shadow-teal-500/5"
                                                    : "bg-gray-50 border-transparent opacity-60"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-3 rounded-2xl transition-all duration-300 ${preferences[pref.id] ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "bg-white text-gray-400"
                                                    }`}>
                                                    <pref.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-gray-900 tracking-tight leading-none mb-1">{pref.label}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">{pref.desc}</p>
                                                </div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full transition-all duration-300 relative p-1 ${preferences[pref.id] ? "bg-teal-500" : "bg-gray-200"
                                                }`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${preferences[pref.id] ? "translate-x-6" : "translate-x-0"
                                                    }`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                    <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <span>Access Control <span className="text-red-500">.</span></span>
                                </h3>

                                <form onSubmit={handlePasswordChange} className="space-y-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Matrix Key</label>
                                            <AtSign className="w-3 h-3 text-gray-300" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500/20 focus:bg-white transition-all outline-none font-bold shadow-inner"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">New Key</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500/20 focus:bg-white transition-all outline-none font-bold shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Confirm Key</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500/20 focus:bg-white transition-all outline-none font-bold shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                        <span>{saving ? "Updating..." : "Authorize Change"}</span>
                                    </button>
                                </form>
                            </section>
                        </div>
                    )}

                    {activeTab === "account" && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                        <Fingerprint className="w-6 h-6" />
                                    </div>
                                    <span>Status Matrix <span className="text-teal-500">.</span></span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Identity Status</p>
                                        <p className="text-2xl font-black text-gray-900">Verified</p>
                                    </div>
                                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Layout className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Tier</p>
                                        <p className="text-2xl font-black text-gray-900">Patient Plus</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-center space-x-4">
                                    <Info className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                    <p className="text-xs font-bold text-amber-900/60 leading-relaxed uppercase tracking-wide">Account settings are synchronized across all devices. Changes take effect instantly.</p>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientSettings;
