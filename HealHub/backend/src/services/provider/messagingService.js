import Message from "../../models/message.js";
import Appointment from "../../models/appointment.js";
import Affiliation from "../../models/affiliation.js";
import { emitToRoom } from "../../config/socket.js";
import mongoose from "mongoose";

export const sendMessage = async (messageData) => {
    const { appointmentId, content, type, attachments, providerId, tempId } = messageData;

    // 1. Verify Appointment existence and participant
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        providerId: providerId
    }).populate("patientId");

    if (!appointment) {
        const error = new Error("Appointment not found or you are not authorized to send messages in this chat.");
        error.statusCode = 404;
        throw error;
    }

    const message = await Message.create({
        patientId: appointment.patientId?._id || appointment.patientId,
        providerId: appointment.providerId,
        providerType: appointment.providerType,
        clinicId: appointment.clinicId,
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        sender: "PROVIDER",
        content,
        type: type || "TEXT",
        attachments: attachments || [],
        context: "DIRECT"
    });

    const messageObject = {
        ...message.toObject(),
        tempId,
        appointmentId: appointmentId.toString()
    };

    // Real-time emission to the APPOINTMENT room
    emitToRoom(appointmentId.toString(), "new_message", messageObject);

    // FAILSAFE: Emit directly to Patient's personal room
    if (appointment.patientId && appointment.patientId.userId) {
        emitToRoom(appointment.patientId.userId.toString(), "new_message", messageObject);
    }

    return message;
};

export const getConversationHistory = async (appointmentId, providerId) => {
    // Verify provider participation before returning history
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        providerId: providerId
    });

    if (!appointment) {
        const error = new Error("Access denied: You are not the provider for this appointment.");
        error.statusCode = 403;
        throw error;
    }

    return await Message.find({
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        context: "DIRECT"
    }).sort({ createdAt: 1 });
};

export const markAsRead = async (messageIds) => {
    return await Message.updateMany(
        { _id: { $in: messageIds } },
        { readAt: new Date() }
    );
};

export const markMessagesRead = async (appointmentId, providerId) => {
    // Verify visibility first
    const appointment = await Appointment.findOne({ _id: appointmentId, providerId });
    if (!appointment) return;

    await Message.updateMany(
        {
            appointmentId: appointment._id,
            context: "DIRECT",
            sender: "PATIENT",
            readAt: { $exists: false }
        },
        { $set: { readAt: new Date() } }
    );
};
