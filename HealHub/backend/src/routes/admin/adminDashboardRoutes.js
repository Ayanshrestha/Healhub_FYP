import express from "express";
import * as adminDashboardController from "../../controllers/admin/adminDashboardController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/stats", adminDashboardController.getStats);

export default router;
