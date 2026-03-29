import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import { Users, UserPlus, Shield, Search, Filter, Download, ChevronLeft, ChevronRight, X } from "lucide-react";

import { getSystemData, toggleUserStatus } from "../services/adminAuthService";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        search: "",
        role: "",
        status: "",
        page: 1
    });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSystemData("users", {
                ...filters,
                limit: 10
            });
            setUsers(data.users || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        } catch (err) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [fetchUsers]);

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            fetchUsers();
            toast.success("User status updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update user status");
        }
    };

    const handleExportCSV = () => {
        if (users.length === 0) return;

        const headers = ["ID", "Name", "Email", "Role", "Status", "Joined"];
        const rows = users.map(user => [
            user._id,
            user.name || "N/A",
            user.email,
            user.role,
            user.status,
            new Date(user.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `healhub-users-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8 fadeIn">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">User Management</h2>
                    <p className="text-gray-500 mt-1 font-medium">Manage and audit system users across all roles.</p>
                </div>
                <button className="flex items-center space-x-3 bg-teal-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 transition shadow-lg shadow-teal-500/20 active:scale-95">
                    <UserPlus className="w-5 h-5 font-black" />
                    <span>Add New User</span>
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden fadeIn">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="relative w-full lg:w-[400px]">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-3xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none text-sm font-bold placeholder:text-gray-300 shadow-inner"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, search: "", page: 1 }))}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-4 w-full lg:w-auto">
                            <div className="flex gap-2 p-1 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${showFilters ? "bg-teal-600 text-white shadow-lg shadow-teal-500/20" : "text-gray-500 hover:bg-gray-50"}`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>{showFilters ? "Close Filters" : "Filters"}</span>
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    disabled={users.length === 0}
                                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-teal-600 hover:bg-teal-50 transition-all disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export CSV</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Filter Menu */}
                    {showFilters && (
                        <div className="mt-8 flex flex-wrap gap-4 animate-slideDown">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
                                <select
                                    value={filters.role}
                                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
                                    className="block w-48 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                >
                                    <option value="">All Roles</option>
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="therapist">Therapist</option>
                                    <option value="clinic">Clinic</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                                    className="block w-48 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setFilters({ search: "", role: "", status: "", page: 1 })}
                                className="mt-auto px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                            >
                                Reset All
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 space-y-6">
                            <Loader2 className="w-16 h-16 text-teal-600 animate-spin" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Refreshing user data...</p>
                        </div>
                    ) : error ? (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <X className="w-10 h-10 text-red-500" />
                            </div>
                            <p className="text-red-500 font-bold uppercase tracking-widest text-xs">{error}</p>
                            <button onClick={fetchUsers} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-800">Try Again</button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No users found</h3>
                            <p className="text-xs text-gray-300 mt-2 font-medium">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-50">
                                        <th className="py-6 px-8">User Profile</th>
                                        <th className="py-6 px-8">System Role</th>
                                        <th className="py-6 px-8">Account Status</th>
                                        <th className="py-6 px-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user, idx) => (
                                        <tr key={user._id || idx} className="group hover:bg-teal-50/20 transition-all duration-300">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-110 transition-transform">
                                                        {(user.name || user.email || "?").split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-800 text-sm">{user.name || "N/A"}</div>
                                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-tight">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic border ${
                                                    user.role === 'doctor' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    user.role === 'clinic' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                                                    user.role === 'patient' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                                                    <span className={`text-[11px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-emerald-600' : 'text-red-400'}`}>
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right space-x-4">
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                    className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-100 text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Users className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user._id)}
                                                    className={`inline-flex items-center justify-center w-10 h-10 border rounded-xl transition-all hover:shadow-lg ${
                                                        user.status === 'active' 
                                                        ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-red-500/20' 
                                                        : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/20'
                                                    }`}
                                                    title={user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="p-8 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Showing <span className="text-gray-900">{users.length}</span> of <span className="text-gray-900">{pagination.total}</span> entries
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button
                                        disabled={pagination.page <= 1}
                                        onClick={() => setFilters(prev => ({ ...prev, page: pagination.page - 1 }))}
                                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-teal-600 hover:border-teal-100 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 shadow-sm transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center px-4">
                                        <span className="text-xs font-black text-teal-600 italic">Page</span>
                                        <span className="text-xs font-black text-gray-900 mx-2 bg-white px-3 py-1.5 rounded-lg border border-gray-100">{pagination.page}</span>
                                        <span className="text-xs font-black text-teal-600 italic">of {pagination.pages}</span>
                                    </div>
                                    <button
                                        disabled={pagination.page >= pagination.pages}
                                        onClick={() => setFilters(prev => ({ ...prev, page: pagination.page + 1 }))}
                                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-teal-600 hover:border-teal-100 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 shadow-sm transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;

