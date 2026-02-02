import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";
import { getDashboardStats, getSystemData, getAnalytics, exportLogs, updateClinicStatus } from "../services/adminAuthService";
import {
    UserPlus,
    Building,
    UserCheck,
    Activity,
    Eye,
    MoreVertical,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2
} from "lucide-react";
import UserManagementList from "../components/UserManagementList";
import ClinicApprovalPanel from "../components/ClinicApprovalPanel";
import SystemStatusPanel from "../components/SystemStatusPanel";
import SystemAnalyticsChart from "../components/SystemAnalyticsChart";

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [pendingClinics, setPendingClinics] = useState([]);
    const [doctorOversight, setDoctorOversight] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [stats, analytics, usersData, logsData] = await Promise.all([
                getDashboardStats(),
                getAnalytics(),
                getSystemData("users"),
                getSystemData("logs")
            ]);

            setStatsData(stats);
            setAnalyticsData(analytics);
            setRecentUsers(usersData.users?.slice(0, 5) || []);
            setPendingClinics(stats.pendingClinics || []);
            setDoctorOversight(stats.doctorOversight || []);
            setLogs(logsData.logs?.slice(0, 5) || []);
            setFetchError("");
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setFetchError(err.message || "Failed to connect to system services.");
        } finally {
            setLoading(false);
        }
    };

    const handleClinicAction = async (clinicId, status) => {
        try {
            setActionLoading(true);
            await updateClinicStatus(clinicId, status);
            alert(`Clinic ${status === "APPROVED_UNPAID" ? "Approved" : "Rejected"} successfully`);
            setSelectedClinic(null);
            fetchData();
        } catch (err) {
            alert(err.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    const stats = statsData ? [
        { title: "Total Patients", value: (statsData.users?.patients || 0).toLocaleString(), trend: "Platform-wide", icon: UserPlus, colorClass: "bg-teal-100 text-teal-600", delay: "0ms" },
        { title: "Active Clinics", value: (statsData.clinics?.active || 0).toString(), trend: `${statsData.clinics?.pending || 0} pending approval`, icon: Building, colorClass: "bg-emerald-100 text-emerald-600", delay: "100ms" },
        { title: "Active Doctors", value: (statsData.doctors || 0).toString(), trend: "Verified members", icon: UserCheck, colorClass: "bg-teal-100 text-teal-600", delay: "200ms" },
        { title: "System Health", value: statsData.platformHealth || "N/A", trend: "Status: Optimal", icon: Activity, colorClass: "bg-emerald-100 text-emerald-600", delay: "300ms" },
    ] : [
        { title: "Total Patients", value: loading ? "..." : "Error", trend: loading ? "Loading..." : "Check connection", icon: UserPlus, colorClass: "bg-teal-100 text-teal-600", delay: "0ms" },
        { title: "Active Clinics", value: loading ? "..." : "Error", trend: loading ? "Loading..." : "Check connection", icon: Building, colorClass: "bg-emerald-100 text-emerald-600", delay: "100ms" },
        { title: "Active Doctors", value: loading ? "..." : "Error", trend: loading ? "Loading..." : "Check connection", icon: UserCheck, colorClass: "bg-teal-100 text-teal-600", delay: "200ms" },
        { title: "System Health", value: loading ? "..." : "Error", trend: loading ? "Loading..." : "Check connection", icon: Activity, colorClass: "bg-emerald-100 text-emerald-600", delay: "300ms" },
    ];

    const systemStatus = statsData?.health ? [
        { name: "API Server", status: statsData.health.api, iconColor: statsData.health.api === "Online" ? "text-emerald-500" : "text-red-500", bgColor: statsData.health.api === "Online" ? "bg-emerald-500" : "bg-red-500" },
        { name: "Database", status: statsData.health.database, iconColor: statsData.health.database === "Online" ? "text-emerald-500" : "text-red-500", bgColor: statsData.health.database === "Online" ? "bg-emerald-500" : "bg-red-500" },
        { name: "Payment Gateway", status: statsData.health.payment, iconColor: statsData.health.payment === "Online" ? "text-emerald-500" : "text-red-500", bgColor: statsData.health.payment === "Online" ? "bg-emerald-500" : "bg-red-500" },
        { name: "Email Service", status: statsData.health.email, iconColor: statsData.health.email === "Active" ? "text-emerald-500" : "text-red-500", bgColor: statsData.health.email === "Active" ? "bg-emerald-500" : "bg-red-500" },
    ] : [
        { name: "API Server", status: "...", iconColor: "text-gray-400", bgColor: "bg-gray-400" },
        { name: "Database", status: "...", iconColor: "text-gray-400", bgColor: "bg-gray-400" },
        { name: "Payment Gateway", status: "...", iconColor: "text-gray-400", bgColor: "bg-gray-400" },
        { name: "Email Service", status: "...", iconColor: "text-gray-400", bgColor: "bg-gray-400" },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Platform Overview</h2>
                    <p className="text-gray-500 mt-1">Real-time system health and management console.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => exportLogs()} className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm text-gray-700">
                        <Download className="w-4 h-4" />
                        <span>Export Logs</span>
                    </button>
                </div>
            </div>

            {fetchError && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold">Data Sync Error</p>
                        <p className="text-xs opacity-80">{fetchError}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} animationDelay={stat.delay} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <SystemAnalyticsChart analyticsData={analyticsData} />
                <SystemStatusPanel systemStatus={systemStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <UserManagementList loading={loading} recentUsers={recentUsers} />
                <ClinicApprovalPanel
                    loading={loading}
                    pendingClinics={pendingClinics}
                    doctorOversight={doctorOversight}
                    setSelectedClinic={setSelectedClinic}
                    handleClinicAction={handleClinicAction}
                />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Security Events</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 uppercase text-xs font-bold border-b border-gray-50">
                                <th className="py-4 px-2">Timestamp</th>
                                <th className="py-4 px-2">Action</th>
                                <th className="py-4 px-2">User</th>
                                <th className="py-4 px-2">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {logs.map((log, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                                    <td className="py-4 px-2 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="py-4 px-2 font-bold text-gray-900">{log.action}</td>
                                    <td className="py-4 px-2 text-gray-600">{log.performedBy?.email || "System"}</td>
                                    <td className="py-4 px-2 font-mono text-gray-400 text-xs">{log.ipAddress || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedClinic && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoomIn">
                        <div className="p-8 border-b border-gray-50">
                            <h3 className="text-2xl font-bold text-gray-900">{selectedClinic.clinicName}</h3>
                            <p className="text-gray-500 mt-1 font-medium">Facility Verification Review</p>
                        </div>
                        <div className="p-8 space-y-4 text-sm text-gray-600">
                            <p><strong>Owner:</strong> {selectedClinic.ownerName}</p>
                            <p><strong>Email:</strong> {selectedClinic.email}</p>
                            <p><strong>Address:</strong> {selectedClinic.address || "N/A"}</p>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex space-x-3">
                            <button onClick={() => setSelectedClinic(null)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition">Cancel</button>
                            <button onClick={() => handleClinicAction(selectedClinic._id, "REJECTED")} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">Reject</button>
                            <button onClick={() => handleClinicAction(selectedClinic._id, "APPROVED_UNPAID")} className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition">Approve</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
