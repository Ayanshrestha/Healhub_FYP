import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import ClinicStatCard from "../components/ClinicStatCard";
import DoctorManagement from "../components/DoctorManagement";
import ActivityTimeline from "../components/ActivityTimeline";
import AnalyticsCharts from "../components/AnalyticsCharts";
import clinicService from "../services/clinicService";
import {
    Users,
    Calendar,
    Activity,
    Plus,
    ArrowRight,
    ShieldCheck,
    DollarSign
} from "lucide-react";

const ClinicDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [stats, analytics] = await Promise.all([
                    clinicService.getDashboardStats(),
                    clinicService.getAnalytics()
                ]);
                setDashboardData(stats);
                setAnalyticsData(analytics);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <ClinicLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </ClinicLayout>
        );
    }

    const stats = [
        { title: "Active Doctors", value: dashboardData?.totalDoctors || "0", subtitle: "Affiliated Staff", icon: Users, colorClass: "bg-teal-100 text-teal-600", delay: "0ms" },
        { title: "Today's Appointments", value: dashboardData?.todayAppointments || "0", subtitle: "Scheduled today", icon: Calendar, colorClass: "bg-emerald-100 text-emerald-600", delay: "100ms" },
        { title: "Total Earning", value: `Rs. ${dashboardData?.totalEarnings?.toLocaleString() || "0"}`, subtitle: "Consultation Revenue", icon: DollarSign, colorClass: "bg-blue-100 text-blue-600", delay: "200ms" },
        { title: "Total Patients", value: dashboardData?.totalPatients || "0", subtitle: "Lifetime visits", icon: ShieldCheck, colorClass: "bg-purple-100 text-purple-600", delay: "300ms" },
    ];

    const activities = [
        { type: "INFO", title: "Live Sync", description: "Dashboard connected to live backend database.", time: "Just now" },
    ];

    return (
        <ClinicLayout status="ACTIVE">
            <div className="space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight font-primary capitalize">
                            Clinic Management
                        </h1>
                        <p className="text-gray-500 font-bold mt-1">Real-time facility operations and patient flow analytics.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 bg-white border-2 border-gray-100 px-5 py-2.5 rounded-2xl font-bold hover:bg-gray-50 transition shadow-sm text-gray-700">
                            <Activity className="w-4 h-4" />
                            <span>System Log</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-gray-900 border border-gray-900 px-5 py-2.5 rounded-2xl font-bold hover:bg-black transition shadow-lg text-white">
                            <Plus className="w-4 h-4" />
                            <span>Emergency Slot</span>
                        </button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <ClinicStatCard key={idx} {...stat} />
                    ))}
                </div>

                {/* Primary Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Analytics Charts */}
                        <AnalyticsCharts data={analyticsData} />

                        {/* Appointments Table (Overview) */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center py-12 text-center">
                            <Calendar className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold italic max-w-sm">Dashboard sync successful. Please visit the specific management pages for full lists.</p>
                            <button onClick={() => window.location.href = '/clinic/appointments'} className="mt-4 text-teal-600 font-bold hover:underline">View All Appointments</button>
                        </div>
                    </div>

                    {/* Secondary Information Column */}
                    <div className="space-y-8">
                        {/* Summary View */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h4 className="font-black text-gray-900 mb-4">Quick Overview</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-semibold">Today's Load</span>
                                    <span className="font-black text-teal-600">{dashboardData?.todayAppointments} appts</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-semibold">Affiliated Docs</span>
                                    <span className="font-black text-emerald-600">{dashboardData?.totalDoctors} online</span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Timeline */}
                        <ActivityTimeline activities={activities} />

                        {/* Subscription Quick View Card */}
                        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-1">Premium Plan</h3>
                                <p className="text-teal-100 font-bold text-xs uppercase tracking-widest mb-6">Subscription: Active</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <p className="text-sm text-teal-50/70 font-semibold italic">Expires in</p>
                                        <p className="text-2xl font-black">24 Days</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm text-teal-50/70 font-semibold italic">Next Renewal</p>
                                        <p className="font-black">Rs. 5,000</p>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-white text-teal-700 rounded-2xl font-black text-sm hover:bg-teal-50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 shadow-lg">
                                    <span>Renew Membership</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
};

export default ClinicDashboard;
