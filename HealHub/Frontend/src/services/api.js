import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Centralized Axios Instance
 * Handles global authentication headers and response interceptors (e.g., 401 Unauthorized)
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Required for HttpOnly cookies if used
});

// Request Interceptor: Attach Token dynamically
api.interceptors.request.use(
    (config) => {
        // Select the appropriate token based on the user's role OR the request URL
        let token = null;
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const role = user?.role?.toLowerCase();
        const url = config.url || "";

        if (role === "admin" || url.includes("/admin/")) {
            token = localStorage.getItem("adminToken");
        } else if (role === "clinic" || url.includes("/clinic/")) {
            token = localStorage.getItem("clinic_token");
        } else if (role === "doctor" || role === "therapist" || url.includes("/provider/")) {
            token = localStorage.getItem("provider_token");
        } else {
            // Default to the standard patient/common token
            token = localStorage.getItem("token");
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (like 401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("🔐 Session Expired or Unauthorized. Redirecting to login...");

            // Clear role-specific tokens on 401
            localStorage.removeItem("provider_token");
            localStorage.removeItem("clinic_token");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirect to login using window.location for hard redirect
            // This ensures all state is cleared and the user is forced to re-auth
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
