import express from "express";
import * as userAuthController from "../../controllers/auth/userAuthController.js";

const router = express.Router();

router.post("/start-registration", userAuthController.startRegistration);
router.post("/complete-registration", userAuthController.completeRegistration);
router.post("/Login", userAuthController.login);

export default router;
