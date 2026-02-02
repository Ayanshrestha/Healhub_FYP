import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEnvelope } from "react-icons/fa";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { verifyOtpAPI, resendOtpAPI } from "./services/authService";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return alert("Please enter a valid 6-digit OTP");
    }

    try {
      setLoading(true);
      const res = await verifyOtpAPI({ email, otp });

      alert(res.message || "OTP verified successfully");
      navigate(`/set-password?email=${email}`);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtpAPI({ email });
      alert("OTP resent to your email");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 min-h-screen">
      <Navbar />

      <section className="max-w-md mx-auto px-6 py-20">
        <div className="bg-white p-10 rounded-2xl shadow-xl">

          {/* ICON */}
          <div className="text-center mb-6">
            <FaShieldAlt className="text-emerald-600 text-5xl mx-auto" />
            <h1 className="text-3xl font-extrabold text-teal-800 mt-4">
              Verify OTP
            </h1>
            <p className="text-gray-600 mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* EMAIL DISPLAY */}
          <div className="mb-6">
            <label className="text-gray-700 font-semibold mb-2 block">
              <FaEnvelope className="inline text-emerald-600 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email || ""}
              disabled
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* OTP INPUT */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              One-Time Password (OTP)
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border rounded-lg text-center tracking-widest text-lg focus:ring-emerald-500"
            />
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg mt-6 hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* RESEND */}
          <p className="text-center text-gray-600 mt-5">
            Didn’t receive the code?{" "}
            <button
              onClick={handleResend}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
