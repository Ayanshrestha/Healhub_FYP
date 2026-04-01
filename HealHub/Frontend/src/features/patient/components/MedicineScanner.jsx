import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Camera, Upload, X, Check, Loader2, Plus, Info,
    AlertCircle, ShieldCheck, Zap, ArrowRight, RefreshCw,
    Clipboard, AlertTriangle, FileText, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../services/api';

const MedicineScanner = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('uses');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File size too large. Maximum 5MB allowed.");
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleScan = async () => {
        if (!image) return;

        setScanning(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}/api/medicine/scan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setResult(response.data.data);
                setActiveTab('uses');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Scanning failed:", err);
            const msg = err.response?.data?.message || "Failed to connect to AI service. Please make sure the Python server is running on port 8000.";
            setError(msg);
        } finally {
            setScanning(false);
        }
    };

    const handleAddToReminder = () => {
        if (!result) return;
        navigate('/patient/reminders', {
            state: {
                prefill: {
                    medicineName: result.brandName,
                    dosage: result.strength || "1 tablet",
                    notes: `Generic: ${result.genericName}. Scanned via HealHub AI.`
                }
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Header Section */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100 shadow-sm">
                    <Zap size={14} className="fill-blue-700" />
                    <span>AI-Powered Recognition</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Medicine <span className="text-blue-600">Smart Scanner</span></h2>
                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                    Upload or capture your medication to instantly verify details and set reminders.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Scanner Interface */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                        {!preview ? (
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="aspect-[4/5] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors group"
                            >
                                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform duration-500 ease-out">
                                    <Camera size={40} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 text-lg mb-2">Capture Medication</h4>
                                <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed">
                                    Click here to upload or take a clear photo of the medicine box
                                </p>
                                <div className="mt-8 px-6 py-2.5 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 border border-slate-200">
                                    JPG, PNG • Max 5MB
                                </div>
                            </div>
                        ) : (
                            <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                                <img src={preview} alt="Scan Preview" className="w-full h-full object-contain" />

                                {scanning && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="h-1 w-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.8)] animate-scanner-line"></div>
                                        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                                            <Loader2 size={48} className="animate-spin mb-4" />
                                            <span className="font-black text-xl tracking-widest uppercase">Analyzing...</span>
                                        </div>
                                    </div>
                                )}

                                {!scanning && !result && (
                                    <button
                                        onClick={() => { setImage(null); setPreview(null); setResult(null); setError(null); }}
                                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-red-500 text-white p-2.5 rounded-2xl transition-all border border-white/20 shadow-xl"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {!result && preview && !scanning && (
                        <button
                            onClick={handleScan}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Zap size={24} className="fill-blue-400 text-blue-400" />
                            START AI SCAN
                        </button>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-center text-red-700 animate-shake">
                            <AlertTriangle size={20} className="flex-shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Results & Info */}
                <div className="lg:col-span-7 space-y-6">
                    {result ? (
                        <div className="animate-slideUp space-y-6">
                            {/* Premium Header Card */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mt-16 -mr-16"></div>

                                <div className="relative flex flex-col sm:flex-row justify-between items-start gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-emerald-100 text-emerald-700 p-1 rounded-md">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Verified Match</span>
                                        </div>
                                        <h3 className="text-4xl font-black text-slate-900 leading-none">{result.brandName}</h3>
                                        <p className="text-slate-500 font-bold text-lg">{result.genericName}</p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center min-w-[120px]">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confidence</div>
                                        <div className="text-3xl font-black text-blue-600">{result.confidence}%</div>
                                        <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex overflow-x-auto scroller-hide no-scrollbar">
                                {[
                                    { id: 'uses', label: 'Uses', icon: Clipboard },
                                    { id: 'sideEffects', label: 'Side Effects', icon: Activity },
                                    { id: 'warnings', label: 'Warnings', icon: AlertCircle },
                                    { id: 'details', label: 'Details', icon: FileText }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === tab.id
                                                ? "bg-slate-900 text-white shadow-lg"
                                                : "text-slate-400 hover:text-slate-600"
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[300px]">
                                <div className="animate-fadeIn">
                                    {activeTab === 'uses' && (
                                        <div className="space-y-4">
                                            <h4 className="text-xl font-bold text-slate-900">Therapeutic Indications</h4>
                                            <ul className="space-y-3">
                                                {result.uses.map((point, i) => (
                                                    <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                                        <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <Check size={12} />
                                                        </div>
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {activeTab === 'sideEffects' && (
                                        <div className="space-y-4">
                                            <h4 className="text-xl font-bold text-slate-900">Possible Side Effects</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {result.sideEffects.map((point, i) => (
                                                    <div key={i} className="p-4 bg-red-50/50 rounded-2xl flex gap-3 text-red-800 text-sm border border-red-50">
                                                        <AlertCircle size={18} className="text-red-400 mt-0.5" />
                                                        <p className="font-medium">{point}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'warnings' && (
                                        <div className="space-y-4">
                                            <h4 className="text-xl font-bold text-slate-900">Drug Interactions</h4>
                                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                                <div className="flex gap-4 items-start">
                                                    <AlertTriangle size={32} className="text-amber-500 flex-shrink-0" />
                                                    <p className="text-amber-900 text-sm italic font-medium leading-loose">
                                                        {result.warnings || "No specific major drug interactions recorded for this medication. Consult your physician."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'details' && (
                                        <div className="space-y-6">
                                            <h4 className="text-xl font-bold text-slate-900">General Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-xl">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Manufacturer</span>
                                                    <span className="text-sm font-bold text-slate-700">{result.manufacturer}</span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price Ref</span>
                                                    <span className="text-sm font-bold text-slate-700">{result.price}</span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Strength</span>
                                                    <span className="text-sm font-bold text-slate-700">{result.strength}</span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                                                    <span className="text-sm font-bold text-emerald-600">Active Stock</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => { setImage(null); setPreview(null); setResult(null); setError(null); }}
                                    className="flex-1 bg-white border-2 border-slate-200 text-slate-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
                                >
                                    <RefreshCw size={20} />
                                    Scan Another
                                </button>
                                <button
                                    onClick={handleAddToReminder}
                                    className="flex-[2] bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={24} />
                                    Add to Reminders
                                    <ArrowRight size={20} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    ) : !preview ? (
                        <div className="bg-white rounded-[2rem] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-60">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <Zap size={24} className="text-slate-400" />
                            </div>
                            <h4 className="font-bold text-slate-900 italic">No Medical History Scanned Yet</h4>
                            <p className="text-slate-400 text-sm mt-1">Upload a photo to see the AI analysis results here.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                                <Loader2 size={64} className="text-blue-500 animate-spin relative" />
                            </div>
                            <h4 className="mt-8 font-black text-2xl text-slate-900">Analyzing Components</h4>
                            <p className="text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
                                Our AI is matching your image against our 200k+ global medicine database...
                            </p>
                        </div>
                    )}

                    {/* Medical Disclaimer */}
                    <div className="p-6 bg-slate-100/50 rounded-2xl border border-slate-200 flex gap-4 items-start">
                        <ShieldCheck size={20} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-wider">
                            <span className="font-black text-slate-700">Medical Disclaimer:</span> AI-generated results are for informational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                        </p>
                    </div>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                capture="environment"
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scanner-line {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scanner-line {
                    position: absolute;
                    animation: scanner-line 3s linear infinite;
                    z-index: 20;
                }
                .scroller-hide::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default MedicineScanner;
