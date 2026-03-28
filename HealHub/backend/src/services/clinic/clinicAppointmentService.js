import Appointment from "../../models/appointment.js";
import Message from "../../models/message.js";
import { createNotification } from "../common/notificationService.js";
import Patient from "../../models/patient.js";
import { sendEmail, getAppointmentConfirmationTemplate, getAppointmentRejectionTemplate, getPaymentRequiredTemplate } from "../common/emailService.js";

export const getClinicAppointments = async (clinicId, filters = {}) => {
    let query = { clinicId };
    if (filters.status) query.status = filters.status;
    if (filters.doctorId) query.providerId = filters.doctorId;

    const appointments = await Appointment.find(query)
        .populate("patientId", "fullName email phone gender dob age")
        .populate({ path: "providerId", select: "fullName specialization" })
        .sort({ appointmentDate: 1 })
        .lean();

    // Map to flatter structure for frontend and include unread counts
    const appointmentsWithUnread = await Promise.all(appointments.map(async (appt) => {
        const unreadCount = await Message.countDocuments({
            appointmentId: appt._id,
            context: "CLINICAL",
            sender: "PATIENT",
            readAt: { $exists: false }
        });

        return {
            _id: appt._id,
            patientName: appt.patientId?.fullName || "Unknown Patient",
            patientAge: appt.patientId?.age || "N/A",
            doctorName: appt.providerId?.fullName || "Not Assigned",
            specialization: appt.providerId?.specialization || "N/A",
            dateTime: `${new Date(appt.appointmentDate).toLocaleDateString()} ${appt.timeSlot}`,
            status: appt.status,
            paymentStatus: appt.paymentStatus, // Added payment status
            unreadCount
        };
    }));

    return appointmentsWithUnread;
};

export const updateAppointmentStatus = async (appointmentId, status, clinicId) => {
    const appointment = await Appointment.findOne({ _id: appointmentId, clinicId })
        .populate("patientId")
        .populate("providerId")
        .populate("clinicId");

    if (!appointment) return null;

    appointment.status = status;

    // --- NEW: Handle Earnings for 'Pay at Clinic' on Completion ---
    if (status === "Completed" && !appointment.doctorEarning) {
        const fee = appointment.consultationFee || (appointment.providerId?.consultationFee) || 500;
        appointment.clinicEarning = Number((fee * 0.30).toFixed(2));
        appointment.doctorEarning = Number((fee * 0.70).toFixed(2));
        appointment.paymentStatus = "Paid"; // Mark as paid since it's completed at clinic
    }

    await appointment.save();

    // Find patient user to send notification
    const patient = appointment.patientId;
    const doctor = appointment.providerId;
    const clinic = appointment.clinicId;

    if (patient) {
        // In-App Notification
        const patientUser = await Patient.findById(patient._id).populate("userId");
        if (patientUser) {
            await createNotification({
                recipientId: patientUser.userId._id,
                type: "APPOINTMENT",
                title: `Appointment ${status} 📅`,
                message: `Your appointment with Dr. ${doctor?.fullName || 'the specialist'} has been ${status.toLowerCase()}.`,
                data: { appointmentId: appointment._id }
            });
        }

        // Email Notification
        if (patient.email) {
            try {
                const dateStr = appointment.appointmentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // 1. Send Confirmation or Payment Required (Pending -> Approved)
                if (status === "Approved" && !appointment.confirmationEmailSent) {
                    if (appointment.paymentOption === "Online" && appointment.paymentStatus === "Pending") {
                        // MODEL B: Send Payment Required Email
                        const emailHtml = getPaymentRequiredTemplate({
                            patientName: patient.fullName,
                            doctorName: doctor?.fullName || "Specialist",
                            clinicName: clinic?.clinicName || "HealHub Clinic",
                            date: dateStr,
                            timeSlot: appointment.timeSlot,
                            amount: doctor?.consultationFee || "N/A"
                        });

                        await sendEmail({
                            to: patient.email,
                            subject: `Action Required: Pay for your appointment with Dr. ${doctor?.fullName} 💳`,
                            html: emailHtml
                        });

                        await createNotification({
                            recipientId: patientUser.userId._id,
                            type: "APPOINTMENT",
                            title: "Payment Required 💳",
                            message: `Your appointment with Dr. ${doctor?.fullName} is approved. Please complete payment to confirm your slot.`,
                            priority: "URGENT"
                        });
                    } else {
                        // For Pay at Clinic or already paid
                        const emailHtml = getAppointmentConfirmationTemplate({
                            patientName: patient.fullName,
                            doctorName: doctor?.fullName || "Specialist",
                            clinicName: clinic?.clinicName || "HealHub Clinic",
                            date: dateStr,
                            timeSlot: appointment.timeSlot,
                            bookingRef: appointment._id.toString().slice(-6).toUpperCase(),
                            amount: doctor?.consultationFee || "N/A"
                        });

                        await sendEmail({
                            to: patient.email,
                            subject: `Appointment Confirmed: Dr. ${doctor?.fullName} ✅`,
                            html: emailHtml
                        });

                        appointment.confirmationEmailSent = true;
                    }
                    await appointment.save();
                }

                if (status === "Rejected" && !appointment.rejectionEmailSent) {
                    const emailHtml = getAppointmentRejectionTemplate({
                        patientName: patient.fullName,
                        doctorName: doctor?.fullName || "Specialist",
                        date: dateStr,
                        timeSlot: appointment.timeSlot,
                        reason: appointment.notes || "No specific reason provided"
                    });

                    await sendEmail({
                        to: patient.email,
                        subject: `Update regarding your appointment request 🛑`,
                        html: emailHtml
                    });

                    appointment.rejectionEmailSent = true;
                    await appointment.save();
                }
            } catch (emailErr) {
                console.error("❌ Failed to send clinic status update email:", emailErr);
            }
        }
    }

    return appointment;
};
