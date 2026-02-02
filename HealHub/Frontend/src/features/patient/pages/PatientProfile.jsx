import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Save,
    Edit3,
    X,
    Camera,
    ChevronRight,
    Loader2,
    ShieldCheck,
    Briefcase,
    Zap
} from "lucide-react";
import patientService from "../services/patientService";
import toast from "react-hot-toast";

const PatientProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await patientService.getProfile();
            setProfile(data);
            setFormData(data);
        } catch (error) {
            toast.error("Failed to load profile details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = await patientService.updateProfile(formData);
            setProfile(updated);
            setIsEditing(false);
            toast.success("Profile updated successfully! ✨");
            // Update local storage user if name changed
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...user, fullName: updated.fullName }));
        } catch (error) {
            toast.error("Fixed fields cannot be changed");
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("photo", file);

        const uploadToast = toast.loading("Uploading your new profile photo...");

        try {
            const response = await patientService.uploadProfilePhoto(formData);
            setProfile(prev => ({ ...prev, profilePhoto: response.profilePhoto }));

            // Sync with local storage for header avatar
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...user, profilePhoto: response.profilePhoto }));

            toast.success("Identity visual updated! 📸", { id: uploadToast });
        } catch (error) {
            toast.error("Upload failed. Please try again.", { id: uploadToast });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Synchronizing Health Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fadeIn">
            {/* Hero Header Section */}
            <div className="relative mb-12">
                {/* Cover Background */}
                <div className="relative h-64 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 opacity-90"></div>

                    {/* Artistic Orbs */}
                    <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-teal-500/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-5%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>

                    {/* Action Button - Top Right */}
                    <div className="absolute top-8 right-8 z-10">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl backdrop-blur-md border ${isEditing
                                ? "bg-rose-500 text-white border-rose-400 ring-4 ring-rose-500/20"
                                : "bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900"
                                }`}
                        >
                            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                            {isEditing ? "Cancel Edit" : "Modify Profile"}
                        </button>
                    </div>
                </div>

                {/* Profile Identity Area */}
                <div className="px-12 -mt-16 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        {/* Avatar Container */}
                        <div className="relative">
                            <input
                                type="file"
                                id="profilePhotoInput"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                            <div className="w-36 h-36 rounded-[2.5rem] bg-white p-1.5 shadow-2xl ring-1 ring-slate-100">
                                <div className="w-full h-full rounded-[2.2rem] bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-teal-600 font-black text-4xl border border-teal-100 overflow-hidden relative group">
                                    {profile?.profilePhoto ? (
                                        <img
                                            src={profile.profilePhoto}
                                            alt="Profile"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                        />
                                    ) : (
                                        profile?.fullName?.charAt(0) || "P"
                                    )}
                                    <label
                                        htmlFor="profilePhotoInput"
                                        className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
                                    >
                                        <Camera className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                                    </label>
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Text Identity */}
                        <div className="mb-2 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic">{profile?.fullName}</h1>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                    Verified Patient
                                </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                    Member since {new Date(profile?.createdAt).getFullYear()}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    ID: {profile?._id?.toString().slice(-6).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Stats / Quick Info */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-widest mb-8">Vital Indicators</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><User className="w-4 h-4" /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Verification</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">Confirmed</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-teal-100 text-teal-600 rounded-lg"><Briefcase className="w-4 h-4" /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Tier</span>
                                </div>
                                <span className="text-[10px] font-black text-teal-600 uppercase">Full Client</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
                        <h3 className="text-sm font-black text-teal-400 uppercase italic tracking-widest mb-4">Privacy Note</h3>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                            Your personal and medical information is encrypted using SHA-256 protocols. Only authorized clinics can view your primary records.
                        </p>
                    </div>
                </div>

                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-sm">
                        <form onSubmit={handleUpdate} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                        <User className="w-3 h-3 text-teal-500" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-black text-slate-700 disabled:opacity-60 uppercase italic text-sm"
                                        value={formData.fullName || ""}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                        <Mail className="w-3 h-3 text-teal-500" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        className="w-full px-8 py-5 bg-slate-100/50 border border-slate-100 rounded-3xl outline-none font-bold text-slate-400 italic text-sm cursor-not-allowed"
                                        value={formData.email || ""}
                                        placeholder="No email linked"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                        <Phone className="w-3 h-3 text-teal-500" /> Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-slate-700 disabled:opacity-60 text-sm"
                                        value={formData.phone || ""}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                        <User className="w-3 h-3 text-teal-500" /> Gender
                                    </label>
                                    <select
                                        disabled={!isEditing}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-slate-700 disabled:opacity-60 text-sm appearance-none"
                                        value={formData.gender || ""}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                        <Calendar className="w-3 h-3 text-teal-500" /> Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        disabled={!isEditing}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-slate-700 disabled:opacity-60 text-sm"
                                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                                        <MapPin className="w-3 h-3 text-teal-500" /> Residential Address
                                    </label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-slate-700 disabled:opacity-60 text-sm"
                                        value={formData.address || ""}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Enter your address"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-teal-600 transition-all shadow-2xl shadow-slate-200 group flex items-center justify-center gap-4"
                                >
                                    <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                    Synchronize Changes
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
