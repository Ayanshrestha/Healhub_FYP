import React, { useState, useEffect } from "react";
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Calendar,
    Building2,
    CreditCard,
    Download,
    Loader2,
    AlertCircle,
    ArrowRight,
    PieChart,
    BarChart3
} from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import * as providerService from "../services/providerService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ProviderEarnings = () => {
    const [earningsData, setEarningsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                setLoading(true);
                const res = await providerService.getEarnings();
                setEarningsData(res.report);
            } catch (err) {
                console.error("Earnings fetch error:", err);
                setError("Failed to load financial records");
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-gray-900 font-black tracking-tight">{error}</p>
                <button onClick={() => window.location.reload()} className="text-teal-600 font-bold hover:underline">Retry Connection</button>
            </div>
        );
    }

    const monthlyLabels = Object.keys(earningsData?.monthlyBreakdown || {});
    const monthlyAmounts = monthlyLabels.map(label => earningsData.monthlyBreakdown[label].amount);

    const lineData = {
        labels: monthlyLabels.length > 0 ? monthlyLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Revenue',
            data: monthlyAmounts.length > 0 ? monthlyAmounts : [0, 0, 0, 0, 0, 0],
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.05)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0d9488',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { weight: 'bold' },
                padding: 12,
                cornerRadius: 12
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false }, ticks: { font: { weight: 'bold' } } },
            x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Revenue Analytics</h1>
                    <p className="text-gray-500 font-bold mt-1 italic">Real-time tracking of clinic disbursements and consultation revenue.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-white border-2 border-gray-100 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition shadow-sm cursor-pointer border-b-4 active:translate-y-1 active:border-b-0">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-900 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-black transition shadow-lg shadow-gray-200 cursor-pointer border-b-4 border-gray-950 active:translate-y-1 active:border-b-0">
                        <CreditCard className="w-4 h-4" />
                        <span>Payout Settings</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between">
                            <div className="bg-teal-50 p-4 rounded-2xl">
                                <DollarSign className="w-6 h-6 text-teal-600" />
                            </div>
                            <span className="flex items-center space-x-1 text-xs font-black text-emerald-600 p-1.5 bg-emerald-50 rounded-lg">
                                <TrendingUp className="w-3 h-3" />
                                <span>+14.2%</span>
                            </span>
                        </div>
                        <div className="mt-8">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Earnings</p>
                            <h3 className="text-4xl font-black text-gray-900 mt-1">Rs. {earningsData?.totalEarnings?.toLocaleString() || "0"}</h3>
                            <p className="text-xs font-bold text-gray-500 mt-2 italic">Based on completed consultations</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="font-black text-gray-900 flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-teal-600" />
                            <span>Monthly Performance</span>
                        </h3>
                        <div className="flex space-x-2">
                            {['6 Months', '1 Year'].map(t => (
                                <button key={t} className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-teal-600 border border-transparent hover:border-teal-100 rounded-lg transition-all">{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48 w-full">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Multi-Clinic Breakdown */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-black text-gray-900 mb-8 flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-teal-600" />
                        <span>Clinic-wise Revenue</span>
                    </h3>
                    <div className="space-y-6 flex-1">
                        {Object.keys(earningsData?.clinicBreakdown || {}).length > 0 ? Object.entries(earningsData.clinicBreakdown).map(([name, amount], idx) => (
                            <div key={idx} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-black text-[10px] text-gray-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </div>
                                        <p className="font-black text-gray-700 text-sm">{name}</p>
                                    </div>
                                    <p className="font-black text-teal-600 text-sm">Rs. {amount.toLocaleString()}</p>
                                </div>
                                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-teal-600 transition-all duration-1000"
                                        style={{ width: `${(amount / (earningsData.totalEarnings || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic">
                                <Building2 className="w-10 h-10 mb-2" />
                                <p className="text-[10px] font-bold">No clinic affiliations detected yet.</p>
                            </div>
                        )}
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:shadow-md transition-all flex items-center justify-center space-x-2">
                        <span>Affiliation Details</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-black text-gray-900 flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-teal-600" />
                            <span>Recent Earnings</span>
                        </h3>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Showing last 10 visits</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Source Identification</th>
                                    <th className="px-8 py-5">Clinic Unit</th>
                                    <th className="px-8 py-5">Timeline</th>
                                    <th className="px-8 py-5 text-right">Amount (NPR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {earningsData?.detailedHistory?.length > 0 ? earningsData.detailedHistory.slice(0, 10).map((txn, idx) => (
                                    <tr key={idx} className="hover:bg-teal-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 text-xs font-black shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all">
                                                    {(txn.patientId?.fullName || "P").charAt(0)}
                                                </div>
                                                <span className="font-black text-gray-900 text-sm italic">{txn.patientId?.fullName || "Legacy Patient"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-white transition-all">
                                                {txn.clinicId?.clinicName || "Direct / Home Visit"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-700">
                                                    {new Date(txn.appointmentDate).toLocaleDateString('en-GB')}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 italic">ID: {txn._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right font-black text-emerald-600 text-sm">
                                            + {txn.doctorEarning?.toLocaleString() || "0"}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <CreditCard className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                                            <p className="text-gray-400 font-bold italic text-sm">Your financial history starts after your first completed consultation.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderEarnings;
