import mongoose from "mongoose";
import dotenv from "dotenv";
import { uploadToCloudinary } from "./src/config/cloudinaryConfig.js";
import sendEmail from "./src/utils/sendEmail.js";

dotenv.config();

/**
 * HEALHUB EMERGENCY DIAGNOSTICS
 * This script tests all dependencies used in registration.
 */
async function runDiagnostics() {
    console.log("🏥 Starting HealHub Emergency Registration Diagnostics...\n");

    // 1. Check DB
    console.log("📡 1/3: Checking Database Connection...");
    try {
        if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL is missing!");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ Database Connected.\n");
    } catch (err) {
        console.error("❌ Database Failure:", err.message);
    }

    // 2. Check Cloudinary
    console.log("☁️ 2/3: Checking Cloudinary Connection...");
    try {
        const dummyBuffer = Buffer.from("test pdf content");
        const upload = await uploadToCloudinary(dummyBuffer, "test");
        console.log("✅ Cloudinary Upload Success:", upload.secure_url, "\n");
    } catch (err) {
        console.error("❌ Cloudinary Failure:", err.message);
        console.log("   (Check if CLOUDINARY_API_KEY is spelled correctly in Render)\n");
    }

    // 3. Check Email
    console.log("📧 3/3: Checking Email Service...");
    try {
        const result = await sendEmail({
            to: process.env.EMAIL_USER,
            subject: "HealHub Diagnostic Test",
            text: "Diagnostic test from your server."
        });
        if (result.success) {
            console.log("✅ Email Service Working.");
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        console.error("❌ Email Failure:", err.message);
        console.log("   (Check if EMAIL_PASS is a 16-character Google App Password)\n");
    }

    console.log("\n🏥 Diagnostics Complete.");
    process.exit(0);
}

runDiagnostics();
