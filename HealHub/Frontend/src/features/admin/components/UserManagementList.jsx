import React from "react";
import { Loader2, Eye, MoreVertical } from "lucide-react";

const UserManagementList = ({ loading, recentUsers }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">Patients</button>
                    <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-bold">Doctors</button>
                </div>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-teal-600" /></div>
                ) : recentUsers.length === 0 ? (
                    <p className="text-gray-400 text-center p-4">No recent signups</p>
                ) : recentUsers.map((user, idx) => (
                    <div key={user._id || idx} className="group p-4 rounded-2xl border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold shadow-inner`}>
                                    {(user.name || user.email || "?")[0].toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{user.name || "New User"}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{user.role} • {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 bg-gray-50 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                                <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50/30 rounded-2xl font-bold transition-all">
                View Complete User Directory
            </button>
        </div>
    );
};

export default UserManagementList;
