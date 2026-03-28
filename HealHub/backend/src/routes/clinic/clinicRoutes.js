import express from "express";
import * as clinicDashboardController from "../../controllers/clinic/clinicDashboardController.js";
import * as clinicDoctorController from "../../controllers/clinic/clinicDoctorController.js";
import * as clinicAppointmentController from "../../controllers/clinic/clinicAppointmentController.js";
import * as clinicPatientController from "../../controllers/clinic/clinicPatientController.js";
import * as clinicProfileController from "../../controllers/clinic/clinicProfileController.js";
import * as clinicNotificationController from "../../controllers/clinic/clinicNotificationController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clinicStatusMiddleware from "../../middlewares/clinicStatusMiddleware.js";
import roleMiddleware from "../../middlewares/roleMiddleware.js";

import * as clinicMessagingController from "../../controllers/clinic/clinicMessagingController.js";
import upload from "../../config/multerConfig.js";

const router = express.Router();

// All routes require auth and clinic role
router.use(authMiddleware);
router.use(roleMiddleware("clinic"));

// Profile (Always accessible for authenticated clinics)
router.get("/profile", clinicProfileController.getProfile);
router.patch("/profile", clinicProfileController.updateProfile);
router.post("/profile/images", upload.fields([
    { name: "clinicImage", maxCount: 1 },
    { name: "clinicLogo", maxCount: 1 }
]), clinicProfileController.uploadImages);
router.patch("/settings/preferences", clinicProfileController.updatePreferences);
router.patch("/settings/change-password", clinicProfileController.changePassword);

// Enforce ACTIVE status for all other routes
router.use(clinicStatusMiddleware);

// Dashboard
router.get("/stats", clinicDashboardController.getStats);
router.get("/analytics", clinicDashboardController.getAnalytics);

// Doctors
router.get("/doctors", clinicDoctorController.getDoctors);
router.get("/doctors/available", clinicDoctorController.getAvailableDoctors);
router.get("/doctors/applications", clinicDoctorController.getApplications);
router.get("/doctors/:doctorId", clinicDoctorController.getDoctorDetails); // Public profile for clinic
router.patch("/doctors/verify", clinicDoctorController.verifyDoctor);
router.patch("/doctors/affiliations", clinicDoctorController.handleAffiliation);
router.post("/doctors/invite", clinicDoctorController.inviteDoctor);
router.delete("/doctors/:doctorId", clinicDoctorController.deleteDoctor);

// Appointments
router.get("/appointments", clinicAppointmentController.getAppointments);
router.patch("/appointments/:appointmentId/status", clinicAppointmentController.updateStatus);

// Patients
router.get("/patients", clinicPatientController.getPatients);
router.get("/patients/:patientId/history", clinicPatientController.getHistory);

// Notifications
router.get("/notifications", clinicNotificationController.getNotifications);
router.patch("/notifications/:notificationId/read", clinicNotificationController.readNotification);

// Messaging
router.get("/messages/unread-counts", clinicMessagingController.getUnreadCounts);
router.get("/messages/:appointmentId", clinicMessagingController.getHistory);
router.post("/messages", clinicMessagingController.sendMessage);
router.patch("/messages/:appointmentId/read", clinicMessagingController.markRead);
router.post("/messages/upload", upload.single("attachment"), clinicMessagingController.uploadFile);

export default router;
