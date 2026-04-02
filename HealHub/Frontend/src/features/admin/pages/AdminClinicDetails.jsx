import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import {
    Building,
    Mail,
    Phone,
    MapPin,
    User,
    ShieldCheck,
    Loader2,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Calendar,
    CreditCard,
    FileText
} from "lucide-react";
import { getClinicDetailsAPI, updateClinicStatus } from "../services/adminAuthService";
import { BASE_URL } from "../../../services/api";
import { toast } from "react-hot-toast";

const AdminClinicDetails = () => {
    const { clinicId } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const data = await getClinicDetailsAPI(clinicId);
            setClinic(data);
        } catch (err) {
            setError(err.message || "Failed to load clinic details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [clinicId]);

    const handleAction = async (status) => {
        try {
            setActionLoading(true);
            await updateClinicStatus(clinicId, status);
            toast.success(`Clinic ${status === "APPROVED_UNPAID" ? "Approved" : "Rejected"} successfully`);
            fetchDetails();
        } catch (err) {
            toast.error(err.message || "Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Syncing facility details...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error || !clinic) {
        return (
            <AdminLayout>
                <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Details</h3>
                    <p className="text-gray-500 mb-8">{error || "Clinic record not found"}</p>
                    <button
                        onClick={() => navigate("/admin/clinics")}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition"
                    >
                        Back to Registry
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const statusColors = {
        PENDING_APPROVAL: "bg-amber-100 text-amber-700 border-amber-200",
        APPROVED_UNPAID: "bg-blue-100 text-blue-700 border-blue-200",
        ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
        BLOCKED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-teal-600 font-bold transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Registry</span>
                </button>

                <div className="flex space-x-2">
                    <button
                        disabled={actionLoading || clinic.status === "REJECTED"}
                        onClick={() => handleAction("REJECTED")}
                        className="px-6 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                        Reject
                    </button>
                    <button
                        disabled={actionLoading || clinic.status === "ACTIVE" || clinic.status === "APPROVED_UNPAID"}
                        onClick={() => handleAction("APPROVED_UNPAID")}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 flex items-center space-x-2"
                    >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Approve Facility</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                            <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${statusColors[clinic.status]}`}>
                                {clinic.status.replace("_", " ")}
                            </span>
                        </div>

                        <div className="flex items-start space-x-6 mb-8">
                            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                <Building className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{clinic.clinicName}</h1>
                                <div className="flex items-center space-x-2 text-gray-500 font-medium mt-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{clinic.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-gray-50 pt-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Owner Profile
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-lg font-bold text-gray-900">{clinic.ownerName}</p>
                                    <p className="text-sm text-gray-500 font-medium">Facility Administrator</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Official Credentials
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col space-y-3">
                                    <div className="font-mono text-emerald-700 font-bold text-sm">
                                        License: {clinic.licenseNumber || "N/A"}
                                    </div>
                                    {clinic.documents && clinic.documents.length > 0 ? (
                                        <div className="pt-2 border-t border-gray-200/50">
                                            {clinic.documents.map((doc, idx) => (
                                                <a
                                                    key={idx}
                                                    href={`${BASE_URL}/${doc.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-xs font-black text-teal-600 uppercase tracking-widest hover:underline"
                                                >
                                                    <FileText className="w-3.5 h-3.5 mr-2" />
                                                    View {doc.name}
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">No documents uploaded</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Mail className="w-5 h-5 text-teal-600 mr-4" />
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-gray-900 font-bold">{clinic.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Phone className="w-5 h-5 text-teal-600 mr-4" />
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-gray-900 font-bold">{clinic.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Subscription Details</h3>
                        {clinic.subscriptionPlan ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-teal-600 rounded-2xl text-white shadow-lg">
                                    <CreditCard className="w-8 h-8 mb-4 opacity-50" />
                                    <h4 className="text-2xl font-bold uppercase">{clinic.subscriptionPlan}</h4>
                                    <p className="text-xs font-medium opacity-80 mt-1">Active Membership</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Valid Until</span>
                                        <span className="text-gray-900 font-bold">{new Date(clinic.subscriptionEndDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Billing Status</span>
                                        <span className="text-emerald-600 font-bold">Paid</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium text-sm">No active subscription</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminClinicDetails;
