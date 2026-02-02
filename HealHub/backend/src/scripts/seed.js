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

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/HealHub";

const seedData = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB.");

        // Clear existing data
        console.log("Clearing existing data...");
        await User.deleteMany({});
        await Clinic.deleteMany({});
        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        await Therapist.deleteMany({});
        await Appointment.deleteMany({});
        await Affiliation.deleteMany({});

        const passwordHash = await bcrypt.hash("Password123", 10);

        // --- SEED ADMIN ---
        console.log("Seeding Admin...");
        const adminUser = await User.create({
            email: "admin@healhub.com",
            password: passwordHash,
            role: "admin",
            isVerified: true,
        });

        // --- SEED CLINICS ---
        console.log("Seeding Clinics...");
        const clinicsData = [
            { name: "City General Hospital", city: "Kathmandu", owner: "Dr. Ramesh Thapa" },
            { name: "Smile Dental Clinic", city: "Lalitpur", owner: "Dr. Sunita Rai" },
            { name: "HealthCare Plus", city: "Bhaktapur", owner: "Dr. Binod KC" },
            { name: "MediCure Center", city: "Pokhara", owner: "Dr. Anjali Sharma" },
            { name: "Wellness Clinic", city: "Chitwan", owner: "Dr. Pukar Giri" },
        ];

        const clinics = [];
        for (const c of clinicsData) {
            const user = await User.create({
                email: `${c.name.replace(/\s+/g, "").toLowerCase()}@clinic.com`,
                password: passwordHash,
                role: "clinic",
                isVerified: true,
            });
            const clinic = await Clinic.create({
                userId: user._id,
                clinicName: c.name,
                ownerName: c.owner,
                email: user.email,
                phone: "98" + Math.floor(10000000 + Math.random() * 90000000),
                address: `${c.city}, Nepal`,
                status: "ACTIVE",
                subscriptionStatus: "ACTIVE",
                subscriptionPlan: "PREMIUM",
            });
            clinics.push(clinic);
        }

        // --- SEED DOCTORS ---
        console.log("Seeding Doctors...");
        const specializations = [
            "Physician", "Dentist", "Cardiologist", "Neurologist", "Pediatrician",
            "Dermatologist", "Orthopedic Surgeon", "Psychiatrist", "Gynecologist", "Ophthalmologist",
            "ENT Specialist", "Urologist", "Oncologist", "Endocrinologist", "Gastroenterologist",
            "Radiologist", "Surgeon", "Anesthesiologist", "Pathologist", "General Practitioner"
        ];
        const doctors = [];
        for (let i = 1; i <= 20; i++) {
            const clinic = clinics[i % clinics.length];
            const user = await User.create({
                email: `doctor${i}@healhub.com`,
                password: passwordHash,
                role: "doctor",
                isVerified: true,
            });
            const doctor = await Doctor.create({
                userId: user._id,
                fullName: `Dr. ${["Anita", "Rajesh", "Suman", "Pooja", "Bimal", "Kiran", "Sita", "Hari", "Gita", "Ram"][i % 10]} ${["Sharma", "Verma", "Rai", "Thapa", "Gurung", "Shah", "Joshi", "Shrestha", "Pandey", "KC"][i % 10]}`,
                email: user.email,
                phone: "98" + Math.floor(10000000 + Math.random() * 90000000),
                specialization: specializations[(i - 1) % specializations.length],
                nmcLicense: `NMC-${1000 + i}`,
                experienceYears: 5 + (i % 15),
                address: clinic.address,
                availability: {
                    "Monday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Tuesday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Wednesday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Thursday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Friday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Sunday": { slots: ["10:00 AM", "11:00 AM"], isClosed: false },
                    "Saturday": { slots: [], isClosed: true }
                },
                verificationStatus: "verified",
                verifiedBy: clinic._id,
                verifiedAt: new Date(),
            });
            doctors.push(doctor);

            // Create Affiliation
            await Affiliation.create({
                clinicId: clinic._id,
                providerId: doctor._id,
                providerType: "Doctor",
                status: "ACTIVE",
                requestedBy: "CLINIC",
                affiliatedAt: new Date(),
            });
        }

        // --- SEED THERAPISTS ---
        console.log("Seeding Therapists...");
        const therapists = [];
        for (let i = 1; i <= 5; i++) {
            const user = await User.create({
                email: `therapist${i}@healhub.com`,
                password: passwordHash,
                role: "therapist",
                isVerified: true,
            });
            const therapist = await Therapist.create({
                userId: user._id,
                fullName: `Therapist Name ${i}`,
                email: user.email,
                phone: "98" + Math.floor(10000000 + Math.random() * 90000000),
                specialization: "Physical Therapist",
                licenseNumber: `LIC-${5000 + i}`,
                experienceYears: 3 + i,
                availability: {
                    "Monday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Tuesday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Wednesday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Thursday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Friday": { slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"], isClosed: false },
                    "Sunday": { slots: ["10:00 AM", "11:00 AM"], isClosed: false },
                    "Saturday": { slots: [], isClosed: true }
                },
                verificationStatus: "verified",
            });
            therapists.push(therapist);
        }

        // --- SEED PATIENTS ---
        console.log("Seeding Patients...");
        const patients = [];
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                email: `patient${i}@gmail.com`,
                password: passwordHash,
                role: "patient",
                isVerified: true,
            });
            const patient = await Patient.create({
                userId: user._id,
                fullName: `Patient User ${i}`,
                email: user.email,
                phone: "98" + Math.floor(10000000 + Math.random() * 90000000),
                gender: i % 2 === 0 ? "Male" : "Female",
                age: 20 + i,
                address: "Address " + i,
            });
            patients.push(patient);
        }

        // --- SEED APPOINTMENTS ---
        console.log("Seeding Appointments...");
        const statuses = ["Pending", "Approved", "Confirmed", "Completed", "Cancelled"];
        for (let i = 0; i < 20; i++) {
            const patient = patients[i % patients.length];
            const doctor = doctors[i % doctors.length];
            const clinic = clinics[i % clinics.length];

            await Appointment.create({
                patientId: patient._id,
                providerId: doctor._id,
                providerType: "Doctor",
                clinicId: clinic._id,
                appointmentDate: new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000), // Range of dates
                timeSlot: "10:00 AM - 11:00 AM",
                status: statuses[i % statuses.length],
                appointmentType: "CLINIC_VISIT",
                paymentStatus: i % 3 === 0 ? "Paid" : "Pending",
                reason: "General checkup",
            });
        }

        console.log("\nSeeding completed successfully!");
        console.log(`Admin: admin@healhub.com / Password123`);
        console.log(`${clinics.length} Clinics seeded.`);
        console.log(`${doctors.length} Doctors seeded.`);
        console.log(`${therapists.length} Therapists seeded.`);
        console.log(`${patients.length} Patients seeded.`);
        console.log(`20 Appointments seeded.`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
