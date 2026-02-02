import React from "react";
import AnalyticsChart from "./AnalyticsChart";

const SystemAnalyticsChart = ({ analyticsData }) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">System Analytics</h3>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    <button className="px-4 py-1.5 bg-white text-teal-600 shadow-sm rounded-lg text-sm font-semibold transition-all">Month</button>
                    <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700 rounded-lg text-sm font-medium transition-all">Year</button>
                </div>
            </div>
            <AnalyticsChart labels={analyticsData?.categories} series={analyticsData?.series} />
        </div>
    );
};

export default SystemAnalyticsChart;
