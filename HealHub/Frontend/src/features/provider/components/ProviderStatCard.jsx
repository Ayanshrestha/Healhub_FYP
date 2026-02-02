import React from "react";

const ProviderStatCard = ({ title, value, subtitle, icon: Icon, colorClass, delay = "0ms" }) => {
    return (
        <div
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: delay }}
        >
            <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-1">{value}</h3>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-500 italic">{subtitle}</p>
            </div>
        </div>
    );
};

export default ProviderStatCard;
