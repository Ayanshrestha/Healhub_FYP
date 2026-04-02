import * as clinicProfileService from "../../services/clinic/clinicProfileService.js";
import { uploadToCloudinary } from "../../config/cloudinaryConfig.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const email = req.user?.email;

        console.log(`[ClinicProfile] Fetching profile for UserID: ${userId}, Email: ${email}`);

        const result = await clinicProfileService.getProfileByUserId(userId, email);
        if (!result) {
            console.error(`[ClinicProfile] Profile not found for UserID: ${userId}`);
            return res.status(404).json({
                message: "Clinic profile not found. Please ensure you completed registration.",
                userId: userId,
                email: email
            });
        }

        console.log(`[ClinicProfile] Data retrieved for ${result.clinicName}:`, result);

        // Data integrity check for clinic-specific fields
        const isDataComplete = result.clinicName && result.phone && result.address;

        res.status(200).json({
            ...result,
            _dataIntegrity: isDataComplete ? "OK" : "INCOMPLETE",
            _warning: isDataComplete ? null : "Some registration data is missing from this profile."
        });
    } catch (error) {
        console.error(`[ClinicProfile] ERROR: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const clinic = await clinicProfileService.getProfileByUserId(req.user._id);
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });

        const result = await clinicProfileService.updateClinicProfile(clinic._id, req.body);
        res.status(200).json({ success: true, clinic: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const clinic = await clinicProfileService.getProfileByUserId(req.user._id);
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });

        const result = await clinicProfileService.updatePreferences(clinic._id, req.body.preferences);
        res.status(200).json({ success: true, clinic: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await clinicProfileService.changePassword(req.user._id, currentPassword, newPassword);
        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const uploadImages = async (req, res) => {
    try {
        const clinic = await clinicProfileService.getProfileByUserId(req.user._id);
        if (!clinic) return res.status(404).json({ message: "Clinic not found" });

        const updateData = {};
        if (req.files?.clinicImage) {
            const uploadResult = await uploadToCloudinary(req.files.clinicImage[0].buffer, "profiles");
            updateData.clinicImage = uploadResult.secure_url;
        }
        if (req.files?.clinicLogo) {
            const uploadResult = await uploadToCloudinary(req.files.clinicLogo[0].buffer, "profiles");
            updateData.clinicLogo = uploadResult.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        const result = await clinicProfileService.updateClinicProfile(clinic._id, updateData);
        res.status(200).json({
            success: true,
            message: "Images updated successfully",
            clinic: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
