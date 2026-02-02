import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AnalyticsChart from "../components/AnalyticsChart";
import { TrendingUp, Users, DollarSign, Download, Loader2, AlertCircle } from "lucide-react";
import { getAnalytics, getDashboardStats } from "../services/adminAuthService";

const PlatformAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analytics, dashboardStats] = await Promise.all([
                getAnalytics(),
                getDashboardStats()
            ]);
            setAnalyticsData(analytics);
            setStats(dashboardStats);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to fetch platform analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8 fadeIn">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Platform Analytics</h2>
                    <p className="text-gray-500 mt-1 font-medium">Deep dive into system performance and growth trends.</p>
                </div>
                <button
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition shadow-lg disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    <span>Download Report</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4 fadeIn">
                    <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
                    <p className="text-gray-500 font-bold">Compiling platform data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center fadeIn">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-red-900 mb-2">Analytics Error</h3>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 fadeIn">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                                <Users className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Users</div>
                            <div className="text-3xl font-black text-gray-900">
                                {stats?.users?.total?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-emerald-600 font-bold mt-2">
                                {stats?.users?.active || 0} active accounts
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">System Health</div>
                            <div className="text-3xl font-black text-gray-900">{stats?.platformHealth || "N/A"}</div>
                            <div className="text-xs text-emerald-600 font-bold mt-2">Status: Optimal</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Verified Doctors</div>
                            <div className="text-3xl font-black text-gray-900">{stats?.doctors?.toLocaleString() || "0"}</div>
                            <div className="text-xs text-blue-600 font-bold mt-2">Onboarded experts</div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm fadeIn">
                        <h3 className="text-xl font-bold text-gray-900 mb-8">Interaction Trends</h3>
                        <div className="h-[400px]">
                            <AnalyticsChart
                                labels={analyticsData?.categories}
                                series={analyticsData?.series}
                            />
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default PlatformAnalytics;
