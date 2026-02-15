import express from "express";
import * as providerController from "../../controllers/provider/providerController.js";
import * as affiliationController from "../../controllers/provider/affiliationController.js";
import * as appointmentController from "../../controllers/provider/appointmentController.js";
import * as messagingController from "../../controllers/provider/messagingController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import roleMiddleware from "../../middlewares/roleMiddleware.js";
import upload from "../../config/multerConfig.js";

const router = express.Router();

// All routes require authentication and proper role
router.use(authMiddleware);
router.use(roleMiddleware(["doctor", "therapist"]));

// Dashboard & Profile
router.get("/dashboard", providerController.getDashboardStats);
router.get("/profile", providerController.getProfile);
router.patch("/profile", providerController.updateProfile);
router.post("/profile/photo", upload.single("photo"), providerController.uploadProfilePhoto);

// Affiliations (Clinic links)
router.get("/affiliations", affiliationController.getMyAffiliations);
router.post("/apply", affiliationController.applyToClinic);
router.patch("/affiliations", affiliationController.updateAffiliation);

// Appointments
router.get("/appointments", appointmentController.getAppointments);
router.get("/appointments/:appointmentId", appointmentController.getAppointmentDetails);
router.patch("/appointments/:appointmentId/status", appointmentController.updateAppointmentStatus);
router.patch("/appointments/:appointmentId/reschedule", appointmentController.rescheduleAppointment);

// Messaging
router.get("/messages/:appointmentId", messagingController.getHistory);
router.post("/messages", messagingController.sendMessage);

// Earnings
router.get("/earnings", providerController.getEarnings);

// Discovery
router.get("/search-clinics", providerController.searchClinics);

export default router;
