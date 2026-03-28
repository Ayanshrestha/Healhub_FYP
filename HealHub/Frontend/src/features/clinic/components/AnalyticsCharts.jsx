import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const AppointmentTrend = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
            x: { grid: { display: false } },
        },
    };

    const chartData = {
        labels: data?.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: "Appointments",
            data: data?.values || [42, 38, 45, 50, 48, 35, 30],
            backgroundColor: "#14b8a6",
            borderRadius: 12,
            barThickness: 24,
        }],
    };

    return <Bar options={options} data={chartData} />;
};

export const RevenueLine = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
            x: { grid: { display: false } },
        },
    };

    const chartData = {
        labels: data?.labels || ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
            label: "Revenue",
            data: data?.values || [28500, 32000, 29000, 42000],
            borderColor: "#10b981",
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
                gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
                return gradient;
            },
            borderWidth: 4,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 2,
        }],
    };

    return <Line options={options} data={chartData} />;
};

const AnalyticsCharts = ({ data }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Use actual data from backend or empty defaults
    const appointmentTrendData = {
        labels: months,
        values: data?.appointments || Array(12).fill(0)
    };

    const revenueData = {
        labels: months,
        values: data?.revenue || Array(12).fill(0)
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Stream Chart */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Stream</h3>
                        <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wider">Income velocity</p>
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                        NPR (Rs.)
                    </span>
                </div>
                <div className="h-[280px]">
                    <RevenueLine data={revenueData} />
                </div>
            </div>

            {/* Monthly Bookings Chart */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100/80 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Monthly Bookings</h3>
                        <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wider">Volume analysis</p>
                    </div>
                    <span className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-teal-100/50">
                        Live Data
                    </span>
                </div>
                <div className="h-[280px]">
                    <AppointmentTrend data={appointmentTrendData} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
