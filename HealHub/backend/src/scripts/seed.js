import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Clinic from "../models/clinic.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import Therapist from "../models/therapist.js";
import Appointment from "../models/appointment.js";
import Affiliation from "../models/affiliation.js";
import AuditLog from "../models/auditLog.js";
import MedicineReminder from "../models/medicineReminder.js";
import Message from "../models/message.js";
import Notification from "../models/notification.js";
import OTP from "../models/otp.js";
import Payment from "../models/payment.js";
import TempRegister from "../models/tempRegister.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/HealHub";

const seedData = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB.");

        // --- SURGICAL CLEANUP (Only remove demo patterns) ---
        console.log("Cleaning up previous demo data...");

        // Remove demo clinics and their users
        await User.deleteMany({ email: { $regex: /@clinic\.com$|doctor\d+@healhub\.com$|therapist\d+@healhub\.com$|patient\d+@gmail\.com$/ } });
        await Clinic.deleteMany({ email: { $regex: /@clinic\.com$/ } });
        await Doctor.deleteMany({ email: { $regex: /doctor\d+@healhub\.com$/ } });
        await Therapist.deleteMany({ email: { $regex: /therapist\d+@healhub\.com$/ } });
        await Patient.deleteMany({ email: { $regex: /patient\d+@gmail\.com$/ } });

        // Remove appointments linked to demo users (optional, but safer to just let them be if they are manual)
        // For now, we only clear what is explicitly a "demo" entity

        const passwordHash = await bcrypt.hash("Password123", 10);

        // --- SEED ADMIN ---
        console.log("Seeding Admin...");
        const adminUser = await User.create({
            email: "admin@healhub.com",
            password: passwordHash,
            role: "admin",
            isVerified: true,
        });

        console.log("\nReset completed successfully!");
        console.log(`Admin Created: admin@healhub.com / Password123`);
        console.log(`All other collections (Clinics, Doctors, Patients, etc.) have been cleared.`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
