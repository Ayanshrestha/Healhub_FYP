import Appointment from "../../models/appointment.js";
import { createNotification } from "../common/notificationService.js";
import Patient from "../../models/patient.js";

export const getClinicAppointments = async (clinicId, filters = {}) => {
    let query = { clinicId };
    if (filters.status) query.status = filters.status;
    if (filters.doctorId) query.doctorId = filters.doctorId;

    return await Appointment.find(query)
        .populate("patientId", "fullName email phone gender dob")
        .populate("doctorId", "fullName specialization")
        .sort({ appointmentDate: 1 });
};

export const updateAppointmentStatus = async (appointmentId, status, clinicId) => {
    const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId, clinicId },
        { status },
        { new: true }
    ).populate("patientId").populate("doctorId");

    if (appointment) {
        // Find patient user to send notification
        const patient = await Patient.findById(appointment.patientId._id).populate("userId");
        if (patient) {
            await createNotification({
                recipientId: patient.userId._id,
                type: "APPOINTMENT",
                title: `Appointment ${status} 📅`,
                message: `Your appointment with Dr. ${appointment.doctorId?.fullName || 'the specialist'} has been ${status.toLowerCase()}.`,
                data: { appointmentId: appointment._id }
            });
        }
    }

    return appointment;
};
