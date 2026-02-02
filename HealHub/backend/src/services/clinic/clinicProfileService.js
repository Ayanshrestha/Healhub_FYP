import Clinic from "../../models/clinic.js";
import User from "../../models/user.js";
import bcrypt from "bcryptjs";

/**
 * Clinic Profile management
 */
export const getClinicProfile = async (clinicId) => {
    return await Clinic.findById(clinicId);
};

export const getProfileByUserId = async (userId, email) => {
    // Try by userId first
    let clinic = await Clinic.findOne({ userId }).lean();

    // Fallback to email if userId fails (useful for legacy or sync issues)
    if (!clinic && email) {
        clinic = await Clinic.findOne({ email }).lean();
    }

    return clinic;
};

export const updateClinicProfile = async (clinicId, updateData) => {
    // Whitelist updateable fields
    const { phone, address, ownerName, description, operatingHours, facilities, specializations } = updateData;
    const cleanData = {};
    if (phone) cleanData.phone = phone;
    if (address) cleanData.address = address;
    if (ownerName) cleanData.ownerName = ownerName;
    if (description !== undefined) cleanData.description = description;
    if (operatingHours) cleanData.operatingHours = operatingHours;
    if (facilities) cleanData.facilities = facilities;
    if (specializations) cleanData.specializations = specializations;

    return await Clinic.findByIdAndUpdate(clinicId, cleanData, { new: true });
};

export const updatePreferences = async (clinicId, preferences) => {
    return await Clinic.findByIdAndUpdate(
        clinicId,
        { notificationPreferences: preferences },
        { new: true }
    );
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Incorrect current password");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return true;
};
