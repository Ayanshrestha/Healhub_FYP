import * as messagingService from "../../services/user/messagingService.js";

export const send = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const message = await messagingService.sendMessage(req.user._id, appointmentId, req.body);
        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
};

export const list = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { context } = req.query; // DIRECT or CLINICAL
        const messages = await messagingService.getChatHistory(req.user._id, appointmentId, context);
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
};

export const markRead = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { context } = req.query;
        const result = await messagingService.markMessagesRead(req.user._id, appointmentId, context);
        res.status(200).json({
            success: true,
            message: "Messages marked as read"
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message
        });
    }
};
