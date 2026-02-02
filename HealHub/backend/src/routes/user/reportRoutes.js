import express from "express";
import * as reportController from "../../controllers/user/reportController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import allowRoles from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware, allowRoles("patient"));

router.get("/", reportController.list);

export default router;
