import express from "express";
import * as messagingController from "../../controllers/user/messagingController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

// All messaging routes require patient role
router.use(authMiddleware, allowRoles("patient"));

router.post("/:appointmentId", messagingController.send);
router.get("/:appointmentId", messagingController.list);
router.patch("/:appointmentId/read", messagingController.markRead);

export default router;
