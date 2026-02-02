import express from "express";
import * as adminSecurityLogController from "../../controllers/admin/adminSecurityLogController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/list", adminSecurityLogController.getLogs);
router.get("/export", adminSecurityLogController.exportLogs);

export default router;
