import express from "express";
import * as clinicDiscoveryController from "../../controllers/user/clinicDiscoveryController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// Patient browsing routes
router.get("/", authMiddleware, allowRoles("patient"), clinicDiscoveryController.getClinics);
router.get("/:id", authMiddleware, allowRoles("patient"), clinicDiscoveryController.getClinicDetails);

// Filtering routes
router.get("/:id/departments", authMiddleware, allowRoles("patient"), clinicDiscoveryController.listDepartments);
router.get("/:id/departments/:department/doctors", authMiddleware, allowRoles("patient"), clinicDiscoveryController.listDoctors);

export default router;
