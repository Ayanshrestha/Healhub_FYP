import Otp from "../../models/otp.js";
import sendEmail from "../../utils/sendEmail.js";
import { sendSMS } from "../../utils/sendSMS.js";

import { getOTPTemplate } from "../common/emailService.js";

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
};

/**
 * Send OTP Service
 */
export const sendOtp = async ({ email: rawEmail, phone: rawPhone }) => {
    const email = rawEmail?.toLowerCase().trim();
    const phone = rawPhone?.trim();

    if (!email && !phone) {
        throw new Error("Email or Phone number is required");
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Clear any existing OTP for this target to ensure uniqueness
    const query = email ? { email } : { phone };
    await Otp.deleteMany(query);

    await Otp.create({ email, phone, otp, expiresAt });

    if (email) {
        const emailResult = await sendEmail({
            to: email,
            subject: "Your HealHub Verification Code",
            html: getOTPTemplate(otp),
            text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
        });

        if (!emailResult.success) {
            throw new Error(emailResult.message || "Failed to send verification email");
        }
    } else {
        // REAL SMS SENDING
        const smsResult = await sendSMS(phone, `Your HealHub verification code is: ${otp}. Valid for 5 minutes.`);

        // Throw error only if token exists but sending failed
        if (!smsResult.success && process.env.SMS_TOKEN) {
            throw new Error(smsResult.message || "Failed to send verification SMS");
        }
    }

    return { message: "OTP sent successfully", email, phone };
};

/**
 * Verify OTP Service
 */
export const verifyOtp = async ({ email: rawEmail, phone: rawPhone, otp, deleteAfter = true }) => {
    const email = rawEmail?.toLowerCase().trim();
    const phone = rawPhone?.trim();

    const query = email ? { email } : { phone };
    const record = await Otp.findOne(query);

    if (!record) {
        const error = new Error("OTP not found. Please request again.");
        error.statusCode = 404;
        throw error;
    }

    if (record.expiresAt < new Date()) {
        await Otp.deleteOne(query);
        const error = new Error("OTP expired. Please request a new one.");
        error.statusCode = 400;
        throw error;
    }

    if (record.otp.trim() !== otp.trim()) {
        const error = new Error("Invalid OTP. Please try again.");
        error.statusCode = 400;
        throw error;
    }

    if (deleteAfter) {
        await Otp.deleteOne(query);
    }

    return { message: "OTP verified successfully", email, phone };
};
