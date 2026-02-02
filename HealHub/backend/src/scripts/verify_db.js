import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import Clinic from "../models/clinic.js";
import Doctor from "../models/doctor.js";
import Affiliation from "../models/affiliation.js";

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/HealHub";

const verify = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB.");

        const userCount = await User.countDocuments();
        const clinicCount = await Clinic.countDocuments();
        const doctorCount = await Doctor.countDocuments();
        const affiliationCount = await Affiliation.countDocuments();

        console.log(`Users: ${userCount}`);
        console.log(`Clinics: ${clinicCount}`);
        console.log(`Doctors: ${doctorCount}`);
        console.log(`Affiliations: ${affiliationCount}`);

        const clinics = await Clinic.find().select("clinicName status").limit(5);
        console.log("Clinics sample:", JSON.stringify(clinics, null, 2));

        const activeClinicsForPatient = await Clinic.find({
            status: { $in: ["ACTIVE", "APPROVED_UNPAID", "PENDING_APPROVAL"] }
        }).countDocuments();
        console.log(`Active Clinics for Patient Discovery: ${activeClinicsForPatient}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
