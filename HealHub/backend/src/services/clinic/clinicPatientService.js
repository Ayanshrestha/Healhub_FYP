import Appointment from "../../models/appointment.js";
import Patient from "../../models/patient.js";
import Message from "../../models/message.js";

export const getClinicPatients = async (clinicId) => {
    // Get unique patient IDs from appointments at this clinic
    const patientIds = await Appointment.distinct("patientId", { clinicId });

    // Fetch patient details
    const patients = await Patient.find({ _id: { $in: patientIds } })
        .select("fullName gender phone dob createdAt")
        .sort({ fullName: 1 })
        .lean();

    // Attach the most recent appointment ID and unread count for each patient at this clinic
    // This provides the context needed for ClinicalMessaging
    const patientsWithContext = await Promise.all(patients.map(async (patient) => {
        const latestAppt = await Appointment.findOne({ patientId: patient._id, clinicId })
            .sort({ appointmentDate: -1, createdAt: -1 })
            .select("_id");

        let unreadCount = 0;
        if (latestAppt) {
            unreadCount = await Message.countDocuments({
                appointmentId: latestAppt._id,
                context: "CLINICAL",
                sender: "PATIENT",
                readAt: { $exists: false }
            });
        }

        return {
            ...patient,
            latestAppointmentId: latestAppt?._id,
            unreadCount
        };
    }));

    return patientsWithContext;
};

export const getPatientHistory = async (patientId, clinicId) => {
    return await Appointment.find({ patientId, clinicId })
        .populate("doctorId", "fullName specialization")
        .sort({ appointmentDate: -1 });
};
