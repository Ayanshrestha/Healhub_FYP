import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import { Building, Plus, Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { getSystemData, updateClinicStatus } from "../services/adminAuthService";

const ClinicManagement = () => {
    const navigate = useNavigate();
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchClinics = async () => {
        setLoading(true);
        try {
            const data = await getSystemData("clinics");
            setClinics(data.clinics || []);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to load clinics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinics();
    }, []);

    const handleUpdateStatus = async (clinicId, status) => {
        try {
            await updateClinicStatus(clinicId, status);
            alert(`Clinic ${status === "APPROVED_UNPAID" ? "Approved" : "Rejected"} successfully`);
            fetchClinics(); // Refresh list
        } catch (err) {
            alert(err.message || "Failed to update status");
        }
    };

    const filteredClinics = clinics.filter(clinic =>
        clinic.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8 fadeIn">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Clinics & Hospitals</h2>
                    <p className="text-gray-500 mt-1 font-medium">Verify and manage medical institutions on the platform.</p>
                </div>
                <button className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/10">
                    <Plus className="w-5 h-5" />
                    <span>Register New Clinic</span>
                </button>
            </div>

            <div className="mb-8 relative max-w-md fadeIn">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search clinics by name or location..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4 fadeIn">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                    <p className="text-gray-500 font-bold">Accessing medical registry...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center fadeIn">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-red-900 mb-2">Connection Error</h3>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchClinics}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredClinics.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 p-20 rounded-3xl text-center fadeIn">
                    <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">No clinics found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fadeIn">
                    {filteredClinics.map((clinic) => (
                        <div key={clinic._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                                    <Building className="w-7 h-7 text-emerald-600" />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${clinic.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                    clinic.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        clinic.status === 'APPROVED_UNPAID' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            clinic.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                                                'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>
                                    {clinic.status.replace("_", " ")}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{clinic.clinicName}</h3>
                            <div className="flex items-center space-x-2 text-gray-500 mb-6 text-sm font-medium">
                                <MapPin className="w-4 h-4" />
                                <span>{clinic.address || "Location N/A"}, Nepal</span>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="text-sm font-bold text-gray-700">Official Registration</div>
                                    <button
                                        onClick={() => navigate(`/admin/clinics/${clinic._id}`)}
                                        className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                                    >
                                        View Details →
                                    </button>
                                </div>

                                {clinic.status === 'PENDING_APPROVAL' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(clinic._id, 'APPROVED_UNPAID')}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/10"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(clinic._id, 'REJECTED')}
                                            className="flex-1 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default ClinicManagement;
