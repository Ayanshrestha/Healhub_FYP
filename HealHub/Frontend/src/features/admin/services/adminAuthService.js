import api from "../../../services/api";

// Auth
export const adminLoginAPI = async (credentials) => {
    try {
        const response = await api.post("/auth/admin/login", credentials);
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
export const getDashboardStats = async () => {
    try {
        const response = await api.get("/admin/dashboard/stats");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch stats" };
    }
};

export const getSystemData = async (type, options = {}) => {
    try {
        let path = "";
        switch (type) {
            case "users": path = "/admin/users/list"; break;
            case "clinics": path = "/admin/clinics/list"; break;
            case "logs": path = "/admin/logs/list"; break;
            default: path = `/admin/data/${type}`;
        }
        const response = await api.get(path, { params: options });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: `Failed to fetch ${type}` };
    }
};


export const updateClinicStatus = async (clinicId, status) => {
    try {
        const response = await api.patch(`/admin/clinics/${clinicId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Action failed" };
    }
};

export const getClinicDetailsAPI = async (clinicId) => {
    try {
        const response = await api.get(`/admin/clinics/${clinicId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch clinic details" };
    }
};

export const toggleUserStatus = async (userId) => {
    try {
        const response = await api.patch(`/admin/users/${userId}/toggle-status`, {});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update user status" };
    }
};

export const verifyDoctorAPI = async (userId) => {
    try {
        const response = await api.patch(`/admin/users/${userId}/verify-doctor`, {});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to verify doctor" };
    }
};

export const getUserDetailsAPI = async (userId) => {
    try {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch user details" };
    }
};

export const getAnalytics = async () => {
    try {
        const response = await api.get("/admin/analytics/growth");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch analytics" };
    }
};

export const exportLogs = async () => {
    try {
        const response = await api.get("/admin/logs/export", {
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
        const response = await api.get("/notifications");
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch notifications" };
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await api.patch(`/notifications/${id}/read`, {});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to mark read" };
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const response = await api.patch("/notifications/read-all", {});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to mark all read" };
    }
};
