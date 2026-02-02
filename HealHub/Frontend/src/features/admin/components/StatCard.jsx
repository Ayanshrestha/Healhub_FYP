import React from "react";

const StatCard = ({ title, value, trend, icon: Icon, colorClass, animationDelay = "0ms" }) => {
    return (
        <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-xl group animate-fadeIn"
            style={{ animationDelay }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-2xl font-bold ${colorClass.replace('100', '600').replace('bg-', 'text-')}`}>
                    {value}
                </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{trend}</p>
        </div>
    );
};

export default StatCard;
