import Appointment from "../../models/appointment.js";
import Patient from "../../models/patient.js";

export const getClinicPatients = async (clinicId) => {
    // Get unique patient IDs from appointments at this clinic
    const patientIds = await Appointment.distinct("patientId", { clinicId });

    // Fetch patient details (sanitized as per requirements)
    return await Patient.find({ _id: { $in: patientIds } })
        .select("fullName gender phone dob createdAt")
        .sort({ fullName: 1 });
};

export const getPatientHistory = async (patientId, clinicId) => {
    return await Appointment.find({ patientId, clinicId })
        .populate("doctorId", "fullName specialization")
        .sort({ appointmentDate: -1 });
};
