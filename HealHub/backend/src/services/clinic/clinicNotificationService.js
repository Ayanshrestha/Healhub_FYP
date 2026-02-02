import Notification from "../../models/notification.js";

export const getClinicNotifications = async (clinicId) => {
    return await Notification.find({
        recipientId: clinicId,
        recipientModel: "Clinic"
    }).sort({ createdAt: -1 }).limit(20);
};

export const markAsRead = async (notificationId, clinicId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: clinicId },
        { isRead: true },
        { new: true }
    );
};

export const createNotification = async (data) => {
    return await Notification.create(data);
};
