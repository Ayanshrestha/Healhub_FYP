import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Pill,
    Plus,
    Bell,
    Clock,
    Trash2,
    Calendar,
    Search,
    Loader2,
    CheckCircle2,
    XCircle,
    Info,
    ChevronDown,
    MapPin,
    AlertCircle,
    Scan
} from "lucide-react";
import patientService from "../services/patientService";
import toast from "react-hot-toast";

const MedicineReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate(); // I need to import this too if not there

    const [formData, setFormData] = useState({
        medicineName: "",
        dosage: "",
        frequency: "once",
        times: ["08:00 AM"],
        intakeInstructions: "After Food",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        notes: ""
    });

    const todayString = new Date().toISOString().split("T")[0];

    useEffect(() => {
        fetchReminders();

        // Handle pre-fill from Scanner
        if (location.state?.prefill) {
            setFormData(prev => ({
                ...prev,
                ...location.state.prefill
            }));
            setShowModal(true);
        }
    }, [location.state]);

    const fetchReminders = async () => {
        try {
            const result = await patientService.getReminders();
            setReminders(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Fetch reminders error:", error);
            setReminders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFrequencyChange = (freq) => {
        let newTimes = ["08:00 AM"];
        if (freq === "twice") newTimes = ["08:00 AM", "08:00 PM"];
        if (freq === "three times") newTimes = ["08:00 AM", "02:00 PM", "08:00 PM"];

        setFormData({ ...formData, frequency: freq, times: newTimes });
    };

    const handleTimeChange = (index, value) => {
        const [hours, minutes] = value.split(":");
        let h = parseInt(hours);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        const formattedTime = `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;

        const newTimes = [...formData.times];
        newTimes[index] = formattedTime;
        setFormData({ ...formData, times: newTimes });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await patientService.addReminder(formData);
            toast.success("Medicine reminder added!");
            setShowModal(false);
            fetchReminders();
            setFormData({
                medicineName: "",
                dosage: "",
                frequency: "once",
                times: ["08:00 AM"],
                intakeInstructions: "After Food",
                startDate: new Date().toISOString().split("T")[0],
                endDate: "",
                notes: ""
            });
        } catch (error) {
            toast.error("Failed to add reminder");
        }
    };

    const toggleDoseStatus = async (reminderId, time, currentStatus) => {
        const nextStatus = currentStatus === "Taken" ? "Pending" : "Taken";
        try {
            await patientService.markDoseStatus(reminderId, {
                date: todayString,
                time: time,
                status: nextStatus
            });
            toast.success(`Marked as ${nextStatus}`);
            fetchReminders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this medication?")) {
            try {
                await patientService.deleteReminder(id);
                toast.success("Reminder removed");
                fetchReminders();
            } catch (error) {
                toast.error("Failed to delete reminder");
            }
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
        <div className="space-y-6 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Medicine Reminders</h2>
                    <p className="text-gray-500 text-sm mt-1">Track and manage your daily medication schedule</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.href = '/patient/scan-medicine'}
                        className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-blue-100 transition-all border border-blue-100"
                    >
                        <Scan className="w-4 h-4" />
                        <span>Scan Medicine</span>
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-teal-600 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Medicine</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Today's Schedule</h3>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {reminders.length > 0 ? reminders.flatMap(rem =>
                                rem.times.map((time, idx) => {
                                    const log = rem.logs?.find(l => l.date === todayString && l.time === time);
                                    const status = log?.status || "Pending";

                                    return (
                                        <div key={`${rem._id}-${idx}`} className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-gray-100 ${status === "Taken" ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-400"}`}>
                                                <Clock className="w-5 h-5" />
                                            </div>

                                            <div className={`flex-1 p-4 rounded-xl border flex items-center justify-between ${status === "Taken" ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100 hover:border-teal-100"}`}>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`font-bold ${status === "Taken" ? "text-emerald-700 line-through opacity-60" : "text-gray-800"}`}>
                                                            {rem.medicineName}
                                                        </h4>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase border border-gray-100 px-1.5 py-0.5 rounded">
                                                            {time}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                                                        {rem.dosage} • {rem.intakeInstructions}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => toggleDoseStatus(rem._id, time, status)}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${status === "Taken" ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-300 hover:bg-teal-600 hover:text-white"}`}
                                                >
                                                    {status === "Taken" ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12">
                                    <Bell className="w-10 h-10 text-gray-100 mx-auto mb-3" />
                                    <p className="text-gray-400 font-bold text-[10px] uppercase">No doses scheduled for today</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Current Medications</h3>
                    {reminders.map(rem => (
                        <div key={rem._id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                                    <Pill className="w-5 h-5" />
                                </div>
                                <button onClick={() => handleDelete(rem._id)} className="p-2 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h4 className="font-bold text-gray-800">{rem.medicineName}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{rem.dosage} • {rem.frequency}</p>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase">Instruction</p>
                                    <p className="text-[10px] font-bold text-gray-700">{rem.intakeInstructions}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase">Remaining</p>
                                    <p className="text-[10px] font-bold text-gray-700">
                                        {rem.endDate ? `${Math.ceil((new Date(rem.endDate) - new Date()) / (1000 * 60 * 60 * 24))} Days` : "Ongoing"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Add Reminder</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Medicine Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        value={formData.medicineName}
                                        onChange={e => setFormData({ ...formData, medicineName: e.target.value })}
                                        placeholder="Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Dosage</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        value={formData.dosage}
                                        onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                                        placeholder="Dosage"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Frequency</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        value={formData.frequency}
                                        onChange={e => handleFrequencyChange(e.target.value)}
                                    >
                                        <option value="once">Once Daily</option>
                                        <option value="twice">Twice Daily</option>
                                        <option value="three times">Three Times</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Instruction</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        value={formData.intakeInstructions}
                                        onChange={e => setFormData({ ...formData, intakeInstructions: e.target.value })}
                                    >
                                        <option value="Before Food">Before Food</option>
                                        <option value="After Food">After Food</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase">Set Times</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {formData.times.map((t, i) => (
                                        <input
                                            key={i}
                                            required
                                            type="time"
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                            onChange={(e) => handleTimeChange(i, e.target.value)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Start Date</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-teal-500 outline-none"
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-teal-700 transition-all shadow-md mt-4">
                                Save Reminder
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineReminders;
