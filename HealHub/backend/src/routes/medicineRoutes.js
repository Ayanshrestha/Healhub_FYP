import express from "express";
import multer from "multer";
import { scanMedicine } from "../controllers/medicineScannerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer configuration for temporary storage of uploaded images (Memory only for Cloudinary/OCR)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) return cb(null, true);
        cb(new Error("Only images (jpeg, jpg, png) are allowed."));
    }
});

// Route for medicine scanning
router.post("/scan", authMiddleware, upload.single("image"), scanMedicine);

export default router;
