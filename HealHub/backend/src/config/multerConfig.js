import multer from "multer";
import path from "path";
import fs from "fs";

// Base upload directory
const baseDir = "uploads";
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subDir = "others";

        // Dynamic subdirectories
        if (file.fieldname === "photo" || file.fieldname === "clinicImage" || file.fieldname === "clinicLogo") {
            subDir = "profiles";
        } else if (file.fieldname === "report") {
            subDir = "reports";
        } else if (file.fieldname === "attachment") {
            subDir = "messages";
        }

        const targetDir = path.join(baseDir, subDir);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        let name = "file";

        if (file.fieldname === "photo") name = `profile-${req.user._id}`;
        else if (file.fieldname === "clinicImage") name = `clinic-hero-${req.user._id}`;
        else if (file.fieldname === "clinicLogo") name = `clinic-logo-${req.user._id}`;
        else name = `doc-${req.user._id}`;

        cb(null, `${name}-${uniqueSuffix}${path.extname(file.originalname)}`);
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
