import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import clinicService from "../services/clinicService";
import { Loader2, Lock, Bell, Shield, ChevronRight, Check, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPicker = ({ location, setLocation }) => {
    useMapEvents({
        click(e) {
            setLocation(e.latlng);
        },
    });

    return location ? <Marker position={location} /> : null;
};

const SettingsPage = () => {
    const [preferences, setPreferences] = useState({
        appointments: true,
        doctorRequests: true,
        subscriptionExpiry: true,
        adminMessages: true
    });
    const [location, setLocation] = useState(null);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const data = await clinicService.getProfile();
                if (data.notificationPreferences) {
                    setPreferences(data.notificationPreferences);
                }
                if (data.location) {
                    setLocation(data.location);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handlePreferenceToggle = async (key) => {
        const updated = { ...preferences, [key]: !preferences[key] };
        setPreferences(updated);
        try {
            await clinicService.updatePreferences(updated);
        } catch (error) {
            console.error("Failed to sync preferences:", error);
        }
    };

    const handleLocationSave = async () => {
        if (!location) return;
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await clinicService.updateProfile({ location });
            setMessage({ type: "success", text: "Clinic coordinates synchronized successfully." });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update location." });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }

        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await clinicService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: "success", text: "Security credentials updated successfully." });
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Password update failed." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <ClinicLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                </div>
            </ClinicLayout>
        );
    }

    return (
        <ClinicLayout>
            <div className="max-w-4xl mx-auto space-y-12 pb-24">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Configuration</h1>
                    <p className="text-gray-500 font-bold mt-1 text-lg">Managing security protocols and communication preferences.</p>
                </div>

                {message.text && (
                    <div className={`p-5 rounded-3xl font-bold flex items-center space-x-3 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-100" : "bg-red-50 text-red-700 border-2 border-red-100"}`}>
                        <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 font-primary">
                    <div className="md:col-span-3 space-y-12">
                        {/* Security Section */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span>Security Credentials</span>
                            </h3>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white transition-all outline-none font-bold"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white transition-all outline-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-red-500 focus:bg-white transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 mt-4"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Update Security Credentials"}
                                </button>
                            </form>
                        </section>

                        {/* Map Location Section */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <span>Clinic Coordinates</span>
                            </h3>

                            <div className="space-y-6">
                                <p className="text-gray-500 font-bold text-sm leading-relaxed">
                                    Drop a pin on the map to set your precise location. This will help patients find your facility using GPS navigation.
                                </p>

                                <div className="h-80 w-full rounded-2xl overflow-hidden border-2 border-gray-100 relative z-0">
                                    <MapContainer
                                        center={location || [27.7172, 85.3240]}
                                        zoom={13}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <MapPicker location={location} setLocation={setLocation} />
                                    </MapContainer>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Coordinates</p>
                                            <p className="text-sm font-black text-gray-800">
                                                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "No location pinned"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLocationSave}
                                        disabled={saving || !location}
                                        className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-black text-xs hover:bg-teal-700 transition shadow-lg shadow-teal-100 disabled:opacity-50"
                                    >
                                        {saving ? "Syncing..." : "Update Location"}
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-2 space-y-12">
                        {/* Notification Preferences */}
                        <section className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center space-x-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <span>Signal Logic</span>
                            </h3>

                            <div className="space-y-6">
                                {[
                                    { id: "appointments", label: "New Appointments", desc: "Real-time alerts for bookings." },
                                    { id: "doctorRequests", label: "Doctor Relations", desc: "Sync requests from staff." },
                                    { id: "subscriptionExpiry", label: "Bill Alerts", desc: "License and payment pings." },
                                    { id: "adminMessages", label: "System Core", desc: "Direct messages from admin." }
                                ].map((pref) => (
                                    <div key={pref.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group" onClick={() => handlePreferenceToggle(pref.id)}>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-gray-800 tracking-tight">{pref.label}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pref.desc}</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full transition-all relative ${preferences[pref.id] ? "bg-teal-500" : "bg-gray-200"}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences[pref.id] ? "left-7" : "left-1"}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Session Control */}
                        <section className="bg-amber-50 rounded-[40px] p-10 border border-amber-100">
                            <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center space-x-3">
                                <Lock className="w-5 h-5" />
                                <span>System Exit</span>
                            </h3>
                            <p className="text-xs font-bold text-amber-700 leading-relaxed mb-6">Terminate all active sessions to reset your digital footprint.</p>
                            <button className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black text-xs hover:bg-amber-700 transition">
                                Terminate All Sessions
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
};

export default SettingsPage;
