import Appointment from "../../models/appointment.js";
import * as providerService from "../../services/provider/providerService.js";
import { logAction } from "../../utils/auditLogger.js";
import { createNotification } from "../../services/notificationService.js";

export const getAppointments = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        const { status, clinicId } = req.query;

        const query = { providerId: provider._id };
        if (status) query.status = status;
        if (clinicId) query.clinicId = clinicId; // Isolation: allow filtering by clinic

        const appointments = await Appointment.find(query)
            .populate("patientId", "fullName email phone gender age")
            .populate("clinicId", "clinicName address")
            .sort({ appointmentDate: 1 });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, notes } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status, notes },
            { new: true }
        ).populate("providerId", "fullName");

        await logAction(req, "APPOINTMENT_STATUS_UPDATE", `Appointment ${appointmentId} set to ${status}`);

        // Notify Patient
        await createNotification({
            recipientId: appointment.patientId,
            recipientModel: "User",
            title: `Appointment ${status}`,
            message: `Your appointment with ${appointment.providerId.fullName} has been ${status}.`,
            type: "APPOINTMENT",
            priority: status === "Cancelled" ? "ERROR" : "SUCCESS"
        });

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { appointmentDate, timeSlot } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { appointmentDate, timeSlot, status: "Rescheduled" },
            { new: true }
        ).populate("providerId", "fullName");

        await logAction(req, "APPOINTMENT_RESCHEDULE", `Appointment ${appointmentId} rescheduled to ${appointmentDate}`);

        // Notify Patient
        await createNotification({
            recipientId: appointment.patientId,
            recipientModel: "User",
            title: "Appointment Rescheduled",
            message: `Your appointment with ${appointment.providerId.fullName} has been rescheduled to ${new Date(appointmentDate).toLocaleDateString()} at ${timeSlot}.`,
            type: "APPOINTMENT",
            priority: "WARNING"
        });

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAppointmentDetails = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId)
            .populate("patientId", "fullName email phone gender age bloodGroup address")
            .populate("clinicId", "clinicName address phone")
            .lean();

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Add calculated age if DOB exists but age doesn't (optional robustness)
        if (appointment.patientId && appointment.patientId.dob && !appointment.patientId.age) {
            const dob = new Date(appointment.patientId.dob);
            const ageDiffMs = Date.now() - dob.getTime();
            const ageDate = new Date(ageDiffMs);
            appointment.patientId.age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
