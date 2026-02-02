import React, { useState } from "react";
import {
  FaUserMd,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaStethoscope,
  FaIdBadge,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { startRegistration } from "./services/authService";
import { useNavigate } from "react-router-dom";

export default function TherapistSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: "",
    licenseNumber: "",
    experienceYears: "",
    workAddress: "",
    role: "therapist",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form, role: "therapist" };

    try {
      const res = await startRegistration(payload);

      alert(res.message || "OTP sent to your email");

      navigate(`/verify-otp?email=${form.email}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-100 min-h-screen">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-10 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <FaUserMd className="text-emerald-600 text-6xl mx-auto" />
            <h1 className="text-4xl font-extrabold text-teal-800 mt-4">
              Therapist Registration
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Join HealHub as a certified therapist
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaUser className="inline text-emerald-600 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Ram Sharma"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaEnvelope className="inline text-emerald-600 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="therapist@example.com"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaPhone className="inline text-emerald-600 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+977-9812345678"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaVenusMars className="inline text-emerald-600 mr-2" />
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaStethoscope className="inline text-emerald-600 mr-2" />
                Specialization
              </label>
              <select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              >
                <option value="">Select Specialty</option>
                <option>Physiotherapy</option>
                <option>Counseling</option>
                <option>Psychotherapy</option>
                <option>Rehabilitation Therapy</option>
                <option>Occupational Therapy</option>
                <option>Speech Therapy</option>
              </select>
            </div>

            {/* License ID */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaIdBadge className="inline text-emerald-600 mr-2" />
                License / Certification ID
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="THER-12345"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaUserMd className="inline text-emerald-600 mr-2" />
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                value={form.experienceYears}
                onChange={handleChange}
                placeholder="3"
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-gray-700 font-semibold mb-2 block">
                <FaMapMarkerAlt className="inline text-emerald-600 mr-2" />
                Clinic / Work Address
              </label>
              <textarea
                name="workAddress"
                value={form.workAddress}
                onChange={handleChange}
                rows="2"
                placeholder="Clinic or workplace address"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-emerald-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition shadow-lg"
            >
              Next → Send OTP
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-emerald-600 font-semibold hover:underline"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
