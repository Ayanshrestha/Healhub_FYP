import axios from "axios";

export const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").trim();
export const API_BASE_URL = `${BASE_URL}/api`;
export const SOCKET_URL = BASE_URL;

export const getAssetUrl = (path) => {
    if (!path) return "";
    // Since Cloudinary is removed, always prepend BASE_URL for local uploads
    return `${BASE_URL}${path}`;
};


/**
 * Centralized Axios Instance
 * Handles global authentication headers and response interceptors (e.g., 401 Unauthorized)
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Required for HttpOnly cookies if used
    timeout: 60000, // 60s timeout to handle Render Free Tier cold starts (takes ~50 sec to wake up)
});

// Request Interceptor: Attach Token dynamically
api.interceptors.request.use(
    (config) => {
        let token = null;
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");
        const url = config.url || "";
        const pathname = window.location.pathname;

        // Determine active role from path OR user data
        const isAdminPath = url.includes("/admin/") || pathname.startsWith('/admin');
        const isClinicPath = url.includes("/clinic/") || pathname.startsWith('/clinic');
        const isProviderPath = url.includes("/provider/") || pathname.startsWith('/provider');

        // Logic 1: Use Path-based priority
        if (isAdminPath) {
            token = localStorage.getItem("adminToken");
        } else if (isClinicPath) {
            token = localStorage.getItem("clinic_token");
        } else if (isProviderPath) {
            token = localStorage.getItem("provider_token");
        }

        // Logic 2: If no token found by path, use Role-based fallback
        if (!token) {
            const role = (user?.role || adminUser?.role)?.toString().toLowerCase();
            if (role === "admin") token = localStorage.getItem("adminToken");
            else if (role === "clinic") token = localStorage.getItem("clinic_token");
            else if (role === "doctor" || role === "therapist") token = localStorage.getItem("provider_token");
            else token = localStorage.getItem("token");
        }

        // Final Fallback: The legacy/generic 'token' key
        if (!token) {
            token = localStorage.getItem("token");
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Session Management ---

// Guard to prevent multiple concurrent redirects or session wipes
let isLoggingOut = false;

/**
 * Centered logic to clear all storage to prevent session ghosting
 */
export const clearSession = () => {
    if (isLoggingOut) return;
    isLoggingOut = true;

    console.warn("🧹 Clearing all persistent sessions...");
    localStorage.removeItem("provider_token");
    localStorage.removeItem("clinic_token");
    localStorage.removeItem("clinic_status");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Reset the flag after a short delay to allow for fresh logins
    setTimeout(() => {
        isLoggingOut = false;
    }, 2000);
};

// Response Interceptor: Handle Global Errors (like 401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";
        const isLoginPage = window.location.pathname.includes("/login") || window.location.pathname.includes("/admin/login");

        if (status === 401) {
            // If we are already in the process of logging out, just reject
            if (isLoggingOut) return Promise.reject(error);

            // 1. Background Polling Guard: Don't kill session for background noise
            const isBackgroundRequest =
                url.includes("/notifications") ||
                url.includes("/unread-counts") ||
                url.includes("/messages/unread");

            if (isBackgroundRequest) {
                console.warn(`⚠️ Background 401 at ${url} - ignoring to preserve session.`);
                return Promise.reject(error);
            }

            // 2. Auth Page Guard: Don't trigger logout if the failure IS an auth attempt
            const isAuthRequest =
                url.includes("/auth/login") ||
                url.includes("/admin/login") ||
                url.includes("/clinic/auth/login");

            if (isLoginPage || isAuthRequest) {
                return Promise.reject(error);
            }

            // 3. Token Check: If we don't even have a token, we are effectively "logged out"
            const hasAnyToken = !!(
                localStorage.getItem("token") ||
                localStorage.getItem("clinic_token") ||
                localStorage.getItem("provider_token") ||
                localStorage.getItem("adminToken")
            );

            if (!hasAnyToken) {
                if (!isLoginPage) window.location.href = "/login";
                return Promise.reject(error);
            }

            // 4. Critical Block: Session is genuinely expired or invalid
            console.error(`🔴 Session Invalid (401) at ${url}. Triggering logout...`);
            clearSession();

            // Only redirect if we're not already heading there
            if (!isLoginPage) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
