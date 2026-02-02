import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserShield } from "react-icons/fa";
import { adminLoginAPI } from "../../services/adminAuthService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await adminLoginAPI({ email, password });

            // Senior practice: Save session securely
            localStorage.setItem("adminToken", data.token || "dummytoken_replace_in_prod"); // Backend should ideally return token
            localStorage.setItem("adminUser", JSON.stringify(data.user));

            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.message || "Invalid credentials or server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-emerald-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaUserShield className="text-white text-3xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
                        <p className="text-gray-500 mt-2">Sign in to manage HealHub systems</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg flex items-center shadow-sm">
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Administrator Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@healhub.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition transition-all placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Secure Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition transition-all placeholder-gray-400"
                                />
                                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-md hover:bg-emerald-800 active:transform active:scale-95 transition-all
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Authenticating...
                                </span>
                            ) : (
                                "Sign In to Console"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-400">
                            HealHub © 2026 Administrator Access Only
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminLogin;
