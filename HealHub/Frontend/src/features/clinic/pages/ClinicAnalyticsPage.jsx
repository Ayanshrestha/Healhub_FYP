import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import AnalyticsCharts from "../components/AnalyticsCharts";
import clinicService from "../services/clinicService";
import { Loader2, TrendingUp, Users, Calendar } from "lucide-react";

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
            <div className="space-y-8 pb-12">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Performance Intelligence</h1>
                    <p className="text-gray-500 font-bold mt-1">Advanced data visualization for your healthcare facility.</p>
                </div>

                <AnalyticsCharts data={analyticsData} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-2">
                        <Calendar className="w-8 h-8 text-teal-500" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Today's Visits</p>
                        <p className="text-3xl font-black text-gray-900">{stats?.todayAppointments || 0}</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-2">
                        <Users className="w-8 h-8 text-emerald-500" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Patient Base</p>
                        <p className="text-3xl font-black text-gray-900">{stats?.totalPatients || 0}</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-2">
                        <TrendingUp className="w-8 h-8 text-teal-600" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Staff</p>
                        <p className="text-3xl font-black text-gray-900">{stats?.totalDoctors || 0}</p>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
};

export default ClinicAnalyticsPage;
