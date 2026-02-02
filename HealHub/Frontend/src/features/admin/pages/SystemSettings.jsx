import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { Settings, Shield, Bell, Database, Save } from "lucide-react";

const SystemSettings = () => {
    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8 fadeIn">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
                    <p className="text-gray-500 mt-1 font-medium">Configure global platform parameters and security.</p>
                </div>
                <button className="flex items-center space-x-2 bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-900/10">
                    <Save className="w-5 h-5" />
                    <span>Save All Changes</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fadeIn">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Shield className="w-5 h-5 mr-3 text-teal-600" />
                            Security Configuration
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                                <div>
                                    <div className="font-bold text-gray-900">Two-Factor Authentication</div>
                                    <div className="text-sm text-gray-500 font-medium">Require 2FA for all administrative logins.</div>
                                </div>
                                <div className="w-12 h-6 bg-teal-500 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                                <div>
                                    <div className="font-bold text-gray-900">Auto-lock Session</div>
                                    <div className="text-sm text-gray-500 font-medium">Logout users after 15 minutes of inactivity.</div>
                                </div>
                                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Database className="w-5 h-5 mr-3 text-emerald-600" />
                            System Maintenance
                        </h3>
                        <div className="flex space-x-4">
                            <button className="flex-1 py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition border border-gray-100">Backup Database</button>
                            <button className="flex-1 py-4 bg-gray-50 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition border border-red-50">Clear System Cache</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Bell className="w-5 h-5 mr-3 text-amber-500" />
                            Alerts
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Get notified about system events via email.</p>
                        <div className="space-y-4">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500" />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-teal-600 transition">Critical Errors</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500" />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-teal-600 transition">New Registration</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500" />
                                <span className="text-sm font-bold text-gray-700 group-hover:text-teal-600 transition">Weekly Reports</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SystemSettings;
