import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    ChevronRight,
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    User,
    ShieldCheck,
    CreditCard,
    MapPin,
    Loader2,
    CheckCircle2
} from "lucide-react";
import patientService from "../services/patientService";
import ConfirmModal from "../../../components/common/ConfirmModal";

const PatientCheckout = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await patientService.getAppointmentDetails(appointmentId);
                setAppointment(data);
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load appointment details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [appointmentId]);

    const handleDigitalPayment = async () => {
        setProcessing(true);
        try {
            const result = await patientService.reinitiatePayment(appointmentId);
            if (result.data?.payment_url) {
                window.location.href = result.data.payment_url;
            } else {
                toast.error("Payment initiation failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.response?.data?.message || "Failed to initiate payment.");
        } finally {
            setProcessing(false);
        }
    };

    const handleClinicPayment = () => {
        setShowConfirmModal(true);
    };

    const confirmClinicPayment = async () => {
        setShowConfirmModal(false);
        setProcessing(true);
        try {
            await patientService.switchToClinic(appointmentId);
            toast.success("Payment method switched to 'Pay at Clinic'");
            navigate("/patient/appointments");
        } catch (error) {
            console.error("Switch error:", error);
            toast.error("Failed to switch payment method.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
        );
    }

    if (!appointment) return <div>Appointment not found.</div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 animate-fadeIn">
            {/* Header */}
            <header className="mb-12">
                <button
                    onClick={() => navigate("/patient/appointments")}
                    className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-teal-600 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Appointments
                </button>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">Final Confirmation</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Summary Card */}
                <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-900/5 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Booking Summary</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Specialist</p>
                                <p className="text-slate-800 font-black text-lg">{appointment.providerId?.fullName}</p>
                                <p className="text-teal-500 text-xs font-bold">{appointment.providerId?.specialization}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                                <CalendarIcon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Date & Time</p>
                                <p className="text-slate-800 font-black text-lg">
                                    {new Date(appointment.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="text-emerald-600 text-xs font-bold">{appointment.timeSlot}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shadow-sm border border-sky-100">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Location</p>
                                <p className="text-slate-800 font-black text-lg truncate max-w-[200px]">{appointment.clinicId?.clinicName}</p>
                                <p className="text-sky-600 text-xs font-bold truncate max-w-[200px]">{appointment.clinicId?.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 flex justify-between items-center">
                        <div>
                            <span className="text-slate-400 font-bold block mb-1">Consultation Fee</span>
                            <div className="flex items-center text-teal-600 bg-teal-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Secure Checkout
                            </div>
                        </div>
                        <span className="text-4xl font-black text-slate-800 italic">Rs. {appointment.providerId?.consultationFee || 500}</span>
                    </div>
                </div>

                {/* Right: Payment Methods */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Payment Method</h3>
                        <p className="text-slate-400 text-sm font-medium">Select how you'd like to pay for your session</p>
                    </div>

                    <button
                        onClick={handleClinicPayment}
                        disabled={processing}
                        className="w-full group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-teal-500 hover:bg-teal-50/10 transition-all flex items-center justify-between text-left disabled:opacity-50"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-800 tracking-tight">Pay at Clinic</h4>
                                <p className="text-slate-400 text-sm font-medium">Verify and pay directly at desk</p>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={handleDigitalPayment}
                        disabled={processing}
                        className="w-full group p-8 bg-slate-900 border border-slate-800 rounded-[3rem] hover:bg-emerald-600 transition-all flex items-center justify-between text-left shadow-2xl shadow-slate-900/10 disabled:opacity-50"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-emerald-600 transition-all shadow-lg">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white tracking-tight">Digital Payment</h4>
                                <p className="text-white/40 text-sm font-medium">Pay securely via Khalti / eSewa</p>
                            </div>
                        </div>
                        {processing ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                            <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        )}
                    </button>

                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mt-10">
                        <div className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                                Your appointment is already <span className="text-emerald-600 font-black italic">Approved</span>. Selecting a payment method will finalize your booking and secure the time slot.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={showConfirmModal}
                title="Pay at Clinic"
                message="Are you sure you want to switch to 'Pay at Clinic'? Your slot will stay approved, and you can settle the payment when you arrive at the facility."
                confirmText="Yes, Switch"
                confirmVariant="success"
                onConfirm={confirmClinicPayment}
                onCancel={() => setShowConfirmModal(false)}
            />
        </div>
    );
};

export default PatientCheckout;
