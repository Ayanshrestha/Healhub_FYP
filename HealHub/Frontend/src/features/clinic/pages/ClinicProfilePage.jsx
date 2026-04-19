import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import clinicService from "../services/clinicService";
import { Loader2, Save, User, Building, MapPin, Phone, Mail, Shield, Clock, Plus, X, Globe, FileText, Download, Camera, Image as ImageIcon } from "lucide-react";
import { BASE_URL, getAssetUrl } from "../../../services/api";

const ClinicProfilePage = () => {
    const [profile, setProfile] = useState({
        clinicName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        licenseNumber: "",
        description: "",
        operatingHours: {},
        facilities: [],
        status: "",
        documents: [],
        clinicImage: "",
        clinicLogo: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [newFacility, setNewFacility] = useState("");
    const [imageErrors, setImageErrors] = useState({ logo: false, hero: false });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        // Immediate pre-fill from local cache if available
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (cachedUser) {
            setProfile(prev => ({
                ...prev,
                clinicName: cachedUser.clinicName || prev.clinicName,
                ownerName: cachedUser.ownerName || prev.ownerName,
                email: cachedUser.email || prev.email,
                phone: cachedUser.phone || prev.phone,
                address: cachedUser.address || prev.address,
                licenseNumber: cachedUser.licenseNumber || prev.licenseNumber
            }));
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await clinicService.getProfile();
                console.log("[ClinicProfilePage] Fetched Data:", data);

                // Ensure operating hours are initialized for all days
                const hours = {};
                days.forEach(day => {
                    hours[day] = data.operatingHours?.[day] || { open: "09:00", close: "17:00", isClosed: false };
                });

                setProfile(prev => {
                    const merged = { ...prev };
                    Object.keys(data).forEach(key => {
                        // Only overwrite if we have meaningful data
                        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
                            merged[key] = data[key];
                        }
                    });

                    // Maintain structure for special fields
                    merged.operatingHours = hours;
                    merged.facilities = data.facilities || prev.facilities;
                    merged.status = data.status || prev.status;
                    return merged;
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                const errorMsg = error.response?.data?.message || "Failed to load clinic identity.";
                setMessage({ type: "error", text: errorMsg });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleHourChange = (day, field, value) => {
        setProfile({
            ...profile,
            operatingHours: {
                ...profile.operatingHours,
                [day]: { ...profile.operatingHours[day], [field]: value }
            }
        });
    };

    const addFacility = () => {
        if (newFacility.trim() && !profile.facilities.includes(newFacility.trim())) {
            setProfile({ ...profile, facilities: [...profile.facilities, newFacility.trim()] });
            setNewFacility("");
        }
    };

    const removeFacility = (index) => {
        const updated = profile.facilities.filter((_, i) => i !== index);
        setProfile({ ...profile, facilities: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await clinicService.updateProfile(profile);
            setMessage({ type: "success", text: "Operational profile updated successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "Integration sync failed. Please check your data." });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type, file);

        try {
            setSaving(true);
            const response = await clinicService.uploadClinicImages(formData);
            
            const updatedClinic = response.clinic;
            setProfile(prev => ({
                ...prev,
                clinicImage: updatedClinic.clinicImage,
                clinicLogo: updatedClinic.clinicLogo
            }));

            // Sync with localStorage for Navbar/Sidebar immediate update
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { 
                ...currentUser, 
                profilePhoto: type === 'clinicLogo' ? updatedClinic.clinicLogo : currentUser.profilePhoto,
                clinicLogo: updatedClinic.clinicLogo,
                clinicImage: updatedClinic.clinicImage
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            // Reset error states if upload succeeded
            if (type === 'clinicLogo') setImageErrors(prev => ({ ...prev, logo: false }));
            if (type === 'clinicImage') setImageErrors(prev => ({ ...prev, hero: false }));

            setMessage({ type: "success", text: `${type === 'clinicImage' ? 'Hero image' : 'Logo'} updated successfully!` });
            
            // Trigger a re-render for parts of the app listening to storage (global sync)
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Upload error:", error);
            setMessage({ type: "error", text: "Failed to upload image. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ClinicLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
                </div>
            </ClinicLayout>
        );
    }

    const isVerified = profile.status === "ACTIVE" || profile.status === "APPROVED" || profile.status === "APPROVED_UNPAID";

    return (
        <ClinicLayout>
            <div className="max-w-5xl mx-auto space-y-12 pb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isVerified ? "bg-teal-500 text-white shadow-lg shadow-teal-200" : "bg-amber-500 text-white shadow-lg shadow-amber-200"}`}>
                                {isVerified ? "Verified Identity" : "Pending Verification"}
                            </span>
                            {isVerified && <Shield className="w-4 h-4 text-teal-600 fill-teal-100" />}
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Clinic Operational Profile</h1>
                        <p className="text-gray-500 font-bold mt-1 text-lg">Managing the digital presence of {profile.clinicName}.</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-5 rounded-3xl font-bold flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-100" : "bg-red-50 text-red-700 border-2 border-red-100"}`}>
                        <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                        <span>{message.text}</span>
                    </div>
                )}

                {profile._dataIntegrity === "INCOMPLETE" && (
                    <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-[32px] flex items-start space-x-4 animate-pulse">
                        <Shield className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                        <div>
                            <h4 className="text-amber-800 font-black uppercase text-xs tracking-widest mb-1">Data Integrity Noticement</h4>
                            <p className="text-amber-700 text-sm font-bold">{profile._warning || "Some registration data is missing from your profile. Please update the editable fields below."}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 font-primary">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Core Identity */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Building className="w-48 h-48" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                    <Building className="w-6 h-6" />
                                </div>
                                <span>Core Identity</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Registered Entity Name</label>
                                    <input
                                        type="text"
                                        value={profile.clinicName || ""}
                                        readOnly
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] text-sm font-black text-gray-400 cursor-not-allowed"
                                        placeholder="Loading name..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">License Identifier</label>
                                    <input
                                        type="text"
                                        value={profile.licenseNumber || ""}
                                        readOnly
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] text-sm font-black text-gray-400 cursor-not-allowed"
                                        placeholder="Loading license..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Official Email</label>
                                    <input
                                        type="text"
                                        value={profile.email || ""}
                                        readOnly
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] text-sm font-black text-gray-400 cursor-not-allowed"
                                        placeholder="Loading email..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] ml-1">Authorized Owner</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={profile.ownerName || ""}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-[20px] text-sm font-bold text-gray-800 focus:border-teal-500 focus:bg-white transition-all outline-none shadow-sm"
                                        placeholder="Enter owner name"
                                        required
                                    />
                                </div>
                                <div className="space-y-3 col-span-2">
                                    <label className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] ml-1">Facility Description</label>
                                    <textarea
                                        name="description"
                                        value={profile.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Tell patients about your clinic, specializations, and history..."
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-[24px] text-sm font-bold text-gray-800 focus:border-teal-500 focus:bg-white transition-all outline-none shadow-sm resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Visual Identity */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                                    <Camera className="w-6 h-6" />
                                </div>
                                <span>Visual Identity</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Clinic Logo */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] ml-1">Clinic Logo</label>
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                            {profile.clinicLogo && !imageErrors.logo ? (
                                                <img
                                                    src={getAssetUrl(profile.clinicLogo)}
                                                    alt="Logo"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setImageErrors(prev => ({ ...prev, logo: true }))}
                                                />
                                            ) : null}
                                            {(imageErrors.logo || !profile.clinicLogo) && (
                                                <Building className="w-10 h-10 text-gray-300" />
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                                            <Camera className="w-8 h-8 text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "clinicLogo")} />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Square aspect ratio recommended (PNG/JPG)</p>
                                </div>

                                {/* Hero Banner */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] ml-1">Hero Banner Image</label>
                                    <div className="relative group">
                                        <div className="aspect-video w-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                            {profile.clinicImage && !imageErrors.hero ? (
                                                <img
                                                    src={getAssetUrl(profile.clinicImage)}
                                                    alt="Hero"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setImageErrors(prev => ({ ...prev, hero: true }))}
                                                />
                                            ) : null}
                                            {(imageErrors.hero || !profile.clinicImage) && (
                                                <ImageIcon className="w-10 h-10 text-gray-300" />
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                                            <Camera className="w-8 h-8 text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "clinicImage")} />
                                        </label>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Wide aspect ratio (16:9) recommended</p>
                                </div>
                            </div>
                        </section>

                        {/* Availability Matrix */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <span>Availability Matrix</span>
                            </h3>

                            <div className="space-y-4">
                                {days.map(day => (
                                    <div key={day} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-[24px] gap-4">
                                        <div className="flex items-center space-x-4 min-w-[120px]">
                                            <input
                                                type="checkbox"
                                                checked={profile.operatingHours[day]?.isClosed}
                                                onChange={(e) => handleHourChange(day, "isClosed", e.target.checked)}
                                                className="w-5 h-5 rounded-lg border-gray-300 text-teal-600 focus:ring-teal-500"
                                            />
                                            <span className="font-black text-gray-800 uppercase tracking-widest text-xs">{day}</span>
                                        </div>

                                        <div className={`flex items-center space-x-4 transition-opacity ${profile.operatingHours[day]?.isClosed ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                                            <input
                                                type="time"
                                                value={profile.operatingHours[day]?.open}
                                                onChange={(e) => handleHourChange(day, "open", e.target.value)}
                                                className="bg-white px-4 py-2 rounded-xl border border-gray-200 font-bold text-sm outline-none"
                                            />
                                            <span className="text-gray-400 font-black">to</span>
                                            <input
                                                type="time"
                                                value={profile.operatingHours[day]?.close}
                                                onChange={(e) => handleHourChange(day, "close", e.target.value)}
                                                className="bg-white px-4 py-2 rounded-xl border border-gray-200 font-bold text-sm outline-none"
                                            />
                                        </div>

                                        <div className="md:w-32 text-right">
                                            {profile.operatingHours[day]?.isClosed ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Closed</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-12">
                        {/* Contact Meta */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-3">
                                <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span>Access Meta</span>
                            </h3>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Primary Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone || ""}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-gray-800 focus:border-teal-500 focus:bg-white transition-all outline-none"
                                            placeholder="Loading phone..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Geospatial Coordinates</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-teal-600" />
                                        <textarea
                                            name="address"
                                            value={profile.address || ""}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-gray-800 focus:border-teal-500 focus:bg-white transition-all outline-none resize-none"
                                            placeholder="Loading address..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>


                        {/* Facilities Tagging */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center space-x-3">
                                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span>Infrastructure Tags</span>
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {profile.facilities.map((fac, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-xl border border-gray-100 font-bold text-xs group transition-all hover:border-red-200">
                                        <span>{fac}</span>
                                        <button type="button" onClick={() => removeFacility(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {profile.facilities.length === 0 && <p className="text-gray-400 italic text-xs">No tags added yet...</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="e.g. ICU, Pharmacy..."
                                    value={newFacility}
                                    onChange={(e) => setNewFacility(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-teal-500"
                                />
                                <button
                                    type="button"
                                    onClick={addFacility}
                                    className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </section>

                        {/* Compliance Vault */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center space-x-3">
                                <div className="p-2 bg-red-50 rounded-xl text-red-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span>Compliance Vault</span>
                            </h3>
                            <div className="space-y-4">
                                {profile.documents && profile.documents.length > 0 ? profile.documents.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-[20px] transition-all hover:bg-teal-50 group">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-800 tracking-tight">{doc.name}</span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase">{doc.type}</span>
                                            </div>
                                        </div>
                                        <button type="button" className="p-2 text-gray-400 hover:text-teal-600 transition">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-[24px] text-center">
                                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No verified docs</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full flex items-center justify-center space-x-3 bg-teal-600 text-white px-10 py-6 rounded-[32px] font-black text-lg hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-teal-100 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                            <span>Synchronize Profile</span>
                        </button>
                    </div>
                </form>
            </div>
        </ClinicLayout>
    );
};

export default ClinicProfilePage;
