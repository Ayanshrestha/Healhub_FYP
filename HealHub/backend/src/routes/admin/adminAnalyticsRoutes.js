import express from "express";
import * as adminAnalyticsController from "../../controllers/admin/adminAnalyticsController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/growth", adminAnalyticsController.getStats);

export default router;
