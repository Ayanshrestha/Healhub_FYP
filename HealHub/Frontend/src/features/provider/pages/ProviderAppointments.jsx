import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    User,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    Home,
    Video,
    MapPin,
    Eye,
    UserMinus
} from "lucide-react";
import * as providerService from "../services/providerService";

const ProviderAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalResults: 0, limit: 10 });

    useEffect(() => {
        fetchAppointments();
    }, [filter, currentPage, searchTerm]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                status: filter === "all" ? undefined : filter,
                search: searchTerm || undefined
            };
            const res = await providerService.getAppointments(params);
            // Safe check for res and appointments array
            if (res && Array.isArray(res.appointments)) {
                // Filter out any null/undefined items immediately
                const validAppointments = res.appointments.filter(item => item && typeof item === 'object');
                setAppointments(validAppointments);
                if (res.pagination) {
                    setPagination(res.pagination);
                }
            } else {
                console.warn("Invalid appointments data received:", res);
                setAppointments([]);
            }
        } catch (err) {
            console.error("Fetch appointments error:", err);
            setMessage({ type: 'error', text: 'Failed to load appointments' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await providerService.updateAppointmentStatus(id, newStatus);
            setMessage({ type: 'success', text: `Appointment ${newStatus.toLowerCase()} successfully!` });
            fetchAppointments();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
        } finally {
            // Nothing needed in finally here as saving is handled by fetch
        }
    };

    const handleViewDetails = (appointmentId) => {
        navigate(`/provider/appointments/${appointmentId}`);
    };

    // Use all fetched appointments (filtering is now server-side)
    const displayedAppointments = appointments;

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'Approved': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
            case 'Rejected': return 'bg-rose-100 text-rose-600 border-rose-200';
            case 'No-Show': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'Rescheduled': return 'bg-purple-100 text-purple-600 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
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

    if (loading && appointments.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Practice Schedule</h1>
                    <p className="text-gray-500 font-bold mt-1">Manage and track all patient consultations.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search patient name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on search
                            }}
                            className="pl-12 pr-6 py-2.5 bg-white border-2 border-gray-50 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all w-64 uppercase tracking-wider"
                        />
                    </div>
                </div>
            </div>

            {/* Action Message */}
            {message && (
                <div className={`p-4 rounded-2xl font-bold flex items-center space-x-2 animate-fadeIn ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Filters / Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {['all', 'Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected', 'No-Show'].map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setFilter(t);
                            setCurrentPage(1);
                        }}
                        className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${filter === t
                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                            : 'bg-white border-2 border-gray-50 text-gray-400 hover:border-teal-100 hover:text-teal-600'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[40vh] flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Patient Details</th>
                                <th className="px-8 py-5">Date & Time</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedAppointments.length > 0 ? displayedAppointments.map((appt) => (
                                <tr
                                    key={appt?._id}
                                    className="border-b border-gray-50/50 hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-teal-50">
                                                {String(appt.patientId?.fullName || "P").charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-black text-gray-900 block">{appt?.patientId?.fullName || "Jane Doe"}</span>
                                                <div className="flex items-center space-x-2 mt-0.5">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Identity</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-[10px] text-teal-500 font-bold uppercase tracking-tighter">ID: {String(appt.patientId?._id || "").slice(-6)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2 text-gray-900 font-black text-sm">
                                                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                                                <span>{safeFormatDate(appt?.appointmentDate)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-400 font-bold text-xs">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{appt?.appointmentTime}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-wider ${appt?.appointmentType === 'HOME_VISIT'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : appt?.appointmentType === 'VIRTUAL'
                                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                : 'bg-teal-50 text-teal-600 border-teal-100'
                                            }`}>
                                            {appt?.appointmentType === 'HOME_VISIT' ? <Home className="w-3 h-3" /> : (appt?.appointmentType === 'VIRTUAL' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />)}
                                            <span>{String(appt?.appointmentType || "").replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest text-center ${getStatusStyles(appt?.status)}`}>
                                                {appt?.status}
                                            </span>
                                            {appt?.paymentStatus === 'Paid' && (
                                                <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-tighter text-center shadow-sm">
                                                    PAID
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {appt?.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt?._id, 'Approved')}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                                    >
                                                        Approve Appointment
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewDetails(appt?._id)}
                                                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm border border-blue-100"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt?._id, 'Rejected')}
                                                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-sm border border-red-100"
                                                        title="Reject Appointment"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {appt?.status === 'Approved' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt?._id, 'Completed')}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                                    >
                                                        Mark Completed
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt?._id, 'No-Show')}
                                                        className="p-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-900 hover:text-white transition-all cursor-pointer shadow-sm border border-gray-200"
                                                        title="Mark No-Show"
                                                    >
                                                        <UserMinus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt?._id, 'Cancelled')}
                                                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-sm border border-red-100"
                                                        title="Cancel Appointment"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleViewDetails(appt?._id)}
                                                className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm border border-blue-100"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer border border-slate-100">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto">
                                                <Calendar className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900">No appointments found</h3>
                                            <p className="text-gray-400 font-bold text-sm italic">Adjust your filters or search term to widen the look-up.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="mt-auto p-8 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 italic font-primary tracking-wide">
                        Showing {appointments.length} of {pagination.totalResults} record(s)
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`p-2.5 border-2 rounded-xl transition-all ${currentPage === 1
                                ? 'border-gray-50 text-gray-200 cursor-not-allowed'
                                : 'border-gray-50 text-gray-500 hover:border-teal-100 hover:text-teal-600 cursor-pointer'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 border-2 rounded-xl text-xs font-black transition-all cursor-pointer ${currentPage === i + 1
                                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-200'
                                        : 'border-gray-50 text-gray-400 hover:border-teal-100 hover:text-teal-600'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                            disabled={currentPage === pagination.totalPages}
                            className={`p-2.5 border-2 rounded-xl transition-all ${currentPage === pagination.totalPages
                                ? 'border-gray-50 text-gray-200 cursor-not-allowed'
                                : 'border-gray-50 text-gray-500 hover:border-teal-100 hover:text-teal-600 cursor-pointer'
                                }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal removed - navigating to page instead */}
        </div>
    );
};

export default ProviderAppointments;
