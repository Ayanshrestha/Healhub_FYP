import express from "express";
import * as paymentController from "../../controllers/payment/paymentController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/initiate", authMiddleware, paymentController.initiatePayment);
router.post("/verify", authMiddleware, paymentController.verifyPayment);

export default router;
