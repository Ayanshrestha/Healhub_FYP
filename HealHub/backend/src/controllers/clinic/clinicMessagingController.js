import * as clinicMessagingService from "../../services/clinic/clinicMessagingService.js";

export const sendMessage = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const clinicId = req.clinic._id;

        const message = await clinicMessagingService.sendMessage(clinicId, appointmentId, req.body);
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

export const getHistory = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const clinicId = req.clinic._id;

        const messages = await clinicMessagingService.getChatHistory(clinicId, appointmentId);
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

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        res.status(200).json({
            success: true,
            data: {
                name: req.file.originalname,
                url: `/uploads/${req.file.filename}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markRead = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const clinicId = req.clinic._id;
        await clinicMessagingService.markMessagesRead(clinicId, appointmentId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUnreadCounts = async (req, res) => {
    try {
        const clinicId = req.clinic._id;
        const counts = await clinicMessagingService.getUnreadCounts(clinicId);
        res.json({ success: true, data: counts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
