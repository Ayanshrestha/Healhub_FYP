import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { verifyPaymentAPI } from "../../auth/services/authService";

const PaymentVerification = () => {
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
                setMessage("No payment identifier (pidx) found in the URL.");
                return;
            }

            if (khaltiStatus === "User canceled") {
                setStatus("error");
                setMessage("Payment was canceled by the user.");
                return;
            }

            try {
                verificationAttempted.current = true;
                const token = localStorage.getItem("token"); // Assuming clinic token is stored as 'token'

                if (!token) {
                    setStatus("error");
                    setMessage("You are not logged in. Please log in and try again.");
                    return;
                }

                const result = await verifyPaymentAPI(pidx, token);

                if (result.success) {
                    setStatus("success");
                    setMessage("Payment received successfully! Your clinic is now ACTIVE.");
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                {status === "verifying" && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Verifying Payment</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Payment Successful</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all shadow-lg"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Payment Failed</h2>
                        <p className="text-gray-500 font-medium">{message}</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentVerification;
