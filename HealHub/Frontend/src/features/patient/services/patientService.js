import api from "../../../services/api";

const patientService = {
    // Profile
    getProfile: async () => {
        const response = await api.get("/user/patient/profile");
        return response.data?.data;
    },

    updateProfile: async (data) => {
        const response = await api.patch("/user/patient/profile", data);
        return response.data?.data;
    },

    uploadProfilePhoto: async (formData) => {
        const response = await api.post("/user/patient/profile/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    // Clinic Discovery
    getClinics: async () => {
        const response = await api.get("/user/patient/clinics");
        return response.data?.data;
    },

    getClinicDetails: async (clinicId) => {
        const response = await api.get(`/user/patient/clinics/${clinicId}`);
        return response.data?.data;
    },

    getClinicDepartments: async (clinicId) => {
        const response = await api.get(`/user/patient/clinics/${clinicId}/departments`);
        return response.data?.data;
    },

    getClinicDoctors: async (clinicId, department) => {
        const response = await api.get(`/user/patient/clinics/${clinicId}/departments/${department}/doctors`);
        return response.data?.data;
    },

    // Appointments
    getDoctorAvailability: async (doctorId, date) => {
        // Hits the backend to check which slots are free
        // API: GET /user/patient/appointments/availability/:doctorId?date=YYYY-MM-DD
        const response = await api.get(`/user/patient/appointments/availability/${doctorId}`, {
            params: { date }
        });
        return response.data?.data;
    },

    getUpcomingAppointments: async () => {
        const response = await api.get("/user/patient/appointments/upcoming");
        return response.data?.data;
    },

    getPastAppointments: async () => {
        const response = await api.get("/user/patient/appointments/past");
        return response.data?.data;
    },

    getAppointmentDetails: async (appointmentId) => {
        const response = await api.get(`/user/patient/appointments/${appointmentId}`);
        return response.data?.data;
    },

    bookAppointment: async (bookingData) => {
        // Sends all booking details (Doctor, Date, Slot, OTP) to backend
        // API: POST /user/patient/appointments/book
        const response = await api.post("/user/patient/appointments/book", bookingData);
        return response.data;
    },

    cancelAppointment: async (appointmentId) => {
        const response = await api.patch(`/user/patient/appointments/${appointmentId}/cancel`);
        return response.data;
    },

    // Messaging
    getMessages: async (appointmentId) => {
        const response = await api.get(`/user/patient/messages/${appointmentId}`);
        return response.data?.data;
    },

    sendMessage: async (appointmentId, content, type = "TEXT", attachments = []) => {
        const response = await api.post(`/user/patient/messages/${appointmentId}`, {
            content,
            type,
            attachments
        });
        return response.data?.data;
    },

    markMessagesRead: async (appointmentId) => {
        const response = await api.patch(`/user/patient/messages/${appointmentId}/read`);
        return response.data;
    },

    // Medicine Reminders
    getReminders: async () => {
        const response = await api.get("/user/patient/reminders");
        return response.data?.data;
    },

    addReminder: async (data) => {
        const response = await api.post("/user/patient/reminders", data);
        return response.data?.data;
    },

    updateReminder: async (id, data) => {
        const response = await api.patch(`/user/patient/reminders/${id}`, data);
        return response.data?.data;
    },

    deleteReminder: async (id) => {
        const response = await api.delete(`/user/patient/reminders/${id}`);
        return response.data;
    },

    // Reports
    getReports: async () => {
        const response = await api.get("/user/patient/reports");
        return response.data?.data;
    },

    // Notifications
    getNotifications: async () => {
        const response = await api.get("/notifications");
        return response.data?.data;
    },

    markNotificationRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data?.data;
    },

    markAllNotificationsRead: async () => {
        const response = await api.patch("/notifications/read-all");
        return response.data;
    },

    // OTP
    sendOtp: async (phone) => {
        const response = await api.post("/otp/send", { phone });
        return response.data;
    },

    verifyOtp: async (phone, otp, deleteAfter = true) => {
        const response = await api.post("/otp/verify", { phone, otp, deleteAfter });
        return response.data;
    },

    // Payments
    verifyPayment: async (pidx) => {
        const response = await api.post("/payment/verify", { pidx });
        return response.data;
    },

    markDoseStatus: async (reminderId, logData) => {
        const response = await api.patch(`/user/patient/reminders/${reminderId}/status`, logData);
        return response.data;
    },

    // Settings & Security
    updatePreferences: async (preferences) => {
        const response = await api.patch("/user/patient/profile/preferences", { preferences });
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.post("/user/patient/profile/change-password", passwordData);
        return response.data;
    }
};

export default patientService;
