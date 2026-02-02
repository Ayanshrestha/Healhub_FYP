import Notification from "../../models/notification.js";
import { emitToRoom } from "../../config/socket.js";

/**
 * Create and send a notification
 */
export const createNotification = async ({ recipientId, type, title, message, data }) => {
    const notification = await Notification.create({
        recipientId,
        type,
        title,
        message,
        data
    });

    // Real-time emit to user's private room (room name = userId)
    // Note: We need to ensure users join their own userId room on connection
    console.log(`📡 [NotificationService] Emitting to Room: ${recipientId.toString()} | Type: ${type}`);
    emitToRoom(recipientId.toString(), "notification", notification);

    return notification;
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (userId) => {
    return await Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .limit(50);
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (userId, notificationId) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { $set: { readAt: new Date() } },
        { new: true }
    );
};

/**
 * Mark all as read
 */
export const markAllRead = async (userId) => {
    return await Notification.updateMany(
        { recipientId: userId, readAt: { $exists: false } },
        { $set: { readAt: new Date() } }
    );
};
