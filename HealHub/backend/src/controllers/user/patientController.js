import mongoose from "mongoose";
import * as patientService from "../../services/user/patientService.js";

export const getProfile = async (req, res) => {
    try {
        const result = await patientService.getPatientData(req.user._id);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const result = await patientService.updatePatientProfile(req.user._id, req.body);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { role, _id: userId } = req.user;

        let providerProfileId = userId; // Default for admin or others

        if (role === "doctor") {
            const doctor = await mongoose.model("Doctor").findOne({ userId });
            providerProfileId = doctor?._id;
        } else if (role === "therapist") {
            const therapist = await mongoose.model("Therapist").findOne({ userId });
            providerProfileId = therapist?._id;
        } else if (role === "clinic") {
            const clinic = await mongoose.model("Clinic").findOne({ userId });
            providerProfileId = clinic?._id;
        }

        const result = await patientService.getLimitedPatientProfile(
            patientId,
            providerProfileId,
            role
        );
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

export const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const profilePhotoUrl = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;

        // Update profile with new photo URL
        const result = await patientService.updatePatientProfile(req.user._id, {
            profilePhoto: profilePhotoUrl
        });

        res.status(200).json({
            success: true,
            message: "Profile photo updated successfully",
            data: result,
            profilePhoto: profilePhotoUrl
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};
