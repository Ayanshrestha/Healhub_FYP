import axios from "axios";

const AUTH_API = "http://localhost:5000/api/auth";
const ADMIN_API = "http://localhost:5000/api/admin";

// Auth
export const adminLoginAPI = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_API}/admin/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An unexpected error occurred" };
    }
};

export const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
};

export const getAdminSession = () => {
    try {
        const token = localStorage.getItem("adminToken");
        const userJson = localStorage.getItem("adminUser");
        const user = userJson ? JSON.parse(userJson) : null;
        if (token && user?.role === "admin") {
            return { token, user };
        }
    } catch (_) {
        // Invalid or missing adminUser in localStorage
    }
    return null;
};

// Governance & Dashboard
const getHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
});

export const getDashboardStats = async () => {
    try {
        const response = await axios.get(`${ADMIN_API}/dashboard/stats`, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch stats" };
    }
};

export const getSystemData = async (type) => {
    try {
        let path = "";
        switch (type) {
            case "users": path = "/users/list"; break;
            case "clinics": path = "/clinics/list"; break;
            case "logs": path = "/logs/list"; break;
            default: path = `/data/${type}`;
        }
        const response = await axios.get(`${ADMIN_API}${path}`, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: `Failed to fetch ${type}` };
    }
};

export const updateClinicStatus = async (clinicId, status) => {
    try {
        const response = await axios.patch(`${ADMIN_API}/clinics/${clinicId}/status`, { status }, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Action failed" };
    }
};

export const getClinicDetailsAPI = async (clinicId) => {
    try {
        const response = await axios.get(`${ADMIN_API}/clinics/${clinicId}`, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch clinic details" };
    }
};

export const toggleUserStatus = async (userId) => {
    try {
        const response = await axios.patch(`${ADMIN_API}/users/${userId}/toggle-status`, {}, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update user status" };
    }
};

export const getUserDetailsAPI = async (userId) => {
    try {
        const response = await axios.get(`${ADMIN_API}/users/${userId}`, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch user details" };
    }
};

export const getAnalytics = async () => {
    try {
        const response = await axios.get(`${ADMIN_API}/analytics/growth`, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch analytics" };
    }
};

export const exportLogs = async () => {
    try {
        const response = await axios.get(`${ADMIN_API}/logs/export`, {
            ...getHeader(),
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        throw error.response?.data || { message: "Failed to export logs" };
    }
};

// Notifications
export const getNotifications = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/notifications`, getHeader());
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch notifications" };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to mark read" };
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const response = await axios.patch(`http://localhost:5000/api/notifications/read-all`, {}, getHeader());
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to mark all read" };
    }
};
