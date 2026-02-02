import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ShieldCheck,
    Stethoscope,
    ChevronRight,
    ArrowLeft,
    Heart,
    Users
} from "lucide-react";
import patientService from "../services/patientService";

const ClinicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const data = await patientService.getClinicDetails(id);
                setClinic(data);
            } catch (error) {
                console.error("Fetch clinic details error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClinicData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!clinic) return (
        <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-400">Clinic not found</h3>
            <button onClick={() => navigate("/patient/clinics")} className="mt-4 text-teal-600 font-bold">Back to discovery</button>
        </div>
    );

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate("/patient/clinics")}
                className="flex items-center text-gray-400 hover:text-teal-600 font-bold text-[10px] uppercase tracking-widest transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Discovery
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-48 bg-teal-50"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-50">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="w-24 h-24 bg-white rounded-xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                                <ShieldCheck className="w-12 h-12 text-teal-100" />
                            </div>
                            <div className="mb-1">
                                <h1 className="text-2xl font-bold text-gray-800">{clinic.clinicName}</h1>
                                <div className="flex items-center text-gray-400 font-medium text-xs mt-1">
                                    <MapPin className="w-3 h-3 mr-1 text-teal-500" />
                                    {clinic.address}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="text-center px-4 border-r border-gray-200">
                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Doctors</p>
                                <p className="text-lg font-bold text-gray-800">{clinic.totalDoctors || 0}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Rating</p>
                                <p className="text-lg font-bold text-gray-800">4.9</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                        <div className="lg:col-span-1 space-y-6">
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {clinic.about || "Quality healthcare services provided by certified professionals."}
                                </p>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <Phone className="w-4 h-4 text-teal-500 mr-3" />
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-300 uppercase">Phone</p>
                                        <p className="text-gray-700 text-xs font-bold">{clinic.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <Mail className="w-4 h-4 text-teal-500 mr-3" />
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-300 uppercase">Email</p>
                                        <p className="text-gray-700 text-xs font-bold">{clinic.email}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Departments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {clinic.departments?.map((dept, i) => (
                                    <div
                                        key={i}
                                        onClick={() => navigate(`/patient/book/${clinic._id}`, { state: { department: dept.name } })}
                                        className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-teal-200 transition-all cursor-pointer border-l-4 border-l-teal-500"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                                                <Stethoscope className="w-5 h-5 text-teal-600" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[8px] font-bold text-gray-400 uppercase">Doctors</div>
                                                <span className="text-sm font-bold text-gray-700">{dept.doctorCount}</span>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-sm">{dept.name}</h4>
                                        <div className="mt-3 flex items-center text-teal-500 text-[10px] font-bold uppercase tracking-wider">
                                            <span>Book Visit</span>
                                            <ChevronRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicProfile;
