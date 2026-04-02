import multer from "multer";
import path from "path";
import fs from "fs";

// Base upload directory
const baseDir = "uploads";
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

// Switch to memoryStorage for Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image (JPEG/PNG/WEBP) and PDF files are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (relaxed for reports)
    }
});

export default upload;
