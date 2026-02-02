import express from "express";
import * as notificationController from "../../controllers/common/notificationController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", notificationController.list);
router.patch("/:id/read", notificationController.markRead);
router.patch("/read-all", notificationController.markAllRead);

export default router;
