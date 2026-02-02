import express from "express";
import * as clinicAuthController from "../../controllers/clinic/clinicAuthController.js";

const router = express.Router();

router.post("/register", clinicAuthController.register);

export default router;
