import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { completeRegistration } from "./services/authService";
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Clinic flow uses a JWT token from the approval email link
  // Other roles use a plain email
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      // Clinic flow sends token; other roles send email
      const payload = token
        ? { token, password: form.password, confirmPassword: form.confirmPassword }
        : { email, password: form.password, confirmPassword: form.confirmPassword };

      const response = await completeRegistration(payload);
      
      if (response.success) {
        // Automatically log the user in
        localStorage.setItem("token", response.token);
        
        const userDataToStore = {
          ...response.user,
          fullName: response.profile?.fullName || response.user.fullName,
          profilePhoto: response.profile?.profilePhoto || response.user.profilePhoto
        };
        localStorage.setItem("user", JSON.stringify(userDataToStore));

        if (response.user.role === "clinic") {
          localStorage.setItem("clinic_token", response.token);
          const status = (response.profile?.status || response.user.status || "APPROVED_UNPAID").toUpperCase();
          localStorage.setItem("clinic_status", status);
          
          toast.success("Account secured! Redirecting to subscription...");
          navigate("/clinic/subscription");
        } else {
          toast.success("Account secured successfully! Please log in.");
          navigate("/login");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error setting password");
    } finally {
      setLoading(false);
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
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white">

            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-teal-200 mx-auto mb-6 transform -rotate-3">
                <FaLock className="text-white text-3xl" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
                Secure Account
              </h1>
              <p className="text-slate-500 font-medium">
                Create a strong password for <span className="text-teal-600 font-bold">{email}</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaShieldAlt className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaCheckCircle className="text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-teal-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-teal-200/50 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0 mt-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    Securing...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-400 text-sm font-medium">
              By creating an account, you agree to our <br />
              <button className="text-teal-600 hover:underline font-bold">Terms of Service</button> and <button className="text-teal-600 hover:underline font-bold">Privacy Policy</button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
