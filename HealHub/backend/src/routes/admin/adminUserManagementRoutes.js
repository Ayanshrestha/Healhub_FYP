import express from "express";
import * as adminUserManagementController from "../../controllers/admin/adminUserManagementController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/list", adminUserManagementController.getUsers);
router.get("/:userId", adminUserManagementController.getUserDetails);
router.patch("/:userId/toggle-status", adminUserManagementController.toggleUser);

export default router;
