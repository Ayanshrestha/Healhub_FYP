import React from 'react';
import { useNavigate } from 'react-router-dom';
import MedicineScanner from '../components/MedicineScanner';
import { ShieldCheck, Activity, Bell, ArrowLeft } from 'lucide-react';

const MedicineScannerPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium border border-transparent hover:border-slate-200 px-4 py-2 rounded-full hover:bg-white hover:shadow-sm w-fit"
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                {/* Main Scanner Section */}
                <MedicineScanner />

                {/* Secondary Info Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:rotate-12 transition-transform">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="font-black text-slate-900 mb-3 text-lg">Safe & Private</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Images are processed securely using local OCR technology ensuring your data stays private.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:rotate-12 transition-transform">
                            <Activity size={32} />
                        </div>
                        <h3 className="font-black text-slate-900 mb-3 text-lg">High Precision</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Matches against a global database of 200,000+ medications with AI confidence scoring.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 group-hover:rotate-12 transition-transform">
                            <Bell size={32} />
                        </div>
                        <h3 className="font-black text-slate-900 mb-3 text-lg">Smart Alerts</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Seamlessly add scanned medicines to your smart schedule with built-in interaction alerts.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineScannerPage;
