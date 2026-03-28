import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./services/authService";
import { clearSession } from "../../services/api";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Mail,
  Lock,
  ChevronRight,
  ShieldCheck,
  User,
  Stethoscope,
  Activity,
  Building2
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = [
    { id: "Patient", label: "Patient", icon: User, color: "teal" },
    { id: "Doctor", label: "Doctor", icon: Stethoscope, color: "emerald" },
    { id: "Clinic", label: "Clinic", icon: Building2, color: "sky" },
    { id: "Therapist", label: "Therapist", icon: Activity, color: "indigo" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearSession();
    setLoading(true);
    try {
      const response = await login({
        email,
        password,
        role: selectedRole.toLowerCase()
      });


      if (response.success) {
        localStorage.setItem("token", response.token);

        const userDataToStore = {
          ...response.user,
          fullName: response.profile?.fullName || response.user.fullName,
          profilePhoto: response.profile?.profilePhoto || response.user.profilePhoto
        };

        localStorage.setItem("user", JSON.stringify(userDataToStore));

        if (selectedRole === "Admin") {
          localStorage.setItem("adminToken", response.token);
          localStorage.setItem("adminUser", JSON.stringify(userDataToStore));
          navigate("/admin/dashboard");
        } else if (selectedRole === "Clinic") {
          localStorage.setItem("clinic_token", response.token);
          // Store status for Protected Route checks
          // Check profile.status (Clinic model) first, fallback to user.status
          const status = (response.profile?.status || response.user.status || "PENDING_APPROVAL").toUpperCase();
          localStorage.setItem("clinic_status", status);

          if (status === "APPROVED_UNPAID") {
            navigate("/clinic/subscription");
          } else if (response.nextStep === "PAYMENT_REQUIRED" || status === "PENDING_APPROVAL" || status !== "ACTIVE") {
            navigate("/clinic/billing");
          } else {
            navigate("/clinic/dashboard");
          }
        } else {
          const role = selectedRole.toLowerCase();
          if (role === "doctor" || role === "therapist") {
            localStorage.setItem("provider_token", response.token);
          }
          navigate(response.nextStep === "DASHBOARD" ? (role === "doctor" || role === "therapist" ? "/provider/dashboard" : `/${role}/dashboard`) : "/");
        }
        toast.success(`Welcome to HealHub, ${userDataToStore.fullName || "User"}!`);
      }
    } catch (error) {
      console.error("Login component error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Visual Context */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-700 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 -left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 max-w-lg text-center text-white">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl scale-110">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Your Health, <br />Our Digital Priority.</h1>
            <p className="text-xl text-teal-50 font-medium leading-relaxed opacity-90">
              Access the most advanced healthcare management platform in Nepal. Connect with top specialists and manage your medical journey seamlessly.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 opacity-80">
              <div className="text-center">
                <p className="text-3xl font-black">20k+</p>
                <p className="text-xs uppercase tracking-widest font-bold mt-1">Users</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-3xl font-black">500+</p>
                <p className="text-xs uppercase tracking-widest font-bold mt-1">Specialists</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">100+</p>
                <p className="text-xs uppercase tracking-widest font-bold mt-1">Clinics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-slate-50/50">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Login</h2>
              <p className="text-slate-500 font-medium">Select your portal and enter credentials.</p>
            </div>

            {/* Role Switcher */}
            <div className="flex flex-wrap gap-2 mb-10 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300
                    ${selectedRole === role.id
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-200"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}
                  `}
                >
                  <role.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{role.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                    <Mail className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700">Forgot?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-teal-600 transition-colors">
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-teal-200 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Enter {selectedRole} Portal</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center space-y-6">
              <p className="text-slate-500 font-medium">
                New to HealHub?
                <Link to="/signup" className="text-teal-600 font-black ml-2 hover:underline">Create Account</Link>
              </p>

              <div className="w-full relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <Link
                to="/admin/login"
                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span>Login as Administrator</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
