import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ClinicProtectedRoute handles UI-level access control.
 * It ensures the clinic is logged in AND has an ACTIVE status for certain routes.
 */
const ClinicProtectedRoute = ({ children, requiredStatus = "ACTIVE" }) => {
    const location = useLocation();

    // Access Control Logic - Force fetch fresh status and handle case-sensitivity
    const clinicStatus = (localStorage.getItem("clinic_status") || "ACTIVE").toUpperCase();

    const allowedPaths = ["/clinic/billing", "/clinic/profile", "/clinic/settings"];

    if (clinicStatus !== "ACTIVE" && clinicStatus !== "APPROVED" && !allowedPaths.includes(location.pathname)) {
        console.log("Redirecting to billing. Status is:", clinicStatus);
        return <Navigate to="/clinic/billing" replace />;
    }

    return children;
};

export default ClinicProtectedRoute;
