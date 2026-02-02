import React, { useState, useEffect } from "react";
import {
    Users,
    Calendar,
    Clock,
    CheckCircle,
    TrendingUp,
    ArrowUpRight,
    MessageSquare,
    Video,
    AlertCircle,
    Home
} from "lucide-react";
import * as providerService from "../services/providerService";
import ProviderStatCard from "../components/ProviderStatCard";

const ProviderDashboard = () => {
    const [stats, setStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, profileRes, apptRes] = await Promise.all([
                    providerService.getDashboardStats(),
                    providerService.getProviderProfile(),
                    providerService.getAppointments({ date: new Date().toISOString().split('T')[0] })
                ]);

                setStats(statsRes.stats);
                setProfile(profileRes.profile);
                setTodayAppointments(apptRes.appointments || []);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(err.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <p className="text-gray-500 font-semibold animate-pulse">Syncing with HealHub Healthcare Systems...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 text-center max-w-2xl mx-auto mt-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
                <p className="text-red-600 font-semibold mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const statCards = [
        { title: "Today's Load", value: stats?.today || "0", subtitle: "Scheduled Appointments", icon: Calendar, colorClass: "text-teal-600 bg-teal-50" },
        { title: "Total Patients", value: stats?.totalPatients || "0", subtitle: "Lifetime Reach", icon: Users, colorClass: "text-emerald-600 bg-emerald-50" },
        { title: "Home Visits", value: stats?.homeVisits || "0", subtitle: "Active Enrollments", icon: Home, colorClass: "text-teal-600 bg-teal-50" },
        { title: "Total Earnings", value: `Rs. ${stats?.totalEarnings?.toLocaleString() || "0"}`, subtitle: "Completed Consultations", icon: TrendingUp, colorClass: "text-emerald-600 bg-emerald-50" },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Status Alert if Pending */}
            {profile?.verificationStatus !== "verified" && (
                <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 flex items-center space-x-4 animate-fadeIn">
                    <div className="bg-amber-100 p-3 rounded-2xl">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">Profile Status: {profile?.verificationStatus?.toUpperCase() || "PENDING"}</h4>
                        <p className="text-amber-700 text-sm font-semibold">Your professional profile is pending clinic verification or administrative approval. Some features may be restricted.</p>
                    </div>
                </div>
            )}

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Welcome, {profile?.userId?.role === 'doctor' ? 'Dr.' : 'Therapist'} {profile?.fullName || profile?.userId?.email.split('@')[0]}
                    </h1>
                    <p className="text-gray-500 font-bold mt-1 italic">
                        Managing your {profile?.specialization || 'Healthcare'} practice on HealHub.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-5 py-2.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm cursor-pointer border-b-4 active:translate-y-1 active:border-b-0">
                        Practice Report
                    </button>
                    <button className="px-5 py-2.5 bg-gray-900 rounded-2xl text-sm font-bold text-white hover:bg-black transition-all shadow-lg shadow-gray-200 cursor-pointer border-b-4 border-gray-950 active:translate-y-1 active:border-b-0">
                        + Manual Entry
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <ProviderStatCard key={index} {...stat} delay={`${index * 100}ms`} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Appointments Table */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Today's Schedule</h2>
                            <p className="text-gray-400 text-sm font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/provider/appointments'}
                            className="text-sm font-bold text-teal-600 hover:text-teal-700 cursor-pointer flex items-center space-x-1"
                        >
                            <span>View All</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Patient Identity</th>
                                    <th className="px-8 py-4">Timeline</th>
                                    <th className="px-8 py-4">Type</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {todayAppointments.length > 0 ? todayAppointments.map((appt) => (
                                    <tr key={appt._id} className="hover:bg-teal-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-teal-50">
                                                    {(appt.patientId?.fullName || "P").charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{appt.patientId?.fullName || "Unknown Patient"}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: {appt.patientId?._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2 text-teal-600 font-black text-sm">
                                                <Clock className="w-3 h-3" />
                                                <span>{appt.appointmentTime}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${appt.appointmentType === 'HOME_VISIT'
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'bg-teal-100 text-teal-600'
                                                }`}>
                                                {appt.appointmentType?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-1.5">
                                                <div className={`w-2 h-2 rounded-full ${appt.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                                <span className={`text-xs font-black ${appt.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                    {appt.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-gray-300 group-hover:text-teal-600 hover:bg-white rounded-xl transition-all cursor-pointer">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <Calendar className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                            <p className="text-gray-400 font-bold italic">No appointments scheduled for today.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column - Schedule & Recent Activity */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
                            <span>Clinical Feeds</span>
                            <MessageSquare className="w-5 h-5 text-gray-200" />
                        </h2>
                        <div className="space-y-4">
                            {todayAppointments.filter(a => a.status === 'Pending').length > 0 ? (
                                todayAppointments.filter(a => a.status === 'Pending').map((appt) => (
                                    <div key={appt._id} className="p-5 rounded-[1.5rem] bg-amber-50 border border-amber-100 animate-fadeIn">
                                        <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-2">Needs Approval</p>
                                        <p className="text-sm text-gray-700 font-bold">New request from <span className="text-amber-700 font-black">{appt.patientId?.fullName}</span> for today at {appt.appointmentTime}.</p>
                                        <div className="mt-4 flex space-x-2">
                                            <button className="flex-1 py-2 bg-amber-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-amber-700 transition-colors">Accept</button>
                                            <button className="flex-1 py-2 bg-white text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-wider hover:text-red-600 transition-colors">Decline</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <CheckCircle className="w-10 h-10 text-emerald-100 mx-auto mb-3" />
                                    <p className="text-gray-400 text-sm font-bold italic">All feeds are up to date.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-600 to-emerald-800 p-8 rounded-[2rem] shadow-xl shadow-teal-50 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-black text-2xl mb-2">Telemedicine</h3>
                            <p className="text-teal-50 text-sm font-bold mb-8 leading-relaxed opacity-80">You have {todayAppointments.filter(a => a.appointmentType === 'VIRTUAL').length} virtual consultations awaiting your host entry.</p>
                            <button className="w-full py-4 bg-white text-teal-700 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all cursor-pointer shadow-lg shadow-black/10 flex items-center justify-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>Go To Virtual Room</span>
                            </button>
                        </div>
                        <Video className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
