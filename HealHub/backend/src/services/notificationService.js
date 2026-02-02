import Notification from "../models/notification.js";
import { emitToRoom } from "../config/socket.js";

/**
 * Create a persistent notification and emit via Socket.IO
 */
export const createNotification = async (data) => {
    const { recipientId, recipientModel, title, message, type, priority, link } = data;

    const notification = await Notification.create({
        recipientId,
        recipientModel,
        title,
        message,
        type,
        priority,
        link
    });

    // Emit to a specific user room (userId based)
    emitToRoom(recipientId.toString(), "notification", notification);

    return notification;
};

export const getMyNotifications = async (recipientId) => {
    return await Notification.find({ recipientId }).sort({ createdAt: -1 }).limit(50);
};

export const markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};
