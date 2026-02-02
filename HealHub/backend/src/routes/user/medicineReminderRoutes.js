import express from "express";
import * as medicineReminderController from "../../controllers/user/medicineReminderController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware, allowRoles("patient"));

router.post("/", medicineReminderController.create);
router.get("/", medicineReminderController.list);
router.patch("/:id", medicineReminderController.update);
router.patch("/:id/status", medicineReminderController.markStatus);
router.delete("/:id", medicineReminderController.remove);

export default router;
