import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get clinic token
const getClinicToken = () => {
    return localStorage.getItem("clinic_token");
};

// Create axios instance with auth
const clinicApi = axios.create({
    baseURL: `${API_URL}/clinic`,
});

clinicApi.interceptors.request.use((config) => {
    const token = getClinicToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const clinicService = {
    // Dashboard Stats
    getDashboardStats: async () => {
        const response = await clinicApi.get("/stats");
        return response.data.stats;
    },

    getAnalytics: async () => {
        const response = await clinicApi.get("/analytics");
        return response.data.analytics;
    },

    // Doctors
    getDoctors: async () => {
        const response = await clinicApi.get("/doctors");
        return response.data.doctors;
    },

    verifyDoctor: async (doctorId, status) => {
        const response = await clinicApi.patch("/doctors/verify", { doctorId, status });
        return response.data.doctor;
    },

    getDoctorDetails: async (doctorId) => {
        const response = await clinicApi.get(`/doctors/${doctorId}`);
        return response.data.doctor;
    },

    getAffiliationApplications: async () => {
        const response = await clinicApi.get("/doctors/applications");
        return response.data.applications;
    },

    getAvailableDoctors: async (specialization = "") => {
        const response = await clinicApi.get("/doctors/available", { params: { specialization } });
        return response.data.doctors;
    },

    inviteDoctor: async (providerId) => {
        const response = await clinicApi.post("/doctors/invite", { providerId, providerType: "Doctor" });
        return response.data.affiliation;
    },

    handleAffiliation: async (affiliationId, status) => {
        const response = await clinicApi.patch("/doctors/affiliations", { affiliationId, status });
        return response.data.affiliation;
    },

    removeDoctor: async (doctorId) => {
        const response = await clinicApi.delete(`/doctors/${doctorId}`);
        return response.data;
    },

    // Appointments
    getAppointments: async (filters = {}) => {
        const response = await clinicApi.get("/appointments", { params: filters });
        return response.data.appointments;
    },

    updateAppointmentStatus: async (appointmentId, status) => {
        const response = await clinicApi.patch(`/appointments/${appointmentId}/status`, { status });
        return response.data.appointment;
    },

    // Profile/Settings
    updateProfile: async (profileData) => {
        const response = await clinicApi.patch("/profile", profileData);
        return response.data.clinic;
    },

    updatePreferences: async (preferences) => {
        const response = await clinicApi.patch("/settings/preferences", { preferences });
        return response.data.clinic;
    },

    changePassword: async (passwordData) => {
        const response = await clinicApi.patch("/settings/change-password", passwordData);
        return response.data.success;
    },

    // Patients
    getPatients: async () => {
        const response = await clinicApi.get("/patients");
        return response.data.patients;
    },

    getPatientHistory: async (patientId) => {
        const response = await clinicApi.get(`/patients/${patientId}/history`);
        return response.data.history;
    },

    // Notifications
    getNotifications: async () => {
        const response = await clinicApi.get("/notifications");
        return response.data.notifications;
    },

    markNotificationRead: async (notificationId) => {
        const response = await clinicApi.patch(`/notifications/${notificationId}/read`);
        return response.data.notification;
    },

    markAllNotificationsRead: async () => {
        const response = await clinicApi.patch("/notifications/read-all");
        return response.data.success;
    },

    // Profile/Billing (Using existing profile routes)
    getProfile: async () => {
        const response = await clinicApi.get("/profile");
        console.log("[clinicService] Profile data received:", response.data);
        return response.data;
    },

    // Subscription
    initiateSubscription: async (planName) => {
        const response = await clinicApi.post("/payment/initiate", { plan: planName });
        return response.data;
    }
};

export default clinicService;
