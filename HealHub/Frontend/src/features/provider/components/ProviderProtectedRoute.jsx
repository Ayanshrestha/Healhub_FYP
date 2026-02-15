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

    // Robust check: Redirect ONLY if token is missing or role is definitely wrong.
    // If token exists, we let axios interceptors handle 401/expired states.
    if (!isAuthenticated || !isProvider) {
        console.warn("🔐 Access denied: Redirecting to login. Authenticated:", isAuthenticated, "Provider:", isProvider);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProviderProtectedRoute;
