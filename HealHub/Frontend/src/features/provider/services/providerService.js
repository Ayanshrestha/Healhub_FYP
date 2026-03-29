import api from "../../../services/api";

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
    const response = await api.get("/provider/dashboard");
    return response.data;
};

/**
 * Provider Profile Management
 */
export const getProviderProfile = async () => {
    const response = await api.get("/provider/profile");
    return response.data;
};

export const updateProviderProfile = async (profileData) => {
    const response = await api.patch("/provider/profile", profileData);
    return response.data;
};

export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.post("/provider/profile/photo", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * Clinic Affiliations
 */
export const getMyAffiliations = async () => {
    const response = await api.get("/provider/affiliations");
    return response.data;
};

export const applyToClinic = async (clinicId) => {
    const response = await api.post("/provider/apply", { clinicId });
    return response.data;
};

export const respondToAffiliation = async (affiliationId, status) => {
    const response = await api.patch("/provider/affiliations", { affiliationId, status });
    return response.data;
};

export const searchClinics = async (query) => {
    const response = await api.get("/provider/search-clinics", {
        params: { query }
    });
    return response.data;
};

/**
 * Appointment Management
 */
export const getAppointments = async (filters = {}) => {
    const response = await api.get("/provider/appointments", {
        params: filters
    });
    return response.data;
};

export const getAppointmentDetails = async (appointmentId) => {
    const response = await api.get(`/provider/appointments/${appointmentId}`);
    return response.data.appointment;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    const response = await api.patch(`/provider/appointments/${appointmentId}/status`, { status });
    return response.data;
};

export const rescheduleAppointment = async (appointmentId, data) => {
    const response = await api.patch(`/provider/appointments/${appointmentId}/reschedule`, data);
    return response.data;
};

export const uploadClinicalAttachments = async (appointmentId, files, fileType) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("fileType", fileType);

    const response = await api.post(`/provider/appointments/${appointmentId}/attachments`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * Clinical Messaging
 */
export const getMessageHistory = async (appointmentId) => {
    const response = await api.get(`/provider/messages/${appointmentId}`);
    return response.data;
};

export const sendMessage = async (messageData) => {
    const response = await api.post("/provider/messages", messageData);
    return response.data;
};


export const markMessagesRead = async (appointmentId) => {
    const response = await api.patch(`/provider/messages/${appointmentId}/read`);
    return response.data;
};

export const uploadFile = async (formData) => {
    const response = await api.post("/provider/messages/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};


/**
 * Earnings
 */
export const getEarnings = async () => {
    const response = await api.get("/provider/earnings");
    return response.data;
};

/**
 * Settings & Security
 */
export const updatePreferences = async (preferences) => {
    const response = await api.patch("/provider/profile/preferences", { preferences });
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.post("/provider/profile/change-password", passwordData);
    return response.data;
};

/**
 * Notifications
 */
export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};


