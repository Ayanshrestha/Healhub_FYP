import express from "express";
import * as clinicAuthController from "../../controllers/clinic/clinicAuthController.js";

const router = express.Router();

// Called by frontend after OTP verification to create pending clinic & notify admin
router.post("/register-from-otp", clinicAuthController.registerFromOtp);

export default router;
