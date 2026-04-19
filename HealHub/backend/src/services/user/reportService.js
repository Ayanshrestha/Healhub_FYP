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


    // 2. Get reports from appointments
    const appointments = await Appointment.find({
        patientId,
        "attachments.0": { $exists: true }
    }).populate("providerId", "fullName specialization")
        .populate("clinicId", "clinicName")
        .lean();

    const appointmentReports = appointments.flatMap(appt => appt.attachments.map(att => ({
        originalName: att.name,
        url: att.url,
        type: att.fileType,
        providerName: appt.providerId?.fullName || "Health Provider",
        clinicName: appt.clinicId?.clinicName || "HealHub Facility",
        createdAt: att.uploadedAt || appt.createdAt,
        source: "Appointment"
    })));

    // 3. Merge and sort all reports by date
    const allReports = [...messageReports, ...appointmentReports];

    return allReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
