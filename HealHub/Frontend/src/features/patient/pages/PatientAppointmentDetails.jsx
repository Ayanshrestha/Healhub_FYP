import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
    ArrowLeft,
    FileText,
    ExternalLink,
    MessageCircle,
    CreditCard,
    ShieldCheck,
    Stethoscope
} from "lucide-react";
import patientService from "../services/patientService";

const PatientAppointmentDetails = () => {
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
            const data = await patientService.getAppointmentDetails(id);
            setAppointment(data);
        } catch (err) {
            console.error("Error fetching details:", err);
            setMessage({ type: 'error', text: 'Failed to load appointment details' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            setActionLoading(true);
            await patientService.cancelAppointment(id);
            setMessage({ type: 'success', text: 'Appointment cancelled successfully' });
            fetchDetails();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to cancel appointment' });
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-100 max-w-2xl mx-auto mt-10">
                <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Appointment not found</h3>
                <button onClick={() => navigate("/patient/appointments")} className="mt-6 text-teal-600 font-black uppercase text-xs tracking-widest hover:underline">Go Back</button>
            </div>
        );
    }

    const isAwaitingPayment = appointment.status === "Approved" && appointment.paymentStatus === "Pending";

    return (
        <div className="max-w-5xl mx-auto pb-12 space-y-8 animate-fadeIn">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate("/patient/appointments")}
                        className="p-3.5 rounded-2xl border border-slate-100 bg-white text-slate-400 hover:text-teal-600 transition-all shadow-sm group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">Visit Details</h1>
                        <p className="text-slate-500 font-bold text-sm">Managing your session with Dr. {appointment.providerId?.fullName}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/patient/messages/${appointment._id}`)}
                        className="flex items-center space-x-2 bg-teal-50 text-teal-600 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat Doctor</span>
                    </button>
                    {isAwaitingPayment && (
                        <button
                            onClick={() => navigate(`/patient/checkout/${appointment._id}`)}
                            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 animate-pulse"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Finish Payment</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Message Toast */}
            {message && (
                <div className={`p-4 rounded-2xl font-bold flex items-center space-x-2 animate-fadeIn shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Detailed Info */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Status Banner */}
                    <div className={`rounded-3xl p-8 border ${appointment.status === 'Approved' ? 'bg-blue-50 border-blue-100' :
                        appointment.status === 'Cancelled' ? 'bg-rose-50 border-rose-100' :
                            'bg-amber-50 border-amber-100'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${appointment.status === 'Approved' ? 'text-blue-600' :
                                    appointment.status === 'Cancelled' ? 'text-rose-600' :
                                        'text-amber-600'
                                    }`}>Current Progress</span>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase leading-none">{appointment.status}</h3>
                                    {(appointment.status === 'Approved' || appointment.status === 'Completed') && (
                                        <div className={`inline-flex items-center w-fit px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-lg ${appointment.paymentStatus === 'Paid' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}>
                                            {appointment.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${appointment.status === 'Approved' ? 'bg-white text-blue-600 border-blue-200' :
                                appointment.status === 'Cancelled' ? 'bg-white text-rose-600 border-rose-200' :
                                    'bg-white text-amber-600 border-amber-200'
                                }`}>
                                {appointment.status === 'Approved' ? <CheckCircle className="w-8 h-8" /> :
                                    appointment.status === 'Cancelled' ? <XCircle className="w-8 h-8" /> :
                                        <Clock className="w-8 h-8 animate-pulse" />}
                            </div>
                        </div>
                    </div>

                    {/* Specialist Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-900/5">
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-8">Medical Specialist</h3>
                        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl relative group">
                                <img src={appointment.providerId?.profilePhoto || `https://ui-avatars.com/api/?name=${appointment.providerId?.fullName}&background=0D9488&color=fff`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">{appointment.providerId?.fullName}</h4>
                                <p className="text-teal-600 font-bold text-sm mb-3 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    {appointment.providerId?.specialization}
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Exp: {appointment.providerId?.experienceYears || "5+"} yrs
                                    </span>
                                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Fee: Rs.{appointment.providerId?.consultationFee || 500}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Date & Time</p>
                                <p className="text-slate-800 font-black text-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-teal-500" />
                                    {safeFormatDate(appointment.appointmentDate)}
                                </p>
                                <p className="text-slate-400 font-bold text-sm">{appointment.timeSlot}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Session Type</p>
                                <p className="text-slate-800 font-black text-lg flex items-center gap-2">
                                    {appointment.consultationType === 'Video' ? <Video className="w-5 h-5 text-purple-500" /> : <Home className="w-5 h-5 text-sky-500" />}
                                    {appointment.consultationType}
                                </p>
                                <p className="text-slate-400 font-bold text-sm">{appointment.appointmentType === 'HOME_VISIT' ? 'At your location' : 'Online / Clinic'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Clinic Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl transition-all group-hover:bg-teal-500/20"></div>
                        <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-6 relative z-10">Care Location</h3>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-2xl font-black tracking-tight italic uppercase mb-2">{appointment.clinicId?.clinicName}</h4>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                    <MapPin className="w-4 h-4 text-teal-500" />
                                    {appointment.clinicId?.address}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl">
                                <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">Clinic Center</p>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs truncate">
                                    {appointment.clinicId?.description || "Providing premium healthcare services for your well-being."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Documents */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Payment Info */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-900/5 space-y-6">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Financial Summary</h3>

                        <div className="space-y-4 pb-6 border-b border-slate-50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Payment Method</span>
                                <span className="text-slate-800 font-black italic">{appointment.paymentOption}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold">Status</span>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${appointment.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {appointment.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="text-slate-800 font-black text-xl italic uppercase tracking-tighter">Total Fee</span>
                            <span className="text-2xl font-black text-teal-600">Rs. {appointment.providerId?.consultationFee || 500}</span>
                        </div>

                        {isAwaitingPayment ? (
                            <button
                                onClick={() => navigate(`/patient/checkout/${appointment._id}`)}
                                className="w-full bg-slate-900 group-hover:bg-emerald-600 text-white p-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Complete Payment</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Booking Fully Secured</span>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Interaction Log</h3>
                        <div className="space-y-6">
                            {(appointment.timeline || []).map((step, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full mt-1 ${step.completed ? 'bg-teal-500 shadow-lg shadow-teal-100' : 'bg-slate-200'}`}></div>
                                        {idx !== appointment.timeline.length - 1 && (
                                            <div className={`w-0.5 h-full my-1 ${step.completed ? 'bg-teal-100' : 'bg-slate-100'}`}></div>
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <p className={`text-[11px] font-black uppercase tracking-widest ${step.completed ? 'text-slate-800' : 'text-slate-300'}`}>
                                            {step.status}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400">
                                            {step.time ? new Date(step.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cancellation Section */}
                    {!['Cancelled', 'Completed'].includes(appointment.status) && (
                        <div className="pt-4 px-4 text-center">
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="text-rose-400 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest hover:underline transition-all disabled:opacity-50"
                            >
                                {actionLoading ? 'Processing...' : 'Cancel Appointment'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointmentDetails;

const ChevronRight = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
);
