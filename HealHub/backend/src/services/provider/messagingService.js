import Message from "../../models/message.js";
import Appointment from "../../models/appointment.js";
import Affiliation from "../../models/affiliation.js";
import { emitToRoom } from "../../config/socket.js";

export const sendMessage = async (messageData) => {
    const { patientId, providerId, appointmentId } = messageData;

    // Security: Validate that an appointment exists between these parties
    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId,
        providerId
    });

    if (!appointment) {
        throw new Error("Cannot message: No valid appointment found between parties.");
    }

    // STEP 5: Enforce ACTIVE affiliation between the provider and the clinic of the appointment
    const affiliation = await Affiliation.findOne({
        clinicId: appointment.clinicId,
        providerId: appointment.providerId,
        status: "ACTIVE"
    });

    if (!affiliation) {
        throw new Error("Cannot message: Provider does not have an ACTIVE affiliation with this clinic.");
    }

    const message = await Message.create(messageData);

    // Real-time emission
    emitToRoom(appointmentId.toString(), "new_message", message);

    return message;
};

export const getConversationHistory = async (appointmentId) => {
    return await Message.find({ appointmentId }).sort({ createdAt: 1 });
};

export const markAsRead = async (messageIds) => {
    return await Message.updateMany(
        { _id: { $in: messageIds } },
        { readAt: new Date() }
    );
};
