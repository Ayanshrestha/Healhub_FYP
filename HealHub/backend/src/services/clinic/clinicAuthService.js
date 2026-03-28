import Clinic from "../../models/clinic.js";
import User from "../../models/user.js";
import TempRegister from "../../models/tempRegister.js";
import { createNotification } from "../common/notificationService.js";

/**
 * Called right after OTP is verified for a clinic.
 * Creates a Clinic record (no userId yet — User doesn't exist at this point).
 * Stores the clinicId back into TempRegister so it can be linked when the
 * clinic later sets a password via the approval email link.
 */
export const registerClinicFromOtp = async (email) => {
    const temp = await TempRegister.findOne({ email: email.toLowerCase().trim() });
    if (!temp || temp.role !== "clinic") {
        const error = new Error("No pending clinic registration found for this email.");
        error.statusCode = 404;
        throw error;
    }

    // Check for an existing clinic with this email
    const existing = await Clinic.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
        if (existing.userId) {
            // Already fully set up — shouldn't happen again
            const error = new Error("A clinic with this email already exists. Please login.");
            error.statusCode = 400;
            throw error;
        }
        // Already pending — idempotent, just return it
        return existing;
    }

    const { clinicName, ownerName, phone, licenseNumber, address } = temp.data;

    const clinic = await Clinic.create({
        clinicName,
        ownerName,
        email: email.toLowerCase().trim(),
        phone,
        licenseNumber,
        address,
        status: "PENDING_APPROVAL",
    });

    // Store the clinicId in TempRegister so completeRegistration can link it later
    temp.data = { ...temp.data, clinicId: clinic._id.toString() };
    await temp.save();

    // Notify all admins
    try {
        const admins = await User.find({ role: "admin" });
        for (const admin of admins) {
            await createNotification({
                recipientId: admin._id,
                recipientModel: "User",
                type: "SYSTEM",
                title: "New Clinic Registration 🏥",
                message: `${clinicName} has registered and is awaiting your approval.`,
                priority: "high",
                link: `/admin/clinics/${clinic._id}`,
                data: { clinicId: clinic._id }
            });
        }
    } catch (error) {
        console.error("Failed to notify admin of new clinic:", error);
    }

    return clinic;
};
