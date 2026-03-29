import React, { useState, useEffect } from "react";
import ClinicLayout from "../../../layouts/ClinicLayout";
import { CreditCard, History, Shield, Download, Loader2 } from "lucide-react";
import clinicService from "../services/clinicService";
import { toast } from "react-hot-toast";

const SubscriptionBillingPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await clinicService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching billing info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <ClinicLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
                </div>
            </ClinicLayout>
        );
    }

    const expiryDate = profile?.subscriptionEndDate ? new Date(profile.subscriptionEndDate).toLocaleDateString() : "Not Set";

    return (
        <ClinicLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Billing & Membership</h1>
                    <p className="text-gray-500 font-bold mt-1">Manage your facility's subscription and payment ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Plan Card */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">{profile?.subscriptionPlan || "Standard"} Tier</h3>
                                    <p className="text-teal-600 font-bold text-xs uppercase tracking-widest mt-1">Status: {profile?.status === "ACTIVE" ? "Active Membership" : "Pending Verification"}</p>
                                </div>
                            </div>
                            <span className="text-3xl font-black text-gray-900">
                                {profile?.subscriptionPlan === "PREMIUM" ? "Rs. 10,000" : "Rs. 5,000"}
                                <span className="text-sm font-bold text-gray-400">/mo</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Expiry/Renewal Date</p>
                                <p className="text-lg font-bold text-gray-800">{expiryDate}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Clinic Name</p>
                                <p className="text-lg font-bold text-gray-800">{profile?.clinicName}</p>
                            </div>
                        </div>

                        {/* Conditional Payment Action */}
                        {(profile?.status === "APPROVED_UNPAID" || profile?.status === "BLOCKED") ? (
                            <button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        // Default to standard plan for now, or use logic to select plan
                                        const planName = profile?.subscriptionPlan === "PREMIUM" ? "PREMIUM" : "STANDARD";
                                        const response = await clinicService.initiateSubscription(planName);

                                        if (response.payment_url) {
                                            window.location.href = response.payment_url;
                                        } else {
                                            toast.error("Failed to initiate payment. Please try again.");
                                            setLoading(false);
                                        }
                                    } catch (error) {
                                        console.error("Payment initiation failed:", error);
                                        toast.error(error.response?.data?.message || "Payment failed to start.");
                                        setLoading(false);
                                    }
                                }}
                                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm hover:bg-teal-700 transition shadow-lg shadow-teal-100 flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pay securely with Khalti"}
                            </button>
                        ) : profile?.status === "PENDING_APPROVAL" ? (
                            <div className="w-full py-6 bg-amber-50 border-2 border-amber-100 rounded-2xl text-center">
                                <p className="text-amber-800 font-black uppercase tracking-widest text-xs mb-1">Verification Pending</p>
                                <p className="text-amber-600 text-sm font-bold">Your account is under review by the administrator.</p>
                                <p className="text-amber-600/60 text-xs mt-2 font-medium">Payment will be enabled once approved.</p>
                            </div>
                        ) : (
                            <div className="w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-gray-400 font-bold text-sm">
                                Status: <span className="uppercase">{profile?.status?.replace(/_/g, " ")}</span>
                            </div>
                        )}
                    </div>

                    {/* Payment Method Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                            <CreditCard className="w-5 h-5" />
                            <span>Payment Source</span>
                        </h3>
                        <div className="p-6 bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl text-white mb-6 shadow-lg shadow-teal-100">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-8">Connected Wallet</p>
                            <p className="text-xl font-bold tracking-widest mb-2 font-mono">•••• •••• •••• 5678</p>
                            <div className="flex justify-between items-center opacity-80 pt-4 border-t border-white/10 mt-4">
                                <span className="text-xs font-bold">{profile?.ownerName}</span>
                                <span className="text-xs font-bold uppercase">Khalti Verified</span>
                            </div>
                        </div>

                        <button className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                            Switch Gateway
                        </button>
                    </div>
                </div>

                {/* Billing History Table */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                        <History className="w-5 h-5 text-teal-600" />
                        <span>Transaction History</span>
                    </h3>
                    <div className="space-y-4 text-center py-12">
                        <History className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold italic">Transaction history will be available once live payments are processed.</p>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
};

export default SubscriptionBillingPage;
