import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/provider";

const getAuthHeaders = () => {
    const token = localStorage.getItem("provider_token");
    if (!token) return {};
    return {
        Authorization: `Bearer ${token}`
    };
};

/**
 * Session Management
 */
export const getProviderSession = () => {
    try {
        const token = localStorage.getItem("provider_token");
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        if (token && (user?.role === "doctor" || user?.role === "therapist")) {
            return { token, user };
        }
    } catch (_) {
        // Invalid or missing session in localStorage
    }
    return null;
};

/**
 * Provider Dashboard & General Stats
 */
export const getDashboardStats = async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

/**
 * Provider Profile Management
 */
export const getProviderProfile = async () => {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const updateProviderProfile = async (profileData) => {
    const response = await axios.patch(`${API_BASE_URL}/profile`, profileData, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await axios.post(`${API_BASE_URL}/profile/photo`, formData, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * Clinic Affiliations
 */
export const getMyAffiliations = async () => {
    const response = await axios.get(`${API_BASE_URL}/affiliations`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const applyToClinic = async (clinicId) => {
    const response = await axios.post(`${API_BASE_URL}/apply`, { clinicId }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const respondToAffiliation = async (affiliationId, status) => {
    const response = await axios.patch(`${API_BASE_URL}/affiliations`, { affiliationId, status }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const searchClinics = async (query) => {
    const response = await axios.get(`${API_BASE_URL}/search-clinics`, {
        params: { query },
        headers: getAuthHeaders()
    });
    return response.data;
};

/**
 * Appointment Management
 */
export const getAppointments = async (filters = {}) => {
    const response = await axios.get(`${API_BASE_URL}/appointments`, {
        params: filters,
        headers: getAuthHeaders()
    });
    return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    const response = await axios.patch(`${API_BASE_URL}/appointments/${appointmentId}/status`, { status }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const rescheduleAppointment = async (appointmentId, data) => {
    const response = await axios.patch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, data, {
        headers: getAuthHeaders()
    });
    return response.data;
};

/**
 * Clinical Messaging
 */
export const getMessageHistory = async (appointmentId) => {
    const response = await axios.get(`${API_BASE_URL}/messages/${appointmentId}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const sendMessage = async (messageData) => {
    const response = await axios.post(`${API_BASE_URL}/messages`, messageData, {
        headers: getAuthHeaders()
    });
    return response.data;
};

/**
 * Earnings
 */
export const getEarnings = async () => {
    const response = await axios.get(`${API_BASE_URL}/earnings`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

/**
 * Settings & Security
 */
export const updatePreferences = async (preferences) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/profile/preferences`, { preferences }, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update preferences" };
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/profile/change-password`, passwordData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to change password" };
    }
};

/**
 * Notifications
 */
export const getNotifications = async () => {
    const response = await axios.get("http://localhost:5000/api/notifications", {
        headers: getAuthHeaders()
    });
    return response.data.data;
};

export const markNotificationRead = async (id) => {
    const response = await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await axios.patch("http://localhost:5000/api/notifications/read-all", {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

