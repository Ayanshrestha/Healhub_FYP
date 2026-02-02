import express from "express";
import * as adminClinicApprovalController from "../../controllers/admin/adminClinicApprovalController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/list", adminClinicApprovalController.getClinics);
router.get("/:clinicId", adminClinicApprovalController.getClinicById);
router.patch("/:clinicId/status", adminClinicApprovalController.updateClinic);

export default router;
