import bcrypt from "bcryptjs";
import User from "../../models/user.js";
import TempRegister from "../../models/tempRegister.js";
import Patient from "../../models/patient.js";
import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js";
import Clinic from "../../models/clinic.js";
import * as otpService from "./otpService.js";

/**
 * Start Registration (OTP Step)
 */
export const startRegistration = async (input) => {
    const email = input.email?.toLowerCase().trim();
    const { role } = input;

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
 */
export const completeRegistration = async (input) => {
    const email = input.email?.toLowerCase().trim();
    const { password, confirmPassword } = input;

    if (password !== confirmPassword) {
        const error = new Error("Password and Confirm Password do not match");
        error.statusCode = 400;
        throw error;
    }

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
            case "clinic":
                profile = await Clinic.create({
                    ...profileData,
                    status: "PENDING_APPROVAL"
                });
                break;
            default:
                throw new Error("Invalid user role");
        }

        await TempRegister.deleteOne({ email });
        return { user, profile };

    } catch (error) {
        // CLEANUP: If profile creation fails, delete the created user to prevent orphans
        if (user) {
            await User.deleteOne({ _id: user._id });
        }

        // Rethrow the error for the controller to handle
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
