import axios from "axios";
import config from "../../config/config.js";
import Clinic from "../../models/clinic.js";
import Payment from "../../models/payment.js";
import AuditLog from "../../models/auditLog.js";
import Appointment from "../../models/appointment.js";
import Doctor from "../../models/doctor.js";
import Patient from "../../models/patient.js";
import { SUBSCRIPTION_PLANS } from "../../constants/pricing.js";
import { createNotification } from "../common/notificationService.js";
import { sendEmail, getAppointmentConfirmationTemplate, getProviderBookingNotificationTemplate } from "../common/emailService.js";

/**
 * Initiate Khalti Payment
 */
export const initiatePayment = async (clinicId, planName) => {
    const plan = SUBSCRIPTION_PLANS[planName];
    if (!plan) {
        throw new Error("Invalid subscription plan selected");
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
        throw new Error("Clinic not found");
    }

    // Only APPROVED_UNPAID or BLOCKED (expired) clinics can pay
    if (clinic.status !== "APPROVED_UNPAID" && clinic.status !== "BLOCKED") {
        throw new Error("Payment is not required or allowed at this stage");
    }

    const payload = {
        return_url: config.khalti.returnUrl || "http://localhost:5173/payment-verification",
        website_url: "http://localhost:5173",
        amount: plan.amount * 100, // Khalti expects amount in paisa
        purchase_order_id: `${clinic._id}_${Date.now()}`,
        purchase_order_name: `${plan.name} Subscription`,
        customer_info: {
            name: clinic.ownerName,
            email: clinic.email,
            phone: "9800000001", // Use test number for sandbox initiation
        },
    };

    if (!config.khalti.secretKey) {
        throw new Error("Khalti Secret Key is not configured in the server");
    }

    try {
        const url = `${config.khalti.apiUrl || "https://a.khalti.com/api/v2"}/epayment/initiate/`;
        const response = await axios.post(
            url,
            payload,
            {
                headers: {
                    Authorization: `Key ${config.khalti.secretKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 10000, // 10 second timeout
            }
        );

        // Store payment record as PENDING
        await Payment.create({
            clinicId: clinic._id,
            paymentType: "SUBSCRIPTION",
            plan: plan.name,
            amount: plan.amount,
            khaltiPid: response.data.pidx,
            status: "PENDING",
        });

        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Khalti Initiation Failed: ${message}`);
    }
};

/**
 * Initiate Appointment Payment (Consultation Fee)
 */
export const initiateAppointmentPayment = async (appointmentId) => {
    const appointment = await Appointment.findById(appointmentId)
        .populate("patientId")
        .populate("providerId");

    if (!appointment) throw new Error("Appointment not found");

    const doctor = await Doctor.findById(appointment.providerId);
    if (!doctor) throw new Error("Doctor not found for this appointment");

    const amount = doctor.consultationFee || 500;

    const payload = {
        return_url: "http://localhost:5173/patient/payment-verification",
        website_url: "http://localhost:5173",
        amount: amount * 100, // paisa
        purchase_order_id: `APP_${appointment._id}_${Date.now()}`,
        purchase_order_name: `Consultation with Dr. ${doctor.fullName}`,
        customer_info: {
            name: appointment.patientId.fullName || "Patient",
            email: "patient@healhub.com",
            phone: appointment.patientId.phone || "9800000000",
        },
    };

    try {
        const url = `${config.khalti.apiUrl || "https://a.khalti.com/api/v2"}/epayment/initiate/`;
        const response = await axios.post(
            url,
            payload,
            {
                headers: {
                    Authorization: `Key ${config.khalti.secretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Store payment record
        await Payment.create({
            appointmentId: appointment._id,
            patientId: appointment.patientId._id,
            doctorId: doctor._id,
            paymentType: "APPOINTMENT",
            amount: amount,
            khaltiPid: response.data.pidx,
            status: "PENDING",
        });

        return response.data;
    } catch (error) {
        throw new Error(`Khalti Initiation Failed: ${error.response?.data?.message || error.message}`);
    }
};

/**
 * Verify Khalti Payment
 */
export const verifyPayment = async (pidx) => {
    const url = `${config.khalti.apiUrl || "https://a.khalti.com/api/v2"}/epayment/lookup/`;
    const response = await axios.post(
        url,
        { pidx },
        {
            headers: {
                Authorization: `Key ${config.khalti.secretKey}`,
                "Content-Type": "application/json",
            },
        }
    );

    const { status, transaction_id } = response.data;

    if (status === "Completed" || status === "completed") {
        const payment = await Payment.findOne({ khaltiPid: pidx });
        if (!payment) throw new Error("Payment record not found");

        // Update Payment
        payment.status = "COMPLETED";
        payment.transactionId = transaction_id;
        payment.paidAt = new Date();
        await payment.save();

        if (payment.paymentType === "SUBSCRIPTION") {
            const clinic = await Clinic.findById(payment.clinicId);
            if (!clinic) throw new Error("Clinic not found for this payment");

            const startDate = new Date();
            const endDate = new Date();
            const plan = SUBSCRIPTION_PLANS[payment.plan];
            endDate.setMonth(startDate.getMonth() + plan.durationInMonths);

            clinic.status = "ACTIVE";
            clinic.subscriptionPlan = plan.name;
            clinic.subscriptionStatus = "ACTIVE";
            clinic.subscriptionStartDate = startDate;
            clinic.subscriptionEndDate = endDate;
            await clinic.save();

            // Notify Admin of Payment
            try {
                const admin = await User.findOne({ role: "admin" }); // Re-fetch admin to be safe
                if (admin) {
                    await createNotification({
                        recipientId: admin._id,
                        recipientModel: "User",
                        type: "PAYMENT",
                        title: "Subscription Renewed 💰",
                        message: `${clinic.name} has successfully subscribed to the ${plan.name} plan.`,
                        priority: "medium",
                        link: `/admin/clinics/${clinic._id}`,
                        data: { clinicId: clinic._id, paymentId: payment._id }
                    });
                }
            } catch (error) {
                console.error("Failed to notify admin of payment:", error);
            }

            return { success: true, clinic };
        } else {
            const appointment = await Appointment.findById(payment.appointmentId);
            if (!appointment) throw new Error("Appointment not found");

            appointment.status = "Approved";
            appointment.paymentStatus = "Paid";
            await appointment.save();

            // Populate everything for the email
            const populatedAppt = await Appointment.findById(appointment._id)
                .populate("patientId")
                .populate("providerId")
                .populate("clinicId");

            const patient = populatedAppt.patientId;
            const doctor = populatedAppt.providerId;
            const clinic = populatedAppt.clinicId;

            // --- HOSPITAL GRADE EMAIL NOTIFICATIONS ---
            if (patient && patient.email) {
                try {
                    const dateStr = populatedAppt.appointmentDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    // 1. Send Confirmation to Patient
                    const patientEmailHtml = getAppointmentConfirmationTemplate({
                        patientName: patient.fullName,
                        doctorName: doctor ? doctor.fullName : "Specialist",
                        clinicName: clinic ? clinic.clinicName : "HealHub Clinic",
                        date: dateStr,
                        timeSlot: populatedAppt.timeSlot,
                        bookingRef: populatedAppt._id.toString().slice(-6).toUpperCase(),
                        amount: payment.amount
                    });

                    await sendEmail({
                        to: patient.email,
                        subject: `Appointment Confirmed: #${populatedAppt._id.toString().slice(-6).toUpperCase()} ✅`,
                        html: patientEmailHtml
                    });

                    // 2. Send Notification to Doctor/Clinic (Optional but requested)
                    if (clinic && clinic.email) {
                        const providerEmailHtml = getProviderBookingNotificationTemplate({
                            providerName: doctor ? doctor.fullName : "Specialist",
                            patientName: patient.fullName,
                            clinicName: clinic.clinicName,
                            date: dateStr,
                            timeSlot: populatedAppt.timeSlot,
                            bookingRef: populatedAppt._id.toString().slice(-6).toUpperCase()
                        });

                        await sendEmail({
                            to: clinic.email,
                            subject: `New Appointment Booking: #${populatedAppt._id.toString().slice(-6).toUpperCase()} 📅`,
                            html: providerEmailHtml
                        });
                    }

                    // Update flag
                    appointment.confirmationEmailSent = true;
                    await appointment.save();

                } catch (emailErr) {
                    console.error("❌ Failed to send appointment confirmation email:", emailErr);
                }
            }

            // Notify patient via In-App Notification
            const PatientUser = await Patient.findById(appointment.patientId).populate("userId");
            if (PatientUser) {
                await createNotification({
                    recipientId: PatientUser.userId._id,
                    type: "APPOINTMENT",
                    title: "Payment Successful 💰",
                    message: `Your payment was verified. Appointment with Dr. ${doctor?.fullName || 'the specialist'} is now Approved.`,
                    data: { appointmentId: appointment._id }
                });
            }

            return { success: true, appointment };
        }
    } else {
        await Payment.findOneAndUpdate({ khaltiPid: pidx }, { status: "FAILED" });
        throw new Error(`Payment failed with status: ${status}`);
    }
};
