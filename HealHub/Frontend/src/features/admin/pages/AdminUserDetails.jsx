import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    Activity,
    CheckCircle,
    AlertCircle,
    Loader2,
    Briefcase,
    MapPin,
    Award,
    CreditCard
} from "lucide-react";
import { getUserDetailsAPI, toggleUserStatus, verifyDoctorAPI } from "../services/adminAuthService";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../../components/common/ConfirmModal";

const AdminUserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null });

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const res = await getUserDetailsAPI(userId);
            setData(res);
        } catch (err) {
            setError(err.message || "Failed to load user details");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = () => {
        setConfirmModal({ isOpen: true, type: 'toggle' });
    };

    const handleVerifyDoctor = () => {
        setConfirmModal({ isOpen: true, type: 'verify' });
    };

    const handleConfirm = async () => {
        setConfirmModal({ isOpen: false, type: null });
        setUpdating(true);
        try {
            if (confirmModal.type === 'toggle') {
                await toggleUserStatus(userId);
                await fetchUserDetails();
                toast.success("User status updated successfully");
            } else if (confirmModal.type === 'verify') {
                await verifyDoctorAPI(userId);
                await fetchUserDetails();
                toast.success("Doctor verified successfully!");
            }
        } catch (err) {
            toast.error(err.message || "Operation failed");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium font-primary">Loading user profile...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error || !data) {
        return (
            <AdminLayout>
                <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Profile</h3>
                    <p className="text-red-600 mb-6">{error || "User not found"}</p>
                    <button
                        onClick={() => navigate("/admin/users")}
                        className="bg-white text-red-600 px-6 py-2 rounded-xl font-bold border border-red-200 hover:bg-red-50 transition"
                    >
                        Back to Users
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const { user, profile } = data;
    const initials = (profile?.fullName || user.name || user.email || "?").split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase();

    const isActive = data?.user?.status === 'active';

    return (
        <AdminLayout>
            {/* Header / Breadcrumbs */}
            <div className="flex items-center justify-between mb-8 fadeIn">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="group flex items-center space-x-2 text-gray-500 hover:text-teal-600 transition-colors font-bold"
                >
                    <div className="p-2 rounded-xl bg-white border border-gray-100 group-hover:border-teal-100 group-hover:bg-teal-50 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span>User Management</span>
                </button>

                <div className="flex items-center space-x-4">
                    {user.role === 'doctor' && profile?.verificationStatus === 'pending' && (
                        <button
                            onClick={handleVerifyDoctor}
                            disabled={updating}
                            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition shadow-lg bg-teal-600 text-white hover:bg-teal-700 shadow-teal-900/10 disabled:opacity-50"
                        >
                            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                            <span>Approve Doctor</span>
                        </button>
                    )}
                    <button
                        onClick={handleToggleStatus}
                        disabled={updating}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition shadow-lg ${user.status === 'active'
                            ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-900/10'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/10'
                            } disabled:opacity-50`}
                    >
                        {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                        <span>{user.status === 'active' ? 'Suspend Account' : 'Activate Account'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fadeIn">
                {/* Left Column: Basic Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 bg-teal-100 rounded-3xl flex items-center justify-center text-teal-700 text-4xl font-bold shadow-lg shadow-teal-900/5">
                                {initials}
                            </div>
                            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg ${user.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                }`}>
                                {user.status === 'active' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{profile?.fullName || user.name || "N/A"}</h3>
                        <p className="text-gray-500 font-medium mb-4 flex items-center justify-center space-x-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-tight">
                                {user.role}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm">ID: {user._id.slice(-6).toUpperCase()}</span>
                        </p>

                        <div className="pt-6 border-t border-gray-50 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 font-medium">Joined Platform</span>
                                <span className="text-gray-700 font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 font-medium">Verification</span>
                                <span className={`font-bold ${(profile?.verificationStatus === 'verified' || profile?.status === 'ACTIVE')
                                    ? 'text-emerald-600'
                                    : 'text-amber-600'
                                    } uppercase text-[10px]`}>
                                    {profile?.verificationStatus || profile?.status || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats/Activity */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-teal-600" />
                            <span>System Activity</span>
                        </h4>
                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-gray-400 font-medium text-[10px] uppercase mb-1">Last Login</p>
                                <p className="text-gray-700 font-bold">Today, 10:45 AM</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-gray-400 font-medium text-[10px] uppercase mb-1">IP Address</p>
                                <p className="text-gray-700 font-bold">192.168.1.1</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info & Role Specifics */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Role Specific Sections */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gray-50/50 border-b border-gray-50">
                            <h4 className="font-bold text-gray-900">Professional Profile</h4>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Contact */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                                        <div className="flex items-center space-x-3 group">
                                            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700">{user.email}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-gray-700">{profile?.phone || "N/A"}</span>
                                        </div>
                                    </div>
                                    {profile?.address && (
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Address</label>
                                            <div className="flex items-center space-x-3">
                                                <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-gray-700">{profile.address}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Role Specific Details */}
                                <div className="space-y-6">
                                    {(user.role === 'doctor' || user.role === 'therapist') && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Specialization</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                        <Award className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-700">{profile?.specialization || "General Medicine"}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">License/NMC Number</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                        <Shield className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-700">{profile?.nmcLicense || profile?.licenseNumber || "Pending"}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {user.role === 'patient' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Birth Date / Gender</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-700">
                                                        {profile?.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"} • {profile?.gender || "Not Set"}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {user.role === 'clinic' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Subscription</label>
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-gray-700">{profile?.subscriptionPlan || "N/A"} ({profile?.subscriptionStatus || "Inactive"})</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    to={`/admin/clinics/${profile?._id}`}
                                                    className="w-full mt-4 flex items-center justify-center space-x-2 bg-teal-50 text-teal-700 py-3 rounded-2xl font-bold hover:bg-teal-100 transition"
                                                >
                                                    <Briefcase className="w-5 h-5" />
                                                    <span>View Clinic Entity</span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio or Additional Details */}
                    {(profile?.bio || profile?.description) && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">About / Profile Bio</label>
                            <p className="text-gray-600 leading-relaxed font-medium italic">
                                "{profile.bio || profile.description}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.type === 'verify' ? 'Verify Doctor' : isActive ? 'Suspend Account' : 'Activate Account'}
                message={confirmModal.type === 'verify'
                    ? 'This will allow the doctor to appear in patient search results.'
                    : `Are you sure you want to ${isActive ? 'suspend' : 'activate'} this user's account?`
                }
                confirmText={confirmModal.type === 'verify' ? 'Yes, Verify' : isActive ? 'Yes, Suspend' : 'Yes, Activate'}
                confirmVariant={confirmModal.type === 'verify' ? 'success' : isActive ? 'warning' : 'success'}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmModal({ isOpen: false, type: null })}
            />
        </AdminLayout>
    );
};

export default AdminUserDetails;
