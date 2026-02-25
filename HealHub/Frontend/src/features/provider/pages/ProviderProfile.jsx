import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Briefcase,
    Award,
    Clock,
    ShieldCheck,
    DollarSign,
    FileText,
    MapPin,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle,
    Camera,
    CalendarDays,
    Plus,
    X
} from "lucide-react";
import * as providerService from "../services/providerService";

const ProviderProfile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);

    const handleScheduleChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: {
                    ...prev.availability?.[day],
                    [field]: value
                }
            }
        }));
    };

    const handleBlockedDateAdd = (date) => {
        if (!date) return;
        const currentDates = formData.blockedDates || [];
        if (currentDates.some(d => new Date(d).toDateString() === new Date(date).toDateString())) {
            setMessage({ type: 'error', text: 'Date already blocked' });
            return;
        }
        setFormData(prev => ({
            ...prev,
            blockedDates: [...currentDates, date]
        }));
    };

    const handleBlockedDateRemove = (index) => {
        const currentDates = [...(formData.blockedDates || [])];
        currentDates.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            blockedDates: currentDates
        }));
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await providerService.getProviderProfile();
                setProfile(res.profile);
                setFormData(res.profile);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setMessage({ type: 'error', text: 'Failed to load profile data' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            const res = await providerService.updateProviderProfile(formData);
            setProfile(res.profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const fileInputRef = React.useRef(null);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setSaving(true);
            const res = await providerService.uploadProfilePhoto(file);
            setProfile(prev => ({ ...prev, profilePhoto: res.profilePhoto }));
            setFormData(prev => ({ ...prev, profilePhoto: res.profilePhoto }));
            setMessage({ type: 'success', text: 'Photo updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header / Banner */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
                <div className="h-40 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 relative">
                    <div className="absolute -bottom-16 left-12 flex items-end space-x-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-2xl">
                                <div className="w-full h-full rounded-[1.8rem] bg-teal-50 flex items-center justify-center overflow-hidden border-4 border-white">
                                    {profile?.profilePhoto ? (
                                        <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-teal-300" />
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="pb-4">
                            <h1 className="text-3xl font-black text-gray-900 drop-shadow-md">
                                {profile?.fullName}
                            </h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-wider">
                                    {profile?.userId?.role}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${profile?.status === 'ACTIVE' ? 'bg-emerald-400 text-emerald-900' : 'bg-amber-400 text-amber-900'
                                    }`}>
                                    {profile?.status?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-20 px-12 pb-8 flex justify-between items-center">
                    <div className="flex space-x-8 text-gray-500 font-bold text-sm">
                        <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Verified Professional</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-teal-500" />
                            <span>{profile?.address || "Location not set"}</span>
                        </div>
                    </div>
                    {message && (
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 animate-bounce ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{message.text}</span>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Account Info (Read-Only) */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-2">
                            <ShieldCheck className="w-5 h-5 text-teal-600" />
                            <span>Identity Verification</span>
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Practice Role</label>
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Briefcase className="w-5 h-5 text-gray-300" />
                                    <span className="font-bold text-gray-500 capitalize">{profile?.userId?.role}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Primary Email</label>
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Mail className="w-5 h-5 text-gray-300" />
                                    <span className="font-bold text-gray-500">{profile?.userId?.email}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Medical License No.</label>
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Award className="w-5 h-5 text-gray-300" />
                                    <span className="font-bold text-gray-500">{profile?.nmcLicense || profile?.licenseNumber}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 italic">
                                <p className="text-[11px] text-teal-700 font-bold leading-relaxed">
                                    Identity fields are locked after verification. Contact support for changes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-teal-600" />
                            <span>Quick Actions</span>
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group hover:bg-white hover:shadow-md transition-all">
                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-teal-400" />
                                    <span className="font-bold text-gray-700">Home Visits</span>
                                </div>
                                <input
                                    type="checkbox"
                                    name="homeVisitEnabled"
                                    checked={formData.homeVisitEnabled}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Main Column: Editable Profile Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center justify-between">
                            <span>Professional Profile</span>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-black transition disabled:opacity-50 shadow-lg shadow-gray-200"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Professional Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., Cardiology, Clinical Psychology"
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Highest Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification || ""}
                                    onChange={handleChange}
                                    placeholder="e.g., MBBS, MD, PhD"
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Consultation Fee (Rs.)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee || ""}
                                        onChange={handleChange}
                                        placeholder="500"
                                        className="w-full bg-slate-50 border border-slate-100 p-4 pl-10 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears || ""}
                                    onChange={handleChange}
                                    placeholder="5"
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Clinical Bio / Summary</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio || ""}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Brief description of your expertise and clinical approach..."
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                                ></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 pl-1">Work/Clinic Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
                                    <textarea
                                        name="address"
                                        value={formData.address || formData.workAddress || ""}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Enter your clinical practice address..."
                                        className="w-full bg-slate-50 border border-slate-100 p-4 pl-10 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-teal-600" />
                                <span>Availability Schedule</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                                className="text-teal-600 font-bold text-xs uppercase tracking-widest hover:underline"
                            >
                                {isEditingSchedule ? "Cancel Edit" : "Edit Hours"}
                            </button>
                        </div>

                        {isEditingSchedule ? (
                            <div className="space-y-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <div key={day} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
                                        <div className="flex items-center space-x-4 min-w-[100px]">
                                            <input
                                                type="checkbox"
                                                checked={formData.availability?.[day]?.isClosed}
                                                onChange={(e) => handleScheduleChange(day, "isClosed", e.target.checked)}
                                                className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                            />
                                            <span className="font-black text-gray-800 uppercase tracking-widest text-xs">{day}</span>
                                        </div>

                                        <div className={`flex items-center space-x-2 transition-opacity ${formData.availability?.[day]?.isClosed ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                                            <input
                                                type="time"
                                                value={formData.availability?.[day]?.open || "09:00"}
                                                onChange={(e) => handleScheduleChange(day, "open", e.target.value)}
                                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-teal-500"
                                            />
                                            <span className="text-gray-400 font-black text-[10px]">TO</span>
                                            <input
                                                type="time"
                                                value={formData.availability?.[day]?.close || "17:00"}
                                                onChange={(e) => handleScheduleChange(day, "close", e.target.value)}
                                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-teal-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSubmit} // Save using main handler
                                        className="bg-teal-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-teal-700 transition"
                                    >
                                        Save Schedule
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-7 gap-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <div key={day} className="flex flex-col items-center">
                                        <div className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${formData.availability?.[day]?.isClosed ? 'border-gray-50 bg-gray-50/50 grayscale' : 'border-teal-100 bg-teal-50/30'
                                            }`}>
                                            <span className="text-[10px] font-black uppercase text-gray-400">{day}</span>
                                            <div className={`w-3 h-3 rounded-full ${formData.availability?.[day]?.isClosed ? 'bg-gray-200' : 'bg-teal-500 shadow-sm shadow-teal-200'}`}></div>
                                        </div>
                                        {!formData.availability?.[day]?.isClosed && (
                                            <span className="text-[10px] font-black text-teal-700 mt-2">
                                                {formData.availability?.[day]?.open || "09:00"}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
                    <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-2">
                        <CalendarDays className="w-5 h-5 text-rose-500" />
                        <span>Blocked Specific Dates</span>
                    </h3>

                    <div className="space-y-6">
                        <p className="text-sm font-bold text-gray-400 italic">
                            Block specific days for leave, holidays, or emergencies. These will override your weekly schedule.
                        </p>

                        <div className="flex gap-4">
                            <input
                                type="date"
                                id="new-blocked-date"
                                className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const input = document.getElementById('new-blocked-date');
                                    handleBlockedDateAdd(input.value);
                                    input.value = '';
                                }}
                                className="bg-rose-50 text-rose-600 p-4 rounded-2xl font-black hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {formData.blockedDates?.length > 0 ? formData.blockedDates.map((date, idx) => (
                                <div key={idx} className="flex items-center space-x-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-xl border border-rose-100 group/date transition-all hover:pr-2">
                                    <span className="font-black text-xs uppercase tracking-widest">
                                        {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleBlockedDateRemove(idx)}
                                        className="p-1 hover:bg-rose-200 rounded-lg transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )) : (
                                <div className="w-full py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">No dates blocked yet</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProviderProfile;
