import * as clinicNotificationService from "../../services/clinic/clinicNotificationService.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await clinicNotificationService.getClinicNotifications(req.clinic._id);
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const readNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await clinicNotificationService.markAsRead(notificationId, req.clinic._id);
        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
