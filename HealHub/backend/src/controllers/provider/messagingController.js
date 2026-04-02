import * as providerService from "../../services/provider/providerService.js";
import * as messagingService from "../../services/provider/messagingService.js";
import { uploadToCloudinary } from "../../config/cloudinaryConfig.js";

export const sendMessage = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider profile not found" });
        }

        const messageData = {
            appointmentId: req.body.appointmentId,
            content: req.body.content,
            type: req.body.type,
            attachments: req.body.attachments,
            tempId: req.body.tempId, // Ensure tempId is passed for frontend optimistic update matching
            providerId: provider._id,
            providerType: req.user.role === "doctor" ? "Doctor" : "Therapist",
            sender: "PROVIDER"
        };

        const message = await messagingService.sendMessage(messageData);
        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);

        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider profile not found" });
        }

        const history = await messagingService.getConversationHistory(appointmentId, provider._id);
        res.status(200).json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer, "messages");

        res.status(200).json({
            success: true,
            data: {
                name: req.file.originalname,
                url: uploadResult.secure_url
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markRead = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider profile not found" });
        }

        await messagingService.markMessagesRead(appointmentId, provider._id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
