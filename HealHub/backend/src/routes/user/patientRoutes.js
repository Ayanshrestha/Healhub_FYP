import express from "express";
import * as patientController from "../../controllers/user/patientController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";
import upload from "../../config/multerConfig.js";

const router = express.Router();

// Patient specific routes
router.get("/profile", authMiddleware, allowRoles("patient"), patientController.getProfile);
router.put("/profile", authMiddleware, allowRoles("patient"), patientController.updateProfile);
router.post("/profile/photo", authMiddleware, allowRoles("patient"), upload.single("photo"), patientController.uploadProfilePhoto);

// Provider specific routes (for viewing patient profiles)
router.get("/profile/:patientId", authMiddleware, allowRoles("doctor", "therapist", "clinic", "admin"), patientController.getPublicProfile);

export default router;
