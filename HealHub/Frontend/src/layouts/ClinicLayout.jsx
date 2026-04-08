import React from "react";
import ClinicNavbar from "../features/clinic/components/ClinicNavbar";
import { AlertCircle } from "lucide-react";

const ClinicLayout = ({ children, status }) => {
    const currentStatus = status || localStorage.getItem("clinic_status") || "ACTIVE";
    const isExpiring = currentStatus === "SUBSCRIPTION_EXPIRING";
    const isInactive = currentStatus === "INACTIVE" || currentStatus === "APPROVED_UNPAID";

    return (
        <div className="min-h-screen bg-slate-50 font-primary flex flex-col">
            <ClinicNavbar />

            {isExpiring && (
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-3">
                    <div className="w-full flex items-center justify-between text-amber-800 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>Your subscription expires in 3 days. Renew now to avoid service interruption.</span>
                        </div>
                        <button className="px-4 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">Renew</button>
                    </div>
                </div>
            )}

            {isInactive && (
                <div className="bg-red-50 border-b border-red-100 px-4 py-3">
                    <div className="w-full flex items-center justify-between text-red-800 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>Subscription Inactive. Dashboard access is limited.</span>
                        </div>
                        <button className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Pay Now</button>
                    </div>
                </div>
            )}

            <main className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 animate-fadeIn">
                {children}
            </main>

            <footer className="bg-white/50 border-t border-gray-100 py-8 mt-auto">
                <div className="w-full px-4 text-center">
                    <p className="text-gray-500 text-xs font-semibold">
                        © {new Date().getFullYear()} HealHub Healthcare Systems. Clinic Portal.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ClinicLayout;
