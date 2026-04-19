import Message from "../../models/message.js";
import Appointment from "../../models/appointment.js";
import Patient from "../../models/patient.js";
import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js"; // Assuming Therapist model exists
import Clinic from "../../models/clinic.js";
import { emitToRoom } from "../../config/socket.js";
import { createNotification } from "../common/notificationService.js";
import mongoose from "mongoose";

/**
 * Send a message within an appointment context
 */
export const sendMessage = async (userId, appointmentId, messageData) => {
    const { content, type, attachments, context, tempId } = messageData;

    // 1. Verify patient ownership and get context
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId: patient._id
    });

    if (!appointment) {
        const error = new Error("Appointment not found or access denied");
        error.statusCode = 404;
        throw error;
    }

    // 2. Create message
    const message = await Message.create({
        patientId: patient._id,
        providerId: appointment.providerId,
        providerType: appointment.providerType,
        clinicId: appointment.clinicId || undefined,
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        sender: "PATIENT",
        content,
        type: type || "TEXT",
        attachments: attachments || [],
        context: context || "DIRECT"
    });

    // 3. Real-time emit
    emitToRoom(appointmentId.toString(), "new_message", {
        ...message.toObject(),
        tempId
    });

    // 4. Notify Provider
    let provider;
    if (appointment.providerType === "Doctor") {
        provider = await Doctor.findById(appointment.providerId);
    } else {
        // Therapist logic
        provider = await Therapist.findById(appointment.providerId);
    }

    if (provider && provider.userId) {
        await createNotification({
            recipientId: provider.userId,
            type: "MESSAGE",
            title: "New Message",
            message: `New message from patient ${patient.fullName}`,
            data: { appointmentId, messageId: message._id }
        });
    }

    // 5. Notify Clinic if CLINICAL context
    if (context === "CLINICAL") {
        const clinic = await Clinic.findById(appointment.clinicId);
        if (clinic && clinic.userId) {
            // Standard notification
            await createNotification({
                recipientId: clinic.userId,
                type: "CLINICAL",
                title: "New Clinical Inquiry",
                message: `Patient ${patient.fullName} sent a message regarding appointment ${appointmentId}`,
                data: { appointmentId, messageId: message._id }
            });

            // Specific event for unread badge update
            emitToRoom(clinic.userId.toString(), "unread_count_update", {
                type: "CLINICAL",
                appointmentId
            });
        }
    }

    return message;
};

/**
 * Get chat history for an appointment
 */
export const getChatHistory = async (userId, appointmentId, context = "DIRECT") => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId: patient._id
    });

    if (!appointment) {
        const error = new Error("Appointment not found or access denied");
        error.statusCode = 404;
        throw error;
    }

    const messages = await Message.find({
        appointmentId: new mongoose.Types.ObjectId(appointmentId),
        context: context
    })
        .sort({ createdAt: 1 })
        .lean();

    return messages;
};

/**
 * Mark messages as read by patient
 */
export const markMessagesRead = async (userId, appointmentId, context = "DIRECT") => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    await Message.updateMany(
        {
            appointmentId: new mongoose.Types.ObjectId(appointmentId),
            patientId: patient._id,
            context: context,
            sender: { $ne: "PATIENT" },
            readAt: { $exists: false }
        },
        { $set: { readAt: new Date() } }
    );

    return { success: true };
};
