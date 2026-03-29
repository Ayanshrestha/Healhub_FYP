import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import AnalyticsCharts from "../components/AnalyticsCharts";
import clinicService from "../services/clinicService";
import { Loader2, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";

const ClinicAnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [analytics, dashboardStats] = await Promise.all([
                    clinicService.getAnalytics(),
                    clinicService.getDashboardStats()
                ]);
                setAnalyticsData(analytics);
                setStats(dashboardStats);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <ClinicLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
                </div>
            </ClinicLayout>
        );
    }

    return (
        <ClinicLayout>
            <div className="space-y-10 pb-16">
                {/* Page Title & Hero Earning Stat */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight font-primary">Facility Intelligence</h1>
                        <p className="text-gray-500 font-bold mt-1 max-w-xl text-lg uppercase tracking-tight">Financial Velocity & Operational Performance</p>
                    </div>

                    {/* Big Hero Earning Card */}
                    <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-[2.5rem] shadow-xl text-white min-w-[300px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center space-x-2 mb-2 opacity-80">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Cumulative Earnings</span>
                            </div>
                            <div className="text-4xl font-black tracking-tighter">
                                Rs. {stats?.totalEarnings?.toLocaleString() || "0"}
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-teal-300" />
                                <span className="text-xs font-bold text-teal-100">Live Financial Snapshot</span>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 bg-white/10 w-32 h-32 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                </div>

                {/* Primary Charts Section */}
                <AnalyticsCharts data={analyticsData} />

                {/* Performance Insights & Top Staff */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Top Performing Doctors */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Top Specialists</h3>
                                <p className="text-sm text-gray-400 font-bold mt-1">Personnel performance by consultation volume</p>
                            </div>
                            <span className="p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                <TrendingUp className="w-5 h-5 text-teal-600" />
                            </span>
                        </div>

                        <div className="overflow-hidden border border-gray-100 rounded-3xl">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <th className="py-5 px-6">Name & Specialization</th>
                                        <th className="py-5 px-6 text-center">Visits</th>
                                        <th className="py-5 px-6 text-right">Revenue (NPR)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-gray-700">
                                    {(analyticsData?.topDoctors && analyticsData.topDoctors.length > 0) ? (
                                        analyticsData.topDoctors.map((doc, idx) => (
                                            <tr key={idx} className="border-b border-gray-50/50 hover:bg-gray-50/30 transition-colors">
                                                <td className="py-5 px-6">
                                                    <div>
                                                        <p className="font-black text-gray-900">{doc.name}</p>
                                                        <p className="text-[10px] text-teal-600 uppercase tracking-tighter">{doc.specialization}</p>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 text-center font-black text-gray-500">{doc.count}</td>
                                                <td className="py-5 px-6 text-right font-black text-teal-600">Rs. {doc.revenue?.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="py-12 text-center text-gray-400 italic">No completed consultations recorded</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Deeper Metrics */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center space-y-3 hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Load</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{stats?.todayAppointments || 0} <span className="text-sm font-bold text-gray-400 ml-1">Appts</span></p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center space-y-3 hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Base</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{stats?.totalPatients || 0} <span className="text-sm font-bold text-gray-400 ml-1">Patients</span></p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 rounded-[2rem] shadow-xl flex flex-col justify-center space-y-3 hover:scale-[1.02] transition-all text-white">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-teal-50 uppercase tracking-widest opacity-70">Daily Performance</p>
                                <p className="text-3xl font-black text-white mt-1">
                                    Rs. {(stats?.totalEarnings / (stats?.totalPatients || 1)).toFixed(0)}
                                    <span className="text-sm font-bold text-teal-100/60 ml-2">Avg / Patient</span>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
};

export default ClinicAnalyticsPage;
