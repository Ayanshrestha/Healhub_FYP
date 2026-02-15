import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
    Home,
    Video,
    MapPin,
    ArrowLeft
} from "lucide-react";
import * as providerService from "../services/providerService";

const ProviderAppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const data = await providerService.getAppointmentDetails(id);
            setAppointment(data);
        } catch (err) {
            console.error("Error fetching details:", err);
            setMessage({ type: 'error', text: 'Failed to load appointment details' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setActionLoading(true);
            await providerService.updateAppointmentStatus(id, newStatus);
            setMessage({ type: 'success', text: `Appointment ${newStatus.toLowerCase()} successfully!` });

            // Refresh details to show new status
            await fetchDetails();

            // Optional: Redirect back after brief delay or let user decide
            // setTimeout(() => navigate("/provider/appointments"), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
        } finally {
            setActionLoading(false);
        }
    };

    const safeFormatDate = (dateString) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return 'Error';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-8 text-center text-gray-500 font-bold">
                Appointment not found or failed to load.
                <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-teal-600 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 space-y-8">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/provider/appointments")}
                    className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Appointment Details</h1>
                    <p className="text-gray-500 font-bold text-sm">View and manage patient consultation</p>
                </div>
            </div>

            {/* Message Toast */}
            {message && (
                <div className={`p-4 rounded-2xl font-bold flex items-center space-x-2 animate-fadeIn ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-8">
                {/* Patient Profile */}
                <div className="bg-slate-50 rounded-3xl p-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Patient Information</h3>
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 text-xl font-black">
                            {String(appointment.patientId?.fullName || "P").charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-gray-900">{appointment.patientId?.fullName}</h4>
                            <p className="text-gray-500 font-bold text-sm">{appointment.patientId?.email}</p>
                            <p className="text-gray-500 font-bold text-sm">{appointment.patientId?.phone}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                                    Age: {appointment.patientId?.age || "N/A"}
                                </span>
                                <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                                    Gender: {appointment.patientId?.gender || "N/A"}
                                </span>
                                <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                                    Blood: {appointment.patientId?.bloodGroup || "N/A"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{appointment.patientId?.address}</p>
                        </div>
                    </div>
                </div>

                {/* Appointment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-teal-50/50 p-5 rounded-3xl border border-teal-100">
                        <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Schedule</h4>
                        <div className="flex items-center gap-2 text-gray-900 font-bold">
                            <Calendar className="w-4 h-4 text-teal-500" />
                            <span>{safeFormatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-bold mt-1">
                            <Clock className="w-4 h-4 text-teal-500" />
                            <span>{appointment.timeSlot}</span>
                        </div>
                    </div>
                    <div className="bg-purple-50/50 p-5 rounded-3xl border border-purple-100">
                        <h4 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2">Type & Status</h4>
                        <div className="font-black text-gray-900 flex items-center gap-2">
                            {appointment.appointmentType === 'HOME_VISIT' ? <Home className="w-4 h-4 text-purple-500" /> : <Video className="w-4 h-4 text-purple-500" />}
                            <span>{String(appointment.appointmentType || "").replace('_', ' ')}</span>
                        </div>
                        <span className="inline-block mt-2 px-3 py-1 bg-white rounded-full text-xs font-black uppercase tracking-wider text-purple-600 border border-purple-100">
                            {appointment.status}
                        </span>
                    </div>
                </div>

                {/* Medical Reason */}
                <div className="bg-white border-2 border-slate-50 p-6 rounded-3xl">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Reason for Visit</h3>
                    <p className="text-gray-700 font-medium leading-relaxed">
                        {appointment.reason || "No reason provided."}
                    </p>
                </div>

                {/* Notes */}
                {appointment.notes && (
                    <div className="bg-yellow-50/50 border border-yellow-100 p-6 rounded-3xl">
                        <h3 className="text-sm font-black text-yellow-600 uppercase tracking-widest mb-2">Clinical Notes</h3>
                        <p className="text-gray-700 font-medium leading-relaxed">
                            {appointment.notes}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                    {appointment.status === 'Pending' && !actionLoading && (
                        <>
                            <button
                                onClick={() => handleStatusUpdate('Cancelled')}
                                className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Approved')}
                                className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Approve</span>
                            </button>
                        </>
                    )}
                    {appointment.status === 'Approved' && !actionLoading && (
                        <button
                            onClick={() => handleStatusUpdate('Completed')}
                            className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-900 text-white hover:bg-black transition-all shadow-lg shadow-gray-200"
                        >
                            Mark Completed
                        </button>
                    )}
                    {actionLoading && (
                        <div className="px-6 py-3 rounded-2xl font-bold text-xs text-gray-400 bg-gray-50 border border-gray-100 cursor-not-allowed">
                            Updating...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderAppointmentDetails;
