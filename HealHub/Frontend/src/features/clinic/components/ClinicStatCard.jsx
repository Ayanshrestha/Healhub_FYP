import React from "react";

const ClinicStatCard = ({ title, value, subtitle, icon: Icon, colorClass, animationDelay = "0ms" }) => {
    return (
        <div
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 card-hover"
            style={{ animation: `fadeIn 0.6s ease-out ${animationDelay} both` }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClass || "bg-teal-100 text-teal-600"} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-gray-900">{value}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{subtitle}</p>
        </div>
    );
};

export default ClinicStatCard;
