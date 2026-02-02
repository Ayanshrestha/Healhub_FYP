import express from "express";
import * as therapistController from "../../controllers/user/therapistController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, therapistController.getProfile);

export default router;
