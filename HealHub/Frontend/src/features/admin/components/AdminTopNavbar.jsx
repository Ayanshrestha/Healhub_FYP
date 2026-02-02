import React from "react";
import { Download, Plus } from "lucide-react";

const AdminTopNavbar = ({ title, subtitle }) => {
    return (
        <div className="flex justify-between items-center mb-8 fadeIn">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 font-primary">{title || "Platform Overview"}</h2>
                <p className="text-gray-500 mt-1 font-medium font-secondary">{subtitle || "Real-time system health and management console."}</p>
            </div>
            <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm text-gray-700">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-900 border border-gray-900 px-4 py-2.5 rounded-xl font-bold hover:bg-black transition shadow-lg text-white">
                    <Plus className="w-4 h-4" />
                    <span>System Action</span>
                </button>
            </div>
        </div>
    );
};

export default AdminTopNavbar;
