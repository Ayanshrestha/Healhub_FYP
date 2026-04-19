import { useState, useEffect } from "react";
import {
    Search,
    MessageCircle,
    ChevronRight,
    Calendar,
    Clock,
    User,
    ShieldCheck,
    Loader2,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import patientService from "../services/patientService";

import { getAssetUrl } from "../../../services/api";

const PatientConversations = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState({ doctors: [], clinics: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeView, setActiveView] = useState("doctors"); // doctors or clinics

    useEffect(() => {
        const fetchChats = async () => {
            try {
                // We use upcoming and past appointments to find all providers the patient has interacted with
                const [upcoming, past] = await Promise.all([
                    patientService.getUpcomingAppointments(),
                    patientService.getPastAppointments()
                ]);
                const all = [...(upcoming || []), ...(past || [])];

                // Unique Doctors
                const doctorConversations = [];
                const seenDoctors = new Set();
                all.forEach(app => {
                    if (app.providerId && !seenDoctors.has(app.providerId._id)) {
                        seenDoctors.add(app.providerId._id);
                        doctorConversations.push(app);
                    }
                });

                // Unique Clinics
                const clinicConversations = [];
                const seenClinics = new Set();
                all.forEach(app => {
                    if (app.clinicId && !seenClinics.has(app.clinicId._id)) {
                        seenClinics.add(app.clinicId._id);
                        clinicConversations.push(app);
                    }
                });

                setAppointments({ doctors: doctorConversations, clinics: clinicConversations });
            } catch (error) {
                console.error("Fetch conversations error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const filtered = (activeView === "doctors" ? appointments.doctors : appointments.clinics || []).filter(app => {
        if (activeView === "doctors") return app.providerId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        return app.clinicId?.clinicName?.toLowerCase().includes(searchTerm.toLowerCase());
    });

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
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Active Consultations</h2>
                    <p className="text-slate-500 font-medium mt-1">Connect with your doctors and clinics in real-time</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="bg-slate-50 p-1 rounded-2xl flex border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setActiveView("doctors")}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === "doctors" ? "bg-white text-teal-600 shadow-md shadow-teal-500/10" : "text-slate-400 opacity-60 hover:opacity-100"}`}
                        >
                            Doctors
                        </button>
                        <button
                            onClick={() => setActiveView("clinics")}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === "clinics" ? "bg-white text-teal-600 shadow-md shadow-teal-500/10" : "text-slate-400 opacity-60 hover:opacity-100"}`}
                        >
                            Clinics
                        </button>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={activeView === "doctors" ? "Search doctors..." : "Search clinics..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.length > 0 ? (
                    filtered.map((app) => (
                        <div
                            key={app._id}
                            onClick={() => navigate(`/patient/messages/${app._id}${activeView === 'clinics' ? '?context=CLINICAL' : ''}`)}
                            className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-teal-100 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                        <img
                                            src={getAssetUrl(activeView === 'doctors' ? app.providerId?.profilePhoto : app.clinicId?.clinicLogo || app.clinicId?.logo)}
                                            className="w-full h-full object-cover"
                                            alt=""
                                            onError={(e) => { 
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeView === 'doctors' ? app.providerId?.fullName : app.clinicId?.clinicName)}&background=${activeView === 'doctors' ? '0D9488' : '0F172A'}&color=fff`; 
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">
                                                {activeView === 'doctors' ? app.providerId?.fullName : app.clinicId?.clinicName}
                                            </h4>
                                            <ShieldCheck className="w-4 h-4 text-teal-500 fill-teal-500/10" />
                                        </div>
                                        <p className="text-teal-600 font-bold text-sm mb-4">
                                            {activeView === 'doctors' ? app.clinicId?.clinicName : (app.providerId?.fullName ? `Last consultant: ${app.providerId.fullName}` : 'Clinic Admin')}
                                        </p>

                                        <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl w-fit">
                                            <div className="flex items-center border-r border-slate-200 pr-4">
                                                <Calendar className="w-3.5 h-3.5 mr-2 text-teal-500" />
                                                {new Date(app.appointmentDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <MessageCircle className="w-3.5 h-3.5 mr-2 text-teal-500" />
                                                {activeView === 'doctors' ? 'Direct Chat' : 'Clinical Support'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg group-hover:bg-teal-600">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No conversation records found</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Conversations begin automatically once you schedule an appointment with a clinic or doctor.</p>
                        <button
                            onClick={() => navigate("/patient/clinics")}
                            className="mt-8 px-10 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg shadow-teal-100"
                        >
                            Find a Clinic
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientConversations;
