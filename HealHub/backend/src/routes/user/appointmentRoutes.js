import express from "express";
import * as appointmentController from "../../controllers/user/appointmentController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// All appointment routes require patient role
router.use(authMiddleware, allowRoles("patient"));

router.get("/availability/:doctorId", appointmentController.getAvailability);
router.post("/request-otp", appointmentController.requestOtp);
router.post("/book", appointmentController.bookAppointment);

// History and Management
router.get("/upcoming", appointmentController.listUpcoming);
router.get("/past", appointmentController.listPast);
router.get("/:id", appointmentController.getDetails);
router.patch("/:id/cancel", appointmentController.cancel);

export default router;
