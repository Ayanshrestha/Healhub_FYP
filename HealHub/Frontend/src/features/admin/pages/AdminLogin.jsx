import React, { useState } from "react";
import { HeartPulse, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLoginAPI } from "../services/adminAuthService";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/admin/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await adminLoginAPI({ email, password });
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUser", JSON.stringify(data.user));
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
                        <HeartPulse className="w-8 h-8 text-teal-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">HealHub Admin</h1>
                    <p className="text-gray-500 mt-2 font-medium">Internal Administration Portal</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-50 border-transparent py-3 pl-11 pr-4 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-gray-50 border-transparent py-3 pl-11 pr-4 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-teal-700 transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In to Portal</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center space-x-2 text-gray-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-widest">Secure Session</span>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <a href="/" className="hover:text-teal-600 transition-colors">Return to Homepage</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
