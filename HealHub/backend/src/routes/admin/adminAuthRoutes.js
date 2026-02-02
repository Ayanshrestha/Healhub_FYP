import express from "express";
import * as adminAuthController from "../../controllers/admin/adminAuthController.js";

const router = express.Router();

router.post("/login", adminAuthController.loginAdmin);

export default router;
