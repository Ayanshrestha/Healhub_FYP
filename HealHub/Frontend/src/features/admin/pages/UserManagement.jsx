import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import { Users, UserPlus, Shield, Search } from "lucide-react";

import { getSystemData, toggleUserStatus } from "../services/adminAuthService";
import { Loader2 } from "lucide-react";

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getSystemData("users");
                // Backend returns { users: [], pagination: {} }
                setUsers(data.users || []);
            } catch (err) {
                setError(err.message || "Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            // Refresh list
            const data = await getSystemData("users");
            setUsers(data.users || []);
        } catch (err) {
            alert(err.message || "Failed to update user status");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8 fadeIn">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-500 mt-1 font-medium">Manage and audit system users across all roles.</p>
                </div>
                <button className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-900/10">
                    <UserPlus className="w-5 h-5" />
                    <span>Add New User</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden fadeIn">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none text-sm"
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">Filters</button>
                        <button className="px-4 py-2 text-sm font-bold text-teal-600 bg-teal-50 rounded-xl transition">Export CSV</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 space-y-4">
                            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
                            <p className="text-gray-500 font-medium">Fetching system users...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500 font-medium">{error}</div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-medium">No users found in the system.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                                    <th className="py-5 px-8">User Profile</th>
                                    <th className="py-5 px-8">System Role</th>
                                    <th className="py-5 px-8">Account Status</th>
                                    <th className="py-5 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user, idx) => (
                                    <tr key={user._id || idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-sm">
                                                    {(user.name || user.email || "?").split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{user.name || "N/A"}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-tight">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <span className="text-sm font-bold text-gray-700 capitalize">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/users/${user._id}`)}
                                                className="text-sm font-bold text-teal-600 hover:underline"
                                            >
                                                View
                                            </button>
                                            <span className="mx-2 text-gray-300">|</span>
                                            <button
                                                onClick={() => handleToggleStatus(user._id)}
                                                className={`text-sm font-bold hover:underline ${user.status === 'active' ? 'text-red-500' : 'text-emerald-600'}`}
                                            >
                                                {user.status === 'active' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
