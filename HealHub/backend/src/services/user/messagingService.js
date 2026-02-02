import Message from "../../models/message.js";
import Appointment from "../../models/appointment.js";
import Patient from "../../models/patient.js";
import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js"; // Assuming Therapist model exists
import { emitToRoom } from "../../config/socket.js";
import { createNotification } from "../common/notificationService.js";

/**
 * Send a message within an appointment context
 */
export const sendMessage = async (userId, appointmentId, messageData) => {
    const { content, type, attachments } = messageData;

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
        clinicId: appointment.clinicId,
        appointmentId: appointment._id,
        sender: "PATIENT",
        content,
        type: type || "TEXT",
        attachments: attachments || []
    });

    // 3. Real-time emit
    emitToRoom(appointmentId.toString(), "new_message", message);

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

    return message;
};

/**
 * Get chat history for an appointment
 */
export const getChatHistory = async (userId, appointmentId) => {
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

    const messages = await Message.find({ appointmentId })
        .sort({ createdAt: 1 })
        .lean();

    return messages;
};

/**
 * Mark messages as read by patient
 */
export const markMessagesRead = async (userId, appointmentId) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    await Message.updateMany(
        {
            appointmentId,
            patientId: patient._id,
            sender: "PROVIDER",
            readAt: { $exists: false }
        },
        { $set: { readAt: new Date() } }
    );

    return { success: true };
};
