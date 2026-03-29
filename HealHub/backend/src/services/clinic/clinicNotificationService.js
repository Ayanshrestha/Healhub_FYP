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
        { readAt: new Date() },
        { new: true }
    );
};

export const markAllRead = async (clinicId) => {
    return await Notification.updateMany(
        { recipientId: clinicId, readAt: { $exists: false } },
        { readAt: new Date() }
    );
};

export const createNotification = async (data) => {
    return await Notification.create(data);
};

