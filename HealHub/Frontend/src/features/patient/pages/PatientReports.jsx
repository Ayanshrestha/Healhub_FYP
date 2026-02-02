import { useState, useEffect } from "react";
import {
    FileText,
    Download,
    Calendar,
    User,
    Search,
    Filter,
    ChevronRight,
    Loader2,
    ShieldCheck,
    Stethoscope,
    Activity
} from "lucide-react";
import patientService from "../services/patientService";

const PatientReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const result = await patientService.getReports();
            setReports(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Fetch reports error:", error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight text-right md:text-left">Medical Records</h2>
                    <p className="text-slate-500 font-medium mt-1">Aggregated reports, prescriptions, and diagnostics</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                        <input type="text" placeholder="Search documents..." className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl w-full md:w-64 shadow-sm outline-none font-medium" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, i) => (
                    <div key={i} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center space-x-5">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-teal-500 group-hover:rotate-6 transition-all border border-slate-100">
                                    <FileText className="w-7 h-7 text-slate-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase line-clamp-1">{report.originalName}</h3>
                                    <div className="flex items-center text-[10px] font-black text-teal-500 uppercase tracking-widest mt-1">
                                        <Activity className="w-3 h-3 mr-1" />
                                        Diagnostic Report
                                    </div>
                                </div>
                            </div>
                            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Provider</p>
                                <div className="flex items-center text-slate-700 font-bold text-sm">
                                    <Stethoscope className="w-3.5 h-3.5 mr-2 text-teal-500" />
                                    {report.providerName}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Clinic</p>
                                <p className="text-slate-700 font-bold text-sm truncate">{report.clinicName}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                                {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                            <span className="flex items-center text-emerald-500">
                                <ShieldCheck className="w-4 h-4 mr-1" />
                                Verified
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {reports.length === 0 && (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-100 shadow-sm animate-fadeIn">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                        <FileText className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-400 italic">No medical records found</h3>
                    <p className="text-slate-300 mt-2 font-medium">Your shared reports and prescriptions will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default PatientReports;
