import * as notificationService from "../../services/common/notificationService.js";

export const list = async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user._id);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const markRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.markAsRead(req.user._id, id);
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const markAllRead = async (req, res) => {
    try {
        await notificationService.markAllRead(req.user._id);
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
