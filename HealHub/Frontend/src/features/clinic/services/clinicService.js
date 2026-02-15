import api from "../../../services/api";

const clinicService = {
    // Dashboard Stats
    getDashboardStats: async () => {
        const response = await api.get("/clinic/stats");
        return response.data.stats;
    },

    getAnalytics: async () => {
        const response = await api.get("/clinic/analytics");
        return response.data.analytics;
    },

    // Doctors
    getDoctors: async () => {
        const response = await api.get("/clinic/doctors");
        return response.data.doctors;
    },

    verifyDoctor: async (doctorId, status) => {
        const response = await api.patch("/clinic/doctors/verify", { doctorId, status });
        return response.data.doctor;
    },

    getDoctorDetails: async (doctorId) => {
        const response = await api.get(`/clinic/doctors/${doctorId}`);
        return response.data.doctor;
    },

    getAffiliationApplications: async () => {
        const response = await api.get("/clinic/doctors/applications");
        return response.data.applications;
    },

    getAvailableDoctors: async (specialization = "") => {
        const response = await api.get("/clinic/doctors/available", { params: { specialization } });
        return response.data.doctors;
    },

    inviteDoctor: async (providerId) => {
        const response = await api.post("/clinic/doctors/invite", { providerId, providerType: "Doctor" });
        return response.data.affiliation;
    },

    handleAffiliation: async (affiliationId, status) => {
        const response = await api.patch("/clinic/doctors/affiliations", { affiliationId, status });
        return response.data.affiliation;
    },

    removeDoctor: async (doctorId) => {
        const response = await api.delete(`/clinic/doctors/${doctorId}`);
        return response.data;
    },

    // Appointments
    getAppointments: async (filters = {}) => {
        const response = await api.get("/clinic/appointments", { params: filters });
        return response.data.appointments;
    },

    updateAppointmentStatus: async (appointmentId, status) => {
        const response = await api.patch(`/clinic/appointments/${appointmentId}/status`, { status });
        return response.data.appointment;
    },

    // Profile/Settings
    updateProfile: async (profileData) => {
        const response = await api.patch("/clinic/profile", profileData);
        return response.data.clinic;
    },

    updatePreferences: async (preferences) => {
        const response = await api.patch("/clinic/settings/preferences", { preferences });
        return response.data.clinic;
    },

    changePassword: async (passwordData) => {
        const response = await api.patch("/clinic/settings/change-password", passwordData);
        return response.data.success;
    },

    // Patients
    getPatients: async () => {
        const response = await api.get("/clinic/patients");
        return response.data.patients;
    },

    getPatientHistory: async (patientId) => {
        const response = await api.get(`/clinic/patients/${patientId}/history`);
        return response.data.history;
    },

    // Notifications
    getNotifications: async () => {
        const response = await api.get("/notifications");
        return response.data.notifications;
    },

    markNotificationRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data.notification;
    },

    markAllNotificationsRead: async () => {
        const response = await api.patch("/notifications/read-all");
        return response.data.success;
    },

    // Profile/Billing (Using existing profile routes)
    getProfile: async () => {
        const response = await api.get("/clinic/profile");
        console.log("[clinicService] Profile data received:", response.data);
        return response.data;
    },

    // Subscription
    initiateSubscription: async (planName) => {
        // Point to the dedicated payment route that allows APPROVED_UNPAID clinics
        const response = await api.post("/payment/initiate", { plan: planName });
        return response.data;
    }
};

export default clinicService;
