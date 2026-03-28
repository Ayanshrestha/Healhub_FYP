import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaShieldAlt, FaEnvelope, FaChevronLeft } from "react-icons/fa";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { verifyOtpAPI, resendOtpAPI, registerClinicFromOtp } from "./services/authService";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const email = location.state?.email || params.get("email");
  const role = location.state?.role || params.get("role");

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return toast.error("Please enter a 6-digit OTP");
    }

    try {
      setLoading(true);
      await verifyOtpAPI({ email, otp: otpString });

      if (role === "clinic") {
        // For clinics: create pending record then go to the approval-pending page
        await registerClinicFromOtp(email);
        toast.success("OTP verified! Your registration is now under review.");
        navigate("/clinic-pending", { state: { email } });
      } else {
        // For all other roles: proceed to set password as before
        toast.success("OTP verified successfully");
        navigate(`/set-password?email=${email}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendOtpAPI({ email });
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
      toast.success("OTP resent to your email");
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Navbar />

      <main className="relative flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-teal-50/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-lg">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-teal-600 font-semibold mb-8 transition-colors group"
          >
            <FaChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white">

            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-teal-200 mx-auto mb-6 transform rotate-3">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
                Verification Required
              </h1>
              <p className="text-slate-500 font-medium">
                We've sent a 6-digit verification code to
              </p>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <FaEnvelope className="text-teal-600" />
                <span className="text-slate-800 font-bold">{email}</span>
              </div>
            </div>

            {/* OTP BOXES */}
            <div className="flex justify-between gap-2 md:gap-4 mb-10">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-14 md:h-16 text-center text-2xl font-black text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full h-16 bg-teal-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-teal-200/50 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium mb-3">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-teal-600 font-extrabold hover:text-teal-700 transition-colors"
                >
                  Resend New Code
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-3 text-slate-400 font-bold">
                  <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-1000"
                      style={{ width: `${(timer / 60) * 100}%` }}
                    />
                  </div>
                  <span>Resend in {timer}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
