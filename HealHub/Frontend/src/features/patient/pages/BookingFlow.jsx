import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAssetUrl } from "../../../services/api";
import { toast } from "react-hot-toast";
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
    const [step, setStep] = useState(1); // 1: Doctor, 2: Slots, 3: Confirm, 4: Success

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
    const [visitType, setVisitType] = useState("CLINIC_VISIT");
    const [homeAddress, setHomeAddress] = useState("");

    useEffect(() => {
        const initBooking = async () => {
            try {
                const clinicData = await patientService.getClinicDetails(clinicId);
                setClinic(clinicData);

                if (selectedDepartment) {
                    const doctorsData = await patientService.getClinicDoctors(clinicId, selectedDepartment);
                    setDoctors(doctorsData);
                } else {
                    setDoctors(clinicData?.topSpecialists || []);
                }

                // If user clicked 'Book Consultation' directly on a doctor card, skip to step 2
                if (location.state?.doctorId && clinicData?.topSpecialists) {
                    const doc = clinicData.topSpecialists.find(d => d._id === location.state.doctorId);
                    if (doc) {
                        setSelectedDoctor(doc);
                        setStep(2);
                    }
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
        if (!selectedSlot) {
            return toast.error("Please select a time slot");
        }
        if (visitType === "HOME_VISIT" && (!homeAddress || homeAddress.trim() === "")) {
            return toast.error("Please provide your full home address for the visit");
        }
        if (selectedDate && selectedSlot) setStep(3);
    };

    const handleBookingFinalize = async () => {
        setLoading(true);
        try {
            const bookingData = {
                clinicId,
                doctorId: selectedDoctor._id,
                appointmentDate: selectedDate,
                timeSlot: selectedSlot,
                visitType,
                homeAddress: visitType === "HOME_VISIT" ? homeAddress : undefined,
                paymentOption: "Clinic"
            };

            await patientService.bookAppointment(bookingData);
            setStep(4);
            toast.success("Appointment request submitted successfully!");
        } catch (error) {
            console.error("Booking error:", error);
            toast.error(error.response?.data?.message || "Booking failed. Please try again.");
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
            {/* Progress Bar - Hidden on Success */}
            {step < 5 && (
                <div className="mb-12 text-center">
                    <div className="flex justify-between items-center mb-4">
                        {["Specialist", "Schedule", "Details", "Confirm"].map((label, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 relative">
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
                                    <div className={`absolute left-[50%] top-5 w-full h-[2px] -z-0 ${step > i + 1 ? "bg-teal-500" : "bg-slate-100"}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 1: Doctor Selection */}
            {step === 1 && (
                <div className="space-y-8 animate-slideIn">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-slate-800 italic uppercase italic">Select Specialist</h2>
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
                                    <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm ring-4 ring-slate-50 relative shrink-0">
                                        {doc.profilePhoto ? (
                                            <img src={getAssetUrl(doc.profilePhoto)} className="w-full h-full object-cover" alt={doc.fullName} />
                                        ) : (
                                            <img src={`https://ui-avatars.com/api/?name=${doc.fullName}&background=0D9488&color=fff`} className="w-full h-full object-cover" alt="" />
                                        )}
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
                    <button onClick={() => setStep(1)} className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest italic"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>

                    <div>
                        <h3 className="text-2xl font-black text-slate-800 mb-6 italic uppercase tracking-tight italic">Choose Date</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {availableDates.map((date) => {
                                const [year, month, day] = date.split("-").map(Number);
                                const d = new Date(year, month - 1, day); // local time, no UTC shift
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
                            <h3 className="text-2xl font-black text-slate-800 mb-6 italic uppercase tracking-tight italic">Available Slots</h3>
                            {loading ? (
                                <div className="flex justify-center"><Loader2 className="animate-spin text-teal-500" /></div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {slots.length > 0 ? slots.map((s) => (
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
                                    )) : (
                                        <p className="col-span-full text-center text-slate-400 font-bold text-sm">No slots available for this date.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedSlot && (
                        <div className="animate-fadeIn pt-4">
                            <h3 className="text-2xl font-black text-slate-800 mb-6 italic uppercase tracking-tight italic">Visit Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div
                                    onClick={() => setVisitType("CLINIC_VISIT")}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${visitType === 'CLINIC_VISIT' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white hover:border-teal-200'}`}
                                >
                                    <h4 className="font-black text-slate-800 text-lg">🏥 At Clinic</h4>
                                    <p className="text-slate-500 text-sm font-bold mt-1">Visit the facility</p>
                                </div>
                                <div
                                    onClick={() => setVisitType("HOME_VISIT")}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${visitType === 'HOME_VISIT' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white hover:border-teal-200'}`}
                                >
                                    <h4 className="font-black text-slate-800 text-lg">🏠 At Home</h4>
                                    <p className="text-teal-600 text-sm font-black mt-1">+ Rs. 500 Travel Surcharge</p>
                                </div>
                            </div>

                            {visitType === "HOME_VISIT" && (
                                <div className="space-y-4 animate-slideIn bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Delivery Address & Landmark</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                                            <textarea
                                                value={homeAddress}
                                                onChange={(e) => setHomeAddress(e.target.value)}
                                                placeholder="e.g. House 14, Near Nabil Bank, Pulchowk"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-bold resize-none h-24"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        disabled={!selectedSlot}
                        onClick={handleConfirmSlots}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl"
                    >
                        Confirm Schedule
                    </button>
                </div>
            )}

            {/* Step 3: Booking Confirmation */}
            {step === 3 && (
                <div className="space-y-10 animate-slideIn max-w-xl mx-auto">
                    <button onClick={() => setStep(2)} className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest italic"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>

                    <div className="text-center">
                        <h2 className="text-3xl font-black text-slate-800 italic">Confirm Booking</h2>
                        <p className="text-slate-400 font-medium mt-2">Review your appointment details before submitting</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</span>
                            <span className="font-black text-slate-800">{selectedDoctor?.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                            <span className="font-black text-slate-800">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</span>
                            <span className="font-black text-slate-800">{selectedSlot}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Type</span>
                            <span className="font-black text-slate-800">{visitType === 'HOME_VISIT' ? '🏠 Home Visit (+Rs. 500)' : '🏥 Clinic Visit'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</span>
                            <span className="font-black text-teal-600">Rs. {visitType === 'HOME_VISIT' ? (selectedDoctor?.consultationFee || 0) + 500 : (selectedDoctor?.consultationFee || 0)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleBookingFinalize}
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm & Submit Request"}
                    </button>
                </div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
                <div className="py-20 text-center animate-scaleIn">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4 italic uppercase">Request Sent!</h2>
                    <p className="text-slate-500 max-w-md mx-auto font-medium">
                        Your appointment request for Dr. {selectedDoctor?.fullName} has been submitted.
                    </p>
                    <div className="mt-6 bg-teal-50/50 p-6 rounded-[2rem] border border-teal-100 max-w-lg mx-auto">
                        <p className="text-teal-800 font-black text-[10px] uppercase tracking-widest mb-3 italic">
                            Next Steps
                        </p>
                        <ul className="text-teal-600 text-xs font-bold space-y-3 list-none">
                            <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div> Specialst will review your request</li>
                            <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div> Notification & email once approved</li>
                            <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div> Complete payment to secure slot</li>
                        </ul>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate("/patient/dashboard")}
                            className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => navigate("/patient/appointments")}
                            className="w-full md:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
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
