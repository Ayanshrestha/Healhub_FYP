import * as providerService from "../../services/provider/providerService.js";
import { logAction } from "../../utils/auditLogger.js";

export const getDashboardStats = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        if (!provider) return res.status(404).json({ message: "Provider profile not found" });

        const stats = await providerService.getDashboardStats(provider._id, req.user.role);
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const profile = await providerService.getProviderProfile(req.user._id, req.user.role);
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const profile = await providerService.updateProviderProfile(req.user._id, req.user.role, req.body);
        await logAction(req, "PROVIDER_PROFILE_UPDATE", `Profile updated for ${req.user.role}`);
        res.status(200).json({ success: true, profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEarnings = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        const report = await providerService.getEarningsReport(provider._id);
        res.status(200).json({ success: true, report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const searchClinics = async (req, res) => {
    try {
        const { query } = req.query;
        const clinics = await providerService.searchClinics(query);
        res.status(200).json({ success: true, clinics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const profilePhotoUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;

        // Update profile with new photo URL
        const profile = await providerService.updateProviderProfile(req.user._id, req.user.role, {
            profilePhoto: profilePhotoUrl
        });

        res.status(200).json({
            success: true,
            message: "Profile photo updated successfully",
            profile,
            profilePhoto: profilePhotoUrl
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
