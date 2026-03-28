import express from "express";
import * as appointmentController from "../../controllers/user/appointmentController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// All appointment routes require patient role
router.use(authMiddleware, allowRoles("patient"));

router.get("/availability/:doctorId", appointmentController.getAvailability); // Public check for slots
router.post("/request-otp", appointmentController.requestOtp); // Step 1 of Booking
router.post("/book", appointmentController.bookAppointment); // Final Step: Validates OTP & Creates Appt

// History and Management
router.get("/upcoming", appointmentController.listUpcoming);
router.get("/past", appointmentController.listPast);
router.get("/:id", appointmentController.getDetails);
router.patch("/:id/cancel", appointmentController.cancel);
router.post("/:id/reinitiate-payment", appointmentController.reinitiatePayment);
router.patch("/:id/switch-to-clinic", appointmentController.switchToClinic);

export default router;
