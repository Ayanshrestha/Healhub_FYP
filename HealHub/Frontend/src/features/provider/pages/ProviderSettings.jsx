import React, { useState, useEffect, useMemo } from "react";
import * as providerService from "../services/providerService";
import {
    Loader2,
    Lock,
    Bell,
    Shield,
    ChevronRight,
    Check,
    MessageSquare,
    Calendar,
    Building2,
    Power,
    User,
    ArrowRight,
    AtSign,
    Fingerprint,
    Info,
    Layout
} from "lucide-react";

/**
 * ProviderSettings Component
 * Ultra-Premium Redesign for Doctors & Therapists
 */
const ProviderSettings = () => {
    // State management
    const [activeTab, setActiveTab] = useState("security"); // "security", "notifications", "account"
    const [preferences, setPreferences] = useState({
        appointmentAlerts: true,
        patientMessages: true,
        affiliationRequests: true,
        earningsReports: false
    });
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [profile, setProfile] = useState(null);

    // Initial data fetch
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const data = await providerService.getProviderProfile();
                setProfile(data.profile);

                // Prioritize notification preferences from profile or user object
                const storedPrefs = data.profile?.notificationPreferences || data.profile?.userId?.notificationPreferences;
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
            await providerService.updatePreferences(updated);
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
            await providerService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: "success", text: "Security credentials updated successfully." });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });

            // Auto-hide success message
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Password update failed." });
        } finally {
            setSaving(false);
        }
    };

    // Navigation Menu Component
    const NavMenu = () => {
        const menuItems = [
            { id: "security", label: "Security", icon: Shield, desc: "Credentials & Access" },
            { id: "notifications", label: "Notifications", icon: Bell, desc: "Signal Logic" },
            { id: "account", label: "Verification", icon: Fingerprint, desc: "System Status" }
        ];

        return (
            <div className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-4 p-4 rounded-3xl transition-all duration-300 group ${activeTab === item.id
                                ? "bg-white shadow-lg shadow-teal-500/5 ring-1 ring-teal-100"
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
                        {activeTab === item.id && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
                    <Layout className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-teal-500" />
                </div>
                <p className="text-gray-400 font-bold text-sm tracking-widest uppercase animate-pulse">Initializing System Core...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-24 fadeIn font-primary">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-teal-600 font-black text-xs uppercase tracking-[0.2em]">
                        <Layout className="w-4 h-4" />
                        <span>System Configuration</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">Settings <span className="text-teal-500">.</span></h1>
                    <p className="text-gray-500 font-bold text-lg">Managing professional protocols and digital identity.</p>
                </div>

                <div className="flex items-center p-1.5 bg-gray-100 rounded-[2rem] border border-gray-200 shadow-inner">
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === "security" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Basic
                    </button>
                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === "notifications" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        Signals
                    </button>
                </div>
            </div>

            {/* Notification Logic */}
            {message.text && (
                <div className={`mb-8 p-5 rounded-[2.5rem] font-bold flex items-center justify-between animate-slideIn ${message.type === "success"
                        ? "bg-emerald-500/5 text-emerald-700 border border-emerald-100 shadow-lg shadow-emerald-500/5"
                        : "bg-red-500/5 text-red-700 border border-red-100 shadow-lg shadow-red-500/5"
                    }`}>
                    <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-2xl ${message.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
                            {message.type === "success" ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="text-sm font-black tracking-tight">{message.type === "success" ? "Protocol Optimized" : "Access Denied"}</p>
                            <p className="text-xs opacity-70">{message.text}</p>
                        </div>
                    </div>
                    <button onClick={() => setMessage({ type: "", text: "" })} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <ArrowRight className="w-4 h-4 rotate-45" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Internal Sidebar */}
                <div className="lg:col-span-3">
                    <div className="sticky top-28 bg-white/50 backdrop-blur-xl p-6 rounded-[3rem] border border-white shadow-xl shadow-teal-500/5 space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4 ml-1">Control Hub</p>
                            <NavMenu />
                        </div>

                        <div className="p-5 bg-teal-500 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Session Data</p>
                                <p className="text-lg font-black tracking-tight leading-tight">Sync Status <br /> Active</p>
                                <div className="mt-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Connect</span>
                                </div>
                            </div>
                            <Layout className="absolute bottom-[-10px] right-[-10px] w-16 h-16 text-white/10 -rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-8 animate-slideUp">
                    {activeTab === "security" && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[3.5rem] p-12 border border-blue-50/50 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                                <h3 className="text-3xl font-black text-gray-900 mb-12 flex items-center space-x-4">
                                    <div className="p-4 bg-blue-50 rounded-3xl text-blue-600 ring-4 ring-blue-50/50 shadow-lg shadow-blue-500/10">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <span>Access Control <span className="text-blue-500">.</span></span>
                                </h3>

                                <form onSubmit={handlePasswordChange} className="space-y-12">
                                    <div className="space-y-3 group">
                                        <div className="flex items-center justify-between px-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Legacy Password</label>
                                            <AtSign className="w-4 h-4 text-gray-300 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Verify current identity"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:border-blue-500/30 focus:bg-white transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3 group">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Matrix Key</label>
                                                <Shield className="w-4 h-4 text-gray-300 group-focus-within:text-blue-400 transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Set new protocol"
                                                value={passwords.newPassword}
                                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:border-blue-500/30 focus:bg-white transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-3 group">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Verify Strategy</label>
                                                <Check className="w-4 h-4 text-gray-300 group-focus-within:text-blue-400 transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Confirm protocol"
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:border-blue-500/30 focus:bg-white transition-all outline-none font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="group relative w-full py-6 bg-gray-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all overflow-hidden shadow-2xl shadow-gray-200 active:scale-95 disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <div className="relative flex items-center justify-center space-x-3">
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                            <span>{saving ? "Optimizing..." : "Initialize Update"}</span>
                                        </div>
                                    </button>
                                </form>
                            </section>

                            <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 flex items-start space-x-6">
                                <div className="p-4 bg-white rounded-3xl text-amber-600 shadow-sm">
                                    <Info className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-amber-900 mb-1 leading-tight">Identity Protection Protocol</p>
                                    <p className="text-xs font-bold text-amber-700/70 leading-relaxed uppercase tracking-wide">Update your credentials every 90 cycles to maintain peak system security. Always use non-repeating complex keys.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[3.5rem] p-12 border border-teal-50/50 shadow-2xl shadow-teal-500/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                                    <h3 className="text-3xl font-black text-gray-900 flex items-center space-x-4">
                                        <div className="p-4 bg-teal-50 rounded-3xl text-teal-600 ring-4 ring-teal-50/50 shadow-lg shadow-teal-500/10">
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <span>Signal Logic <span className="text-teal-500">.</span></span>
                                    </h3>
                                    <div className="px-5 py-2 bg-gray-50 rounded-full border border-gray-100 flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mt-0.5">Live Sync Active</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: "appointmentAlerts", label: "Appointments", icon: Calendar, desc: "New booking impulses.", color: "teal" },
                                        { id: "patientMessages", label: "Messaging", icon: MessageSquare, desc: "Direct patient packets.", color: "indigo" },
                                        { id: "affiliationRequests", label: "Affiliations", icon: Building2, desc: "Clinic bridge requests.", color: "amber" },
                                        { id: "earningsReports", label: "Settlements", icon: Power, desc: "Financial ledger logs.", color: "emerald" }
                                    ].map((pref) => (
                                        <div
                                            key={pref.id}
                                            onClick={() => handlePreferenceToggle(pref.id)}
                                            className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer group ${preferences[pref.id]
                                                    ? "bg-white border-teal-500/20 shadow-xl shadow-teal-500/5 rotate-0 translate-y-0"
                                                    : "bg-gray-50/50 border-transparent grayscale brightness-95 translate-y-2 opacity-60"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`p-4 rounded-[1.5rem] transition-all duration-500 ${preferences[pref.id] ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20 scale-110" : "bg-white text-gray-400"
                                                    }`}>
                                                    <pref.icon className="w-6 h-6" />
                                                </div>
                                                <div className={`w-14 h-7 rounded-full transition-all duration-500 relative p-1 ${preferences[pref.id] ? "bg-teal-500" : "bg-gray-200"
                                                    }`}>
                                                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-500 ${preferences[pref.id] ? "translate-x-7" : "translate-x-0"
                                                        }`} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">{pref.label}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{pref.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="p-10 bg-gray-900 rounded-[3.5rem] text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black flex items-center space-x-3">
                                            <Layout className="w-6 h-6 text-teal-400" />
                                            <span>Unified Notifications</span>
                                        </h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm">
                                            All signals are processed through our proprietary neural bridge for zero-latency communication.
                                        </p>
                                    </div>
                                    <button className="px-8 py-5 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-black/20">
                                        Global Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "account" && (
                        <div className="space-y-8">
                            <section className="bg-white rounded-[3.5rem] p-12 border border-teal-50/50 shadow-2xl shadow-teal-500/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                                <h3 className="text-3xl font-black text-gray-900 mb-12 flex items-center space-x-4">
                                    <div className="p-4 bg-teal-50 rounded-3xl text-teal-600 ring-4 ring-teal-50/50 shadow-lg shadow-teal-500/10">
                                        <Fingerprint className="w-6 h-6" />
                                    </div>
                                    <span>System Status <span className="text-teal-500">.</span></span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                    <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center space-y-4 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                                        <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50/50">
                                            <Shield className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status</p>
                                            <p className="text-2xl font-black tracking-tight text-gray-900">Verified</p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 opacity-60 uppercase tracking-wide px-4">Your professional credentials have been validated by HealHub core.</p>
                                    </div>

                                    <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center space-y-4 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-500 ring-8 ring-blue-50/50">
                                            <User className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Member Tier</p>
                                            <p className="text-2xl font-black tracking-tight text-gray-900">Professional</p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 opacity-60 uppercase tracking-wide px-4">Standard tier with full clinical & diagnostic capability access.</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-900 rounded-[3rem] text-white flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                            <Power className="w-6 h-6 text-teal-400" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm tracking-tight">Digital Footprint Protocol</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terminate all active sessions across devices.</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                                        Purge All
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderSettings;
