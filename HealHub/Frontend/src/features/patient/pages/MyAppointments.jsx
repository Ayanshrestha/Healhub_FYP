import { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    AlertCircle,
    Search,
    Filter,
    XCircle,
    CheckCircle,
    MessageCircle,
    MoreVertical,
    CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../../components/layout/Navbar";
import patientService from "../services/patientService";

const MyAppointments = () => {
    const navigate = useNavigate();
    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const [upcomingData, pastData] = await Promise.all([
                patientService.getUpcomingAppointments(),
                patientService.getPastAppointments()
            ]);
            setUpcoming(Array.isArray(upcomingData) ? upcomingData : []);
            setPast(Array.isArray(pastData) ? pastData : []);
        } catch (error) {
            console.error("Fetch appointments error:", error);
            setUpcoming([]);
            setPast([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await patientService.cancelAppointment(id);
                fetchAppointments(); // Refresh
                toast.success("Appointment cancelled successfully");
            } catch (error) {
                toast.error("Cancellation failed.");
            }
        }
    };

    const handlePayNow = (id) => {
        navigate(`/patient/checkout/${id}`);
    };

    const AppointmentCard = ({ app, isPast = false }) => {
        const isAwaitingPayment = app.status === "Approved" && app.paymentStatus === "Pending";
        const isAwaitingApproval = app.status === "Pending";

        return (
            <div className="group bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-teal-100 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                            <img src={app.doctorId?.profilePhoto || `https://ui-avatars.com/api/?name=${app.doctorId?.fullName}&background=0D9488&color=fff`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">{app.doctorId?.fullName}</h4>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${app.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                                    app.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                                        app.status === "Approved" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                            "bg-amber-50 text-amber-600"
                                    }`}>
                                    {app.status}
                                </span>
                                {(app.status === "Approved" || app.status === "COMPLETED") && (
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${app.paymentStatus === "Paid" ? "bg-emerald-500 text-white shadow-sm" : "bg-rose-500 text-white shadow-sm"
                                        }`}>
                                        {app.paymentStatus === "Paid" ? "PAID" : "UNPAID"}
                                    </span>
                                )}
                            </div>
                            <p className="text-teal-600 font-bold text-sm mb-3">{app.clinicId?.clinicName}</p>

                            <div className="flex flex-wrap items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl">
                                    <Calendar className="w-3.5 h-3.5 mr-2 text-teal-500" />
                                    {new Date(app.appointmentDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-teal-500" />
                                    {app.timeSlot}
                                </div>
                                <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl">
                                    <MapPin className="w-3.5 h-3.5 mr-2 text-teal-500" />
                                    {app.consultationType}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAwaitingPayment && (
                            <button
                                onClick={() => handlePayNow(app._id)}
                                className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 group/btn"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Now</span>
                            </button>
                        )}
                        {isAwaitingApproval && (
                            <div className="flex items-center space-x-2 bg-amber-50 text-amber-600 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-amber-100 italic">
                                <Clock className="w-4 h-4" />
                                <span>Awaiting Approval</span>
                            </div>
                        )}
                        {!isPast && app.status !== "CANCELLED" && (
                            <button
                                onClick={() => handleCancel(app._id)}
                                className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm group/btn"
                                title="Cancel Appointment"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => navigate(`/patient/messages/${app._id}`)}
                            className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl hover:bg-teal-600 hover:text-white transition-all shadow-sm group/btn"
                            title="Message Doctor"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate(`/patient/appointments/${app._id}`)}
                            className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-slate-200 group/btn"
                        >
                            <span>Details</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Manage Visits</h2>
                    <p className="text-slate-500 font-medium mt-1">Track your healthcare journey and upcoming scans</p>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "upcoming" ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "past" ? "bg-teal-600 text-white shadow-lg shadow-teal-100" : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Past Visits
                    </button>
                </div>
            </header>

            <div className="space-y-6">
                {activeTab === "upcoming" ? (
                    upcoming.length > 0 ? (
                        upcoming.map(app => <AppointmentCard key={app._id} app={app} />)
                    ) : (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-100">
                            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No upcoming appointments</h3>
                            <button onClick={() => navigate("/patient/clinics")} className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">Book Now</button>
                        </div>
                    )
                ) : (
                    past.length > 0 ? (
                        past.map(app => <AppointmentCard key={app._id} app={app} isPast={true} />)
                    ) : (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-100">
                            <CheckCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No past treatment history</h3>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
