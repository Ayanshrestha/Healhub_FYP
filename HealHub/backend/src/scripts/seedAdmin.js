import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.js";
import connectDB from "../config/database.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL || "admin@healhub.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const existingAdmin = await User.findOne({ email: adminEmail, role: "admin" });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log("Admin user password updated successfully!");
        } else {
            const adminUser = new User({
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                isVerified: true,
            });
            await adminUser.save();
            console.log("System Admin seeded successfully!");
        }

        console.log(`Email: ${adminEmail}`);
        console.log(`Password (set to default): ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
