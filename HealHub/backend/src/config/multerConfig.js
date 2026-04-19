import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory (Absolute path to ensure consistency on Windows/Local)
const baseDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(baseDir)) {
    console.log(`[Multer] Creating upload directory at: ${baseDir}`);
    fs.mkdirSync(baseDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, baseDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(cleanName)}`);
    }
});

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
