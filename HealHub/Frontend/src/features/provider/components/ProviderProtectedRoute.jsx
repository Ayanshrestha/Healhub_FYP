import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProviderProtectedRoute handles UI-level access control for Doctors and Therapists.
 * It ensures the provider is logged in and has the correct role.
 */
const ProviderProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("provider_token");
    const userJson = localStorage.getItem("user");

    let user = null;
    try {
        user = userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage");
    }

    const isAuthenticated = !!token;
    const isProvider = user && (user.role === "doctor" || user.role === "therapist");

    if (!isAuthenticated || !isProvider) {
        console.log("Access denied to provider route. Authenticated:", isAuthenticated, "Provider:", isProvider);
        // Clear tokens to be safe if auth failed
        if (!isAuthenticated) {
            localStorage.removeItem("provider_token");
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProviderProtectedRoute;
