import mongoose from "mongoose";
import Message from "../../models/message.js";
import Appointment from "../../models/appointment.js";
import { emitToRoom } from "../../config/socket.js";
import { createNotification } from "../common/notificationService.js";

/**
 * Send a message from a Clinic to a Patient
 */
export const sendMessage = async (clinicId, appointmentId, messageData) => {
    const { content, type, attachments, tempId } = messageData;

    // 1. Verify Clinic owns the appointment
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        clinicId: clinicId
    }).populate("patientId");

    if (!appointment) {
        const error = new Error("Appointment not found or access denied");
        error.statusCode = 404;
        throw error;
    }

    // 2. Create message
    const message = await Message.create({
        patientId: appointment.patientId._id,
        providerId: appointment.providerId,
        providerType: appointment.providerType,
        clinicId: appointment.clinicId,
        appointmentId: appointment._id,
        sender: "CLINIC",
        content,
        type: type || "TEXT",
        attachments: attachments || [],
        context: "CLINICAL"
    });

    // 3. Real-time emit
    emitToRoom(appointmentId.toString(), "new_message", {
        ...message.toObject(),
        tempId
    });

    // 4. Notify Patient
    if (appointment.patientId && appointment.patientId.userId) {
        await createNotification({
            recipientId: appointment.patientId.userId,
            type: "MESSAGE",
            title: "Clinic Message",
            message: `New message/report from clinic for your appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
            data: { appointmentId, messageId: message._id }
        });
    }

    return message;
};

/**
 * Get chat history for an appointment (Clinic perspective)
 */
export const getChatHistory = async (clinicId, appointmentId) => {
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        clinicId: clinicId
    });

    if (!appointment) {
        const error = new Error("Appointment not found or access denied");
        error.statusCode = 404;
        throw error;
    }

    const messages = await Message.find({
        appointmentId,
        context: "CLINICAL"
    })
        .sort({ createdAt: 1 })
        .lean();

    return messages;
};

/**
 * Mark all messages in a clinical context as read for a specific appointment
 */
export const markMessagesRead = async (clinicId, appointmentId) => {
    // Verify visibility first
    const appointment = await Appointment.findOne({ _id: appointmentId, clinicId });
    if (!appointment) return;

    await Message.updateMany(
        {
            appointmentId: appointment._id,
            context: "CLINICAL",
            sender: "PATIENT",
            readAt: { $exists: false }
        },
        { $set: { readAt: new Date() } }
    );
};

/**
 * Get total unread clinical messages for a clinic
 */
export const getUnreadCounts = async (clinicId) => {
    const unreadMessages = await Message.aggregate([
        {
            $match: {
                clinicId: new mongoose.Types.ObjectId(clinicId),
                context: "CLINICAL",
                sender: "PATIENT",
                readAt: { $exists: false }
            }
        },
        {
            $group: {
                _id: "$appointmentId",
                count: { $sum: 1 }
            }
        }
    ]);

    const total = unreadMessages.reduce((sum, item) => sum + item.count, 0);
    const byAppointment = unreadMessages.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {});

    return { total, byAppointment };
};
