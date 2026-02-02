import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, ArrowRight, Calendar } from "lucide-react";
import patientService from "../services/patientService";

const PatientPaymentVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Checking payment status with Khalti...");
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const pidx = searchParams.get("pidx");
        const khaltiStatus = searchParams.get("status");

        if (verificationAttempted.current) return;

        const verify = async () => {
            if (!pidx) {
                setStatus("error");
                setMessage("No payment identifier (pidx) found.");
                return;
            }

            if (khaltiStatus === "User canceled") {
                setStatus("error");
                setMessage("Payment was canceled. Your appointment booking could not be completed.");
                return;
            }

            try {
                verificationAttempted.current = true;
                const result = await patientService.verifyPayment(pidx);

                if (result.success) {
                    setStatus("success");
                    setMessage("Consultation fee paid successfully! Your appointment is now confirmed.");
                } else {
                    setStatus("error");
                    setMessage(result.message || "Verification failed.");
                }
            } catch (error) {
                setStatus("error");
                setMessage(error.response?.data?.message || "An error occurred during verification.");
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
                {status === "verifying" && (
                    <div className="space-y-8">
                        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-teal-50/50">
                            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 italic">Verifying...</h2>
                            <p className="text-slate-500 font-medium">{message}</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 italic">Payment Success</h2>
                            <p className="text-slate-500 font-medium px-4">{message}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/patient/appointments")}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-teal-600 transition-all shadow-xl"
                            >
                                <span>My Appointments</span>
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate("/patient/dashboard")}
                                className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
                            <XCircle className="w-12 h-12 text-rose-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 italic">Payment Failed</h2>
                            <p className="text-slate-500 font-medium px-4">{message}</p>
                        </div>
                        <button
                            onClick={() => navigate("/patient/dashboard")}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientPaymentVerification;
