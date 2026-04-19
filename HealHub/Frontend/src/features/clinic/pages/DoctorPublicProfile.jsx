import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Briefcase,
    Award,
    Clock,
    ShieldCheck,
    DollarSign,
    MapPin,
    ArrowLeft,
    Loader2,
    CheckCircle,
    Phone,
    Calendar,
    FileText
} from "lucide-react";
import clinicService from "../services/clinicService";
import { getAssetUrl } from "../../../services/api";

const DoctorPublicProfile = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const data = await clinicService.getDoctorDetails(doctorId);
                setDoctor(data);
            } catch (err) {
                console.error("Error fetching doctor:", err);
                setError(err.response?.data?.message || "Failed to load doctor profile");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
                <p className="text-gray-500 font-bold">Retrieving practitioner profile...</p>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-12 text-center max-w-2xl mx-auto mt-12 animate-fadeIn">
                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-6">
                    <User className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Profile Unavailable</h2>
                <p className="text-red-600 font-semibold mb-8">{error || "Doctor record not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-gray-200 cursor-pointer"
                >
                    Return to Staff Directory
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fadeIn">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-teal-600 font-bold transition-all group"
                >
                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center group-hover:border-teal-100 group-hover:bg-teal-50 transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                    </div>
                    <span>Back to Directory</span>
                </button>
                <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Affiliated Staff</span>
                </div>
            </div>

            {/* Profile Banner */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative">
                <div className="h-48 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 relative">
                    <div className="absolute -bottom-16 left-12 flex items-end space-x-8">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-white p-1.5 shadow-2xl relative">
                            <div className="w-full h-full rounded-[2.2rem] bg-teal-50 flex items-center justify-center overflow-hidden border-4 border-white">
                                {doctor.profilePhoto ? (
                                    <img
                                        src={getAssetUrl(doctor.profilePhoto)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName || "Doctor")}&background=F1F5F9&color=0D9488`;
                                            e.target.onerror = null;
                                        }}
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-teal-200" />
                                )}
                            </div>
                        </div>
                        <div className="pb-6">
                            <h1 className="text-4xl font-black text-gray-900 drop-shadow-lg tracking-tight">
                                {doctor.fullName}
                            </h1>
                            <div className="flex items-center space-x-3 mt-2">
                                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                    {doctor.specialization}
                                </span>
                                <span className="bg-emerald-400/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-emerald-50 uppercase tracking-widest border border-emerald-400/20">
                                    {doctor.verificationStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-24 px-12 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column - Contact & Fast Facts */}
                        <div className="space-y-8">
                            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Verification</p>
                                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-inner mb-4">
                                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                </div>
                                <p className="text-sm font-bold text-gray-700 leading-relaxed px-4">
                                    Verified practitioner with active clinical governance as of {new Date(doctor.verifiedAt || doctor.createdAt).toLocaleDateString()}.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 transition-all">
                                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                                        <p className="font-bold text-gray-900">{doctor.userId?.email || doctor.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 transition-all">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Direct Contact</p>
                                        <p className="font-bold text-gray-900">{doctor.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle/Main Column - Experience & Bio */}
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-4 flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Practitioner Biography
                                </h3>
                                <p className="text-lg text-gray-600 font-medium leading-relaxed font-primary">
                                    {doctor.bio || "No professional biography provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qualifications</p>
                                            <p className="font-black text-gray-900">{doctor.qualification || "Verified Degree Holder"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clinical Seniority</p>
                                            <p className="font-black text-gray-900">{doctor.experienceYears || "0"} Years of Practice</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Licensure Number</p>
                                            <p className="font-black text-emerald-700 font-mono tracking-wider">{doctor.nmcLicense || doctor.licenseNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Consultation Fee</p>
                                            <p className="font-black text-gray-900">Rs. {doctor.consultationFee || "0"} Per Session</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                                    <Clock className="w-5 h-5 text-teal-600 mr-2" />
                                    Weekly Professional Availability
                                </h3>
                                <div className="grid grid-cols-7 gap-3">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <div key={day} className="flex flex-col items-center">
                                            <div className={`w-full p-4 rounded-2xl border-2 flex flex-col items-center space-y-2 ${doctor.availability?.[day]?.isClosed ? 'border-gray-50 bg-gray-50 opacity-40' : 'border-teal-50 bg-white shadow-sm'}`}>
                                                <span className="text-[10px] font-black uppercase text-gray-400">{day}</span>
                                                <div className={`w-2.5 h-2.5 rounded-full ${doctor.availability?.[day]?.isClosed ? 'bg-gray-300' : 'bg-emerald-500 shadow-sm shadow-emerald-200'}`}></div>
                                            </div>
                                            {!doctor.availability?.[day]?.isClosed && (
                                                <span className="text-[9px] font-black text-teal-700 mt-2 uppercase tracking-tighter">
                                                    {doctor.availability?.[day]?.open || "Available"}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorPublicProfile;
