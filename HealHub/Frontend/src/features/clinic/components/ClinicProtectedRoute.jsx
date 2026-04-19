import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import clinicService from "../services/clinicService";

/**
 * ClinicProtectedRoute handles UI-level access control.
 * It ensures the clinic is logged in AND has an ACTIVE status for certain routes.
 */
const ClinicProtectedRoute = ({ children }) => {
    const location = useLocation();
    const cachedStatus = localStorage.getItem("clinic_status");
    const [status, setStatus] = useState(cachedStatus);
    // Only show loading spinner if we have a token but no cached status yet
    const [loading, setLoading] = useState(!cachedStatus && !!localStorage.getItem("clinic_token"));
    // Prevent re-fetching on every route change — fetch only once per mount
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchStatus = async () => {
            const token = localStorage.getItem("clinic_token");
            const existingStatus = localStorage.getItem("clinic_status");

            // Only hit the API if we lack a reliable cached status
            if (token && (!existingStatus || (existingStatus !== "ACTIVE" && existingStatus !== "APPROVED"))) {
                try {
                    console.log("[ClinicProtectedRoute] Syncing clinic status from API...");
                    const data = await clinicService.getProfile();
                    const clinicData = data?.clinic || data;
                    const newStatus = (clinicData?.status || "PENDING_APPROVAL").toUpperCase();

                    console.log("[ClinicProtectedRoute] New status fetched:", newStatus);
                    localStorage.setItem("clinic_status", newStatus);
                    setStatus(newStatus);
                } catch (error) {
                    console.error("[ClinicProtectedRoute] Failed to fetch fresh status:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []); // Run ONCE on mount only — path changes must NOT reset loading state

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

    if (clinicStatus !== "ACTIVE" && clinicStatus !== "APPROVED" && !allowedPaths.includes(location.pathname)) {
        if (clinicStatus === "APPROVED_UNPAID") {
            // Avoid redirecting to a path we're already on
            if (location.pathname !== "/clinic/subscription") {
                return <Navigate to="/clinic/subscription" replace />;
            }
        } else {
            if (location.pathname !== "/clinic/billing") {
                console.log("[ClinicProtectedRoute] Redirecting to billing. Status:", clinicStatus);
                return <Navigate to="/clinic/billing" replace />;
            }
        }
    }

    return children;
};

export default ClinicProtectedRoute;
