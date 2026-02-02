import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
    ChevronRight,
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    User,
    Phone,
    CheckCircle2,
    CreditCard,
    ShieldCheck,
    Stethoscope,
    Loader2,
    AlertCircle,
    MapPin
} from "lucide-react";
import patientService from "../services/patientService";

const BookingFlow = () => {
    const { clinicId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Step state
    const [step, setStep] = useState(1); // 1: Doctor, 2: Slots, 3: OTP/Details, 4: Payment, 5: Success

    // Data state
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    // Selection state
    const [selectedDepartment, setSelectedDepartment] = useState(location.state?.department || "");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);

    useEffect(() => {
        const initBooking = async () => {
            try {
                const clinicData = await patientService.getClinicDetails(clinicId);
                setClinic(clinicData);

                if (selectedDepartment) {
                    const doctorsData = await patientService.getClinicDoctors(clinicId, selectedDepartment);
                    setDoctors(doctorsData);
                }
            } catch (error) {
                console.error("Booking init error:", error);
            } finally {
                setLoading(false);
            }
        };
        initBooking();
    }, [clinicId, selectedDepartment]);

    // Derived dates for next 7 days
    const availableDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toISOString().split("T")[0];
    });

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleDateSelect = async (date) => {
        setSelectedDate(date);
        setSelectedSlot(""); // Clear previously selected slot
        setLoading(true);
        try {
            const availableSlots = await patientService.getDoctorAvailability(selectedDoctor._id, date);
            setSlots(availableSlots || []);
        } catch (error) {
            console.error("Fetch slots error:", error);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSlots = () => {
        if (selectedDate && selectedSlot) setStep(3);
    };

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await patientService.sendOtp(phone);
            setIsOtpSent(true);
        } catch (error) {
            console.error("OTP send error:", error);
            alert(error.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await patientService.verifyOtp(phone, otp, false); // Pass false to NOT delete yet
            setStep(4);
        } catch (error) {
            console.error("OTP verify error:", error);
            alert(error.response?.data?.message || "Invalid OTP or expired.");
        } finally {
            setLoading(false);
        }
    };

    const handleBookingFinalize = async (paymentMethod) => {
        setLoading(true);
        try {
            const bookingData = {
                clinicId,
                doctorId: selectedDoctor._id,
                appointmentDate: selectedDate,
                timeSlot: selectedSlot,
                phone,
                otp,
                paymentOption: paymentMethod // Backend expects paymentOption
            };

            const result = await patientService.bookAppointment(bookingData);

            // Backend returns { success: true, message: "...", data: { appointment, paymentData } }
            if (result.data?.paymentData?.payment_url) {
                window.location.href = result.data.paymentData.payment_url;
            } else {
                setStep(5);
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert(error.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 1) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 animate-fadeIn">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    {["Specialist", "Schedule", "Details", "Confirm"].map((label, i) => (
                        <div key={i} className={`flex flex-col items-center flex-1 relative`}>
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-500
                                ${step > i + 1 ? "bg-teal-500 text-white" : step === i + 1 ? "bg-teal-600 text-white shadow-lg shadow-teal-200" : "bg-slate-100 text-slate-400"}
                            `}>
                                {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                            </div>
                            <span className={`text-[10px] font-black uppercase mt-2 tracking-widest ${step === i + 1 ? "text-teal-600" : "text-slate-400"}`}>
                                {label}
                            </span>
                            {i < 3 && (
                                <div className={`absolute left-[50%] top-5 w-full h-1 -z-0 ${step > i + 1 ? "bg-teal-500" : "bg-slate-100"}`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Doctor Selection */}
            {step === 1 && (
                <div className="space-y-8 animate-slideIn">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-slate-800">Select Specialist</h2>
                        <div className="flex items-center text-teal-600 bg-teal-50 px-4 py-2 rounded-xl font-bold text-sm">
                            <Stethoscope className="w-4 h-4 mr-2" />
                            {selectedDepartment}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {doctors.map((doc) => (
                            <div
                                key={doc._id}
                                onClick={() => handleDoctorSelect(doc)}
                                className="group p-6 bg-white rounded-[2.5rem] border border-slate-100 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-start space-x-5">
                                    <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm ring-4 ring-slate-50">
                                        <img src={doc.profilePhoto || `https://ui-avatars.com/api/?name=${doc.fullName}&background=0D9488&color=fff`} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-black text-slate-800 group-hover:text-teal-600 transition-colors uppercase tracking-tight">{doc.fullName}</h4>
                                        <p className="text-teal-500 font-bold text-sm">{doc.specialization}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Fee: Rs. {doc.consultationFee || 500}</span>
                                            <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                                                <AlertCircle className="w-3 h-3 mr-1 fill-yellow-500 text-white" />
                                                <span className="text-[10px] font-black tracking-widest">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Date & Slot Selection */}
            {step === 2 && (
                <div className="space-y-10 animate-slideIn">
                    <button onClick={() => setStep(1)} className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>

                    <div>
                        <h3 className="text-2xl font-black text-slate-800 mb-6">Choose Date</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {availableDates.map((date) => {
                                const d = new Date(date);
                                const isSelected = selectedDate === date;
                                return (
                                    <div
                                        key={date}
                                        onClick={() => handleDateSelect(date)}
                                        className={`
                                            p-4 rounded-2xl text-center border cursor-pointer transition-all
                                            ${isSelected ? "bg-teal-600 border-teal-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-600 hover:border-teal-200"}
                                        `}
                                    >
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? "text-teal-100" : "text-slate-400"}`}>
                                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                                        </p>
                                        <p className="text-xl font-black">{d.getDate()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedDate && (
                        <div className="animate-fadeIn">
                            <h3 className="text-2xl font-black text-slate-800 mb-6">Available Slots</h3>
                            {loading ? (
                                <div className="flex justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {slots.map((s) => (
                                        <div
                                            key={s}
                                            onClick={() => setSelectedSlot(s)}
                                            className={`
                                                p-4 rounded-xl text-center border font-bold cursor-pointer transition-all
                                                ${selectedSlot === s ? "bg-teal-50 text-teal-600 border-teal-200" : "bg-white border-slate-100 text-slate-500 hover:border-teal-100"}
                                            `}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        disabled={!selectedSlot}
                        onClick={handleConfirmSlots}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        Confirm Schedule
                    </button>
                </div>
            )}

            {/* Step 3: OTP & Personal Details */}
            {step === 3 && (
                <div className="space-y-10 animate-slideIn max-w-xl mx-auto">
                    <button onClick={() => setStep(2)} className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>

                    <div className="text-center">
                        <h2 className="text-3xl font-black text-slate-800 italic">Verification</h2>
                        <p className="text-slate-400 font-medium mt-2">Confirm your phone number for doctor contact</p>
                    </div>

                    {!isOtpSent ? (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="98XXXXXXXX"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSendOtp}
                                disabled={phone.length < 10 || loading}
                                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Send OTP"}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between bg-teal-50 p-4 rounded-2xl border border-teal-100">
                                <span className="text-teal-600 font-bold text-sm">OTP sent to {phone}</span>
                                <button onClick={() => setIsOtpSent(false)} className="text-[10px] font-black text-teal-600 uppercase underline">Change</button>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Enter 6-Digit Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="XXXXXX"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-black text-center text-4xl tracking-[1rem]"
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                disabled={otp.length < 6}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                Verify & Continue
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step 4: Final Confirmation & Payment */}
            {step === 4 && (
                <div className="space-y-10 animate-slideIn">
                    <h2 className="text-3xl font-black text-slate-800">Final Confirmation</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Summary */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-50 pb-4">Booking Summary</h3>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600"><User className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Specialist</p>
                                        <p className="text-slate-800 font-bold">{selectedDoctor.fullName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><CalendarIcon className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Date & Time</p>
                                        <p className="text-slate-800 font-bold">{new Date(selectedDate).toLocaleDateString()} at {selectedSlot}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600"><MapPin className="w-6 h-6" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                                        <p className="text-slate-800 font-bold">{clinic.clinicName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-slate-400 font-bold">Consultation Fee</span>
                                <span className="text-2xl font-black text-slate-800">Rs. {selectedDoctor.consultationFee || 500}</span>
                            </div>
                        </div>

                        {/* Payment Selection */}
                        <div className="space-y-6">
                            <div
                                onClick={() => handleBookingFinalize("Clinic")}
                                className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-teal-500 hover:bg-teal-50/10 cursor-pointer transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-teal-500 group-hover:text-white transition-colors"><ShieldCheck className="w-7 h-7" /></div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 tracking-tight">Pay at Clinic</h4>
                                        <p className="text-slate-400 text-xs font-medium">Verify and pay directly at desk</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                            </div>

                            <div
                                onClick={() => handleBookingFinalize("Online")}
                                className="group p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] hover:bg-emerald-600 cursor-pointer transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-emerald-600 transition-colors"><CreditCard className="w-7 h-7" /></div>
                                    <div>
                                        <h4 className="text-lg font-black text-white tracking-tight">Digital Payment</h4>
                                        <p className="text-white/40 text-xs font-medium">Pay securely via Khalti / eSewa</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 5: Success Screen */}
            {step === 5 && (
                <div className="py-20 text-center animate-scaleIn">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4 italic">Successfully Booked!</h2>
                    <p className="text-slate-500 max-w-md mx-auto font-medium">
                        Your appointment with {selectedDoctor.fullName} has been scheduled. Check your dashboard for details.
                    </p>

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate("/patient/dashboard")}
                            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/patient/appointments")}
                            className="px-10 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            View Appointment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
