import Message from "../../models/message.js";
import Appointment from "../../models/appointment.js";
import Patient from "../../models/patient.js";

/**
 * Get all reports and prescriptions for a patient
 */
export const getAggregatedReports = async (userId) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const patientId = patient._id;

    // 1. Get reports from messages (type: PRESCRIPTION or REPORT)
    const messages = await Message.find({
        patientId,
        type: { $in: ["PRESCRIPTION", "REPORT"] },
        attachments: { $exists: true, $not: { $size: 0 } }
    }).populate("providerId", "fullName specialization")
        .populate("clinicId", "clinicName")
        .sort({ createdAt: -1 })
        .lean();

    const messageReports = messages.flatMap(msg => msg.attachments.map(att => ({
        originalName: att.name,
        url: att.url,
        type: msg.type,
        providerName: msg.providerId?.fullName || "Facility Staff",
        clinicName: msg.clinicId?.clinicName || "Private Practice",
        createdAt: msg.createdAt,
        source: "Message"
    })));


    // 2. Get reports from appointments (future integration: doctors might upload directly to appointment)
    // For now, let's assume notes could contain links or we add an attachments field to Appointment
    // Since we don't have attachments in Appointment model yet, let's just focus on Messages

    return messageReports.sort((a, b) => b.date - a.date);
};
