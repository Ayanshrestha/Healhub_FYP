import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Calendar,
    Bell,
    Scan,
    Home,
    Clock,
    MapPin,
    ChevronRight,
    ArrowUpRight,
    Search,
    Stethoscope,
    Activity,
    AlertCircle,
    Pill,
    MessageCircle
} from "lucide-react";
import patientService from "../services/patientService";

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [viewDate, setViewDate] = useState(new Date());
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        activeReminders: 0,
        recentScans: 0,
        homeVisits: 0
    });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [upcoming, rems, reports, past] = await Promise.all([
                    patientService.getUpcomingAppointments(),
                    patientService.getReminders(),
                    patientService.getReports(),
                    patientService.getPastAppointments()
                ]);

                const appointmentsList = Array.isArray(upcoming) ? upcoming : [];
                const pastList = Array.isArray(past) ? past : [];
                const remindersList = Array.isArray(rems) ? rems : [];
                const reportsList = Array.isArray(reports) ? reports : [];

                setUpcomingAppointments(appointmentsList);
                setReminders(remindersList.slice(0, 3));

                // Track unique consultations for "Messages" count
                const all = [...appointmentsList, ...pastList];
                const uniqueConversations = [];
                const seenPairs = new Set();
                all.forEach(app => {
                    const key = `${app.doctorId?._id}-${app.clinicId?._id}`;
                    if (app.doctorId && app.clinicId && !seenPairs.has(key)) {
                        seenPairs.add(key);
                        uniqueConversations.push(app);
                    }
                });
                setAppointments(uniqueConversations);

                setStats({
                    upcomingAppointments: appointmentsList.length,
                    activeReminders: remindersList.filter(r => r?.status === "Active").length,
                    recentScans: reportsList.length,
                    homeVisits: 0
                });
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calendar Helper Functions
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const totalDays = daysInMonth(year, month);
    const startGap = firstDayOfMonth(year, month);
    const today = new Date();

    const handlePrevMonth = () => setViewDate(new Date(year, month - 1));
    const handleNextMonth = () => setViewDate(new Date(year, month + 1));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Upcoming visits", value: stats.upcomingAppointments, icon: Calendar, color: "teal", detail: (stats.upcomingAppointments > 0 && upcomingAppointments[0]?.appointmentDate) ? `Next: ${new Date(upcomingAppointments[0].appointmentDate).toLocaleDateString()}` : "No visits scheduled", path: "/patient/appointments" },
                    { label: "Secure Messages", value: appointments.length, icon: MessageCircle, color: "sky", detail: "Clinical consulting", path: "/patient/messages" },
                    { label: "Medication active", value: stats.activeReminders, icon: Bell, color: "emerald", detail: `${stats.activeReminders} items in schedule`, path: "/patient/medicines" },
                    { label: "Diagnostic scans", value: stats.recentScans, icon: Activity, color: "indigo", detail: "Electronic records", path: "/patient/reports" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        onClick={() => stat.path && navigate(stat.path)}
                        className={`group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 card-hover relative overflow-hidden ${stat.path ? 'cursor-pointer' : ''}`}
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                                <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                            </div>
                            <span className={`text-4xl font-black text-slate-800`}>{stat.value}</span>
                        </div>
                        <div className="mt-6 relative z-10">
                            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</h3>
                            <p className="text-slate-400 text-xs mt-1 font-medium">{stat.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Calendar & Appointments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Calendar */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Health Calendar</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{monthName} {year}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-3 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all hover:scale-110 active:scale-95"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-3 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all hover:scale-110 active:scale-95"
                                >
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <div key={day} className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {/* Start Gap */}
                            {Array.from({ length: startGap }).map((_, i) => (
                                <div key={`gap-${i}`} className="aspect-square"></div>
                            ))}

                            {/* Actual Days */}
                            {Array.from({ length: totalDays }).map((_, i) => {
                                const day = i + 1;
                                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                const hasAppointment = upcomingAppointments.some(a => {
                                    const d = new Date(a.appointmentDate);
                                    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
                                });

                                return (
                                    <div key={day} className={`
                                        aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all cursor-pointer relative group
                                        ${isToday
                                            ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-100 scale-105"
                                            : "text-slate-600 hover:bg-teal-50 hover:text-teal-600 border border-transparent hover:border-teal-100"}
                                    `}>
                                        <span>{day}</span>
                                        {hasAppointment && (
                                            <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isToday ? "bg-white" : "bg-teal-500"}`}></span>
                                        )}

                                        {/* Hover Tooltip/Shadow effect */}
                                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming List */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Upcoming Visits</h3>
                            <button className="text-teal-600 hover:text-emerald-700 font-bold text-sm flex items-center space-x-1 group">
                                <span>See all history</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.slice(0, 3).map((app) => (
                                    <div key={app._id} className="group flex items-center p-5 rounded-[1.5rem] border border-slate-50 hover:border-teal-100 hover:bg-teal-50/30 transition-all duration-300">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm mr-5 group-hover:scale-110 transition-transform">
                                            <img src={app.doctorId?.profilePhoto || "https://ui-avatars.com/api/?name=Doctor&background=0D9488&color=fff"} className="w-full h-full object-cover" alt="Doctor" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-slate-800 italic uppercase leading-none">{app.doctorId?.fullName || "General Practitioner"}</h4>
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${app.status === 'Approved' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600'}`}>
                                                    {app.status}
                                                </span>
                                                {app.status === 'Approved' && (
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${app.paymentStatus === 'Paid' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-rose-500 text-white shadow-sm'}`}>
                                                        {app.paymentStatus === 'Paid' ? 'PAID' : 'UNPAID'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">{app.clinicId?.clinicName}</p>
                                            <div className="flex items-center space-x-4 mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                <div className="flex items-center bg-white px-2 py-1 rounded-md border border-slate-50">
                                                    <Clock className="w-3 h-3 mr-1 text-teal-500" />
                                                    <span>{app.timeSlot}</span>
                                                </div>
                                                <div className="flex items-center bg-white px-2 py-1 rounded-md border border-slate-50">
                                                    <Calendar className="w-3 h-3 mr-1 text-teal-500" />
                                                    <span>{new Date(app.appointmentDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/patient/appointments/${app._id}`)}
                                            className="hidden group-hover:flex items-center justify-center w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full text-teal-600 transition-all hover:bg-teal-600 hover:text-white"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                <Stethoscope className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No upcoming appointments</p>
                                <button className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-100 hover:scale-105 transition-transform">
                                    Book a Visit
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Reminders & Alerts */}
                <div className="space-y-8 h-full">
                    {/* Medication Reminders */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] p-8 border border-white/10 shadow-xl text-white">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Medications</h3>
                                <p className="text-slate-400 text-xs font-medium mt-1">Today's Schedule</p>
                            </div>
                            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Search className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {reminders.length > 0 ? (
                            <div className="space-y-4">
                                {reminders.map((rem, i) => (
                                    <div key={rem._id} className="relative group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{rem.medicineName}</h4>
                                                <p className="text-slate-400 text-xs mt-1 font-medium italic">{rem.dosage} • {rem.frequency}</p>
                                            </div>
                                            <div className="bg-emerald-500/10 px-2 py-1 rounded-lg text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                {rem.times?.[0]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-teal-500/20">
                                    Manage Schedule
                                </button>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/5">
                                <Pill className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                <p className="text-white/40 font-bold text-xs uppercase">No active reminders</p>
                                <button className="mt-3 text-emerald-400 text-xs font-black uppercase tracking-widest hover:text-emerald-300">
                                    + Add Medication
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Health Tip / AI Suggestion */}
                    <div className="bg-emerald-500 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <AlertCircle className="w-8 h-8 text-white/40 mb-4" />
                            <h3 className="text-xl font-black mb-2 tracking-tight">Smart Insight</h3>
                            <p className="text-white/80 text-sm font-medium leading-relaxed">
                                Staying hydrated can improve concentration and energy by up to 30%. Remember to drink 8 glasses of water today!
                            </p>
                            <button className="mt-6 flex items-center space-x-2 text-white font-black text-xs uppercase tracking-widest">
                                <span>Learn more</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
