import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import clinicService from "../services/clinicService";

/**
 * ClinicProtectedRoute handles UI-level access control.
 * It ensures the clinic is logged in AND has an ACTIVE status for certain routes.
 */
const ClinicProtectedRoute = ({ children }) => {
    const location = useLocation();
    const [status, setStatus] = useState(localStorage.getItem("clinic_status"));
    const [loading, setLoading] = useState(!status && !!localStorage.getItem("clinic_token"));

    useEffect(() => {
        const fetchStatus = async () => {
            const token = localStorage.getItem("clinic_token");

            // If we have a token but no status, or if we have it but it's not active, 
            // we should try to sync from API (at least once on mount)
            if (token && (!status || (status !== "ACTIVE" && status !== "APPROVED"))) {
                try {
                    console.log("[ClinicProtectedRoute] Syncing clinic status from API...");
                    const data = await clinicService.getProfile();

                    // The clinicService.getProfile returns response.data (which contains .clinic)
                    const clinicData = data?.clinic || data;
                    const newStatus = (clinicData?.status || "PENDING_APPROVAL").toUpperCase();

                    console.log("[ClinicProtectedRoute] New status fetched:", newStatus);
                    localStorage.setItem("clinic_status", newStatus);
                    setStatus(newStatus);
                } catch (error) {
                    console.error("[ClinicProtectedRoute] Failed to fetch fresh status:", error);
                    // If API fails, we stick with what we have (likely triggering the redirect below)
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [location.pathname]); // Re-check on path change to be safe

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    const clinicToken = localStorage.getItem("clinic_token");
    if (!clinicToken) {
        console.warn("[ClinicProtectedRoute] Access Denied: No clinic_token found.");
        return <Navigate to="/login" replace />;
    }

    const clinicStatus = (status || "PENDING_APPROVAL").toUpperCase();
    const allowedPaths = ["/clinic/billing", "/clinic/profile", "/clinic/settings", "/clinic/subscription"];

    // If NOT active/approved and NOT on an allowed public-ish page
    if (clinicStatus !== "ACTIVE" && clinicStatus !== "APPROVED" && !allowedPaths.includes(location.pathname)) {
        if (clinicStatus === "APPROVED_UNPAID") {
            return <Navigate to="/clinic/subscription" replace />;
        }
        console.log("[ClinicProtectedRoute] Redirecting to billing. Status:", clinicStatus);
        return <Navigate to="/clinic/billing" replace />;
    }

    return children;
};

export default ClinicProtectedRoute;
