import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import TempRegister from "../../models/tempRegister.js";
import Patient from "../../models/patient.js";
import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js";
import Clinic from "../../models/clinic.js";
import * as otpService from "./otpService.js";
import { createNotification } from "../common/notificationService.js";
import { uploadToCloudinary } from "../../config/cloudinaryConfig.js";

/**
 * Start Registration (OTP Step)
 */
export const startRegistration = async (input, file) => {
    console.log("START_REGISTRATION_INPUT:", {
        role: input.role,
        email: input.email,
        hasFile: !!file,
        bodyKeys: Object.keys(input)
    });
    const email = input.email?.toLowerCase().trim();
    const { role } = input;

    // Capture uploaded file if present (e.g., Clinic License)
    if (file) {
        try {
            const uploadResult = await uploadToCloudinary(file.buffer, "registrations");
            input.licenseDocument = uploadResult.secure_url;
        } catch (error) {
            console.error("REGISTRATION_UPLOAD_ERROR:", error);
            const err = new Error(`File upload failed: ${error.message || "Unknown error"}`);
            err.statusCode = 400;
            throw err;
        }
    }


    let existingUser = await User.findOne({ email });

    if (existingUser) {
        // Check if this is an orphaned user (exists but has no profile)
        let profile = null;
        switch (existingUser.role) {
            case "patient": profile = await Patient.findOne({ userId: existingUser._id }); break;
            case "doctor": profile = await Doctor.findOne({ userId: existingUser._id }); break;
            case "therapist": profile = await Therapist.findOne({ userId: existingUser._id }); break;
            case "clinic": profile = await Clinic.findOne({ userId: existingUser._id }); break;
        }

        if (!profile && existingUser.role !== "admin") {
            // Orphaned user found, delete it to allow fresh registration
            await User.deleteOne({ _id: existingUser._id });
            existingUser = null;
        } else {
            // Real user exists, check role
            if (existingUser.role !== role) {
                const error = new Error(`This email is already registered as a ${existingUser.role}. Please use a different email.`);
                error.statusCode = 400;
                throw error;
            }
            const error = new Error("User already registered. Please login.");
            error.statusCode = 400;
            throw error;
        }
    }

    input.email = email; // Ensure the data inside matches normalized email

    await TempRegister.findOneAndUpdate(
        { email },
        { email, role, data: input },
        { upsert: true, new: true }
    );

    await otpService.sendOtp({ email });

    return { email, role };
};

/**
 * Complete Registration (Password Step)
 * - For clinics: uses a JWT token from the approval email link
 * - For all other roles: uses email + OTP-verified TempRegister as before
 */
export const completeRegistration = async (input) => {
    const { password, confirmPassword, token } = input;

    if (password !== confirmPassword) {
        const error = new Error("Password and Confirm Password do not match");
        error.statusCode = 400;
        throw error;
    }

    // ── CLINIC FLOW (token-based) ──────────────────────────────────────────
    if (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            const error = new Error("Invalid or expired approval link. Please contact admin.");
            error.statusCode = 400;
            throw error;
        }

        const email = decoded.email?.toLowerCase().trim();
        const clinicId = decoded.clinicId;

        // Make sure a User doesn't already exist for this email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("Account already created. Please login.");
            error.statusCode = 400;
            throw error;
        }

        const clinic = await Clinic.findById(clinicId);
        if (!clinic) {
            const error = new Error("Clinic record not found.");
            error.statusCode = 404;
            throw error;
        }

        if (clinic.status !== "APPROVED_UNPAID") {
            const error = new Error("Clinic is not in an approved state.");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user = null;
        try {
            user = await User.create({
                email,
                password: hashedPassword,
                role: "clinic",
                isVerified: true,
            });

            // Link the existing Clinic record to the new User
            clinic.userId = user._id;
            await clinic.save();

            // Clean up TempRegister
            await TempRegister.deleteOne({ email });

            return { user, profile: clinic };
        } catch (error) {
            if (user) await User.deleteOne({ _id: user._id });
            if (!error.statusCode) error.statusCode = 400;
            throw error;
        }
    }

    // ── ALL OTHER ROLES (email-based, unchanged) ───────────────────────────
    const email = input.email?.toLowerCase().trim();

    const temp = await TempRegister.findOne({ email });
    if (!temp) {
        const error = new Error("No registration found for this email");
        error.statusCode = 404;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = null;
    try {
        user = await User.create({
            email,
            password: hashedPassword,
            role: temp.role,
            isVerified: true,
        });

        const profileData = { ...temp.data, userId: user._id };
        let profile = null;

        switch (temp.role) {
            case "patient":
                profile = await Patient.create(profileData);
                break;
            case "doctor":
                profile = await Doctor.create(profileData);
                break;
            case "therapist":
                profile = await Therapist.create(profileData);
                break;
            default:
                throw new Error("Invalid user role");
        }

        await TempRegister.deleteOne({ email });

        // Notify Admins for new Provider registrations
        if (temp.role === "doctor" || temp.role === "therapist") {
            try {
                const admins = await User.find({ role: "admin" });
                for (const admin of admins) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientModel: "User",
                        type: "SYSTEM",
                        title: `New ${temp.role === "doctor" ? "Doctor" : "Therapist"} Registered 🩺`,
                        message: `${profile.fullName || email} has joined HealHub as a ${temp.role}.`,
                        priority: "INFO",
                        link: `/admin/users/${user._id}`
                    });
                }
            } catch (notifyErr) {
                console.error("Failed to notify admins of new provider registration:", notifyErr);
            }
        }

        return { user, profile };

    } catch (error) {
        if (user) {
            await User.deleteOne({ _id: user._id });
        }
        if (!error.statusCode) error.statusCode = 400;
        throw error;
    }
};

/**
 * User Login Logic
 */
export const login = async (input) => {
    const email = input.email?.toLowerCase().trim();
    const { password } = input;

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 400;
        throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        const error = new Error("Invalid email or password");
        error.statusCode = 400;
        throw error;
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    let profile = null;
    let nextStep = "DASHBOARD";

    switch (user.role) {
        case "patient":
            profile = await Patient.findOne({ userId: user._id });
            break;
        case "doctor":
            profile = await Doctor.findOne({ userId: user._id });
            break;
        case "therapist":
            profile = await Therapist.findOne({ userId: user._id });
            break;
        case "clinic":
            profile = await Clinic.findOne({ userId: user._id });
            if (!profile) break;

            if (profile.status === "PENDING_APPROVAL") {
                const error = new Error("Clinic registration is pending admin approval.");
                error.statusCode = 403;
                throw error;
            }

            if (profile.status === "REJECTED") {
                const error = new Error("Clinic registration has been rejected.");
                error.statusCode = 403;
                throw error;
            }

            if (profile.status === "APPROVED_UNPAID" || profile.status === "BLOCKED") {
                nextStep = "PAYMENT_REQUIRED";
            } else if (profile.status === "ACTIVE") {
                nextStep = "DASHBOARD";
            }
            break;
    }

    return { user, profile, nextStep };
};
