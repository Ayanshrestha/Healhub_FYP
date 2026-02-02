import * as messagingService from "../../services/provider/messagingService.js";
import * as providerService from "../../services/provider/providerService.js";

export const sendMessage = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        const messageData = {
            ...req.body,
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
        const history = await messagingService.getConversationHistory(appointmentId);
        res.status(200).json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
