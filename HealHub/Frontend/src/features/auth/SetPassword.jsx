import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { completeRegistration } from "./services/authService";
import { FaLock, FaCheckCircle } from "react-icons/fa";

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    try {
      await completeRegistration({
        email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 min-h-screen">
      <Navbar />

      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-6">
            <FaCheckCircle className="text-emerald-600 text-5xl mx-auto" />
            <h2 className="text-2xl font-bold text-teal-800 mt-3">
              Set Your Password
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Create a secure password for your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                <FaLock className="inline mr-2 text-emerald-600" />
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                <FaLock className="inline mr-2 text-emerald-600" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
