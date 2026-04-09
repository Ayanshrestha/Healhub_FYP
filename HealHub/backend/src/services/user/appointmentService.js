import Appointment from "../../models/appointment.js";
import Doctor from "../../models/doctor.js";
import Affiliation from "../../models/affiliation.js";
import * as otpService from "../auth/otpService.js";
import { initiatePayment, initiateAppointmentPayment } from "../payment/paymentService.js";
import { createNotification } from "../common/notificationService.js";
import { sendEmail, getAppointmentRequestTemplate } from "../common/emailService.js";
import Clinic from "../../models/clinic.js";

/**
 * Get available slots for a doctor on a specific date
 */
export const getDoctorAvailability = async (doctorId, dateString) => {
    const date = new Date(dateString);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Use UTC methods to ensure consistent day selection regardless of server timezone
    const dayName = dayNames[date.getUTCDay()];

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    let availability = doctor.availability?.get(dayName);

    // Fallback for manually created doctors who haven't set specific availability yet
    // Default: Open 10:00 AM - 5:00 PM everyday
    if (!availability && (!doctor.availability || doctor.availability.size === 0)) {
        availability = {
            isClosed: false,
            slots: [
                "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
                "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
                "04:00 PM", "04:30 PM", "05:00 PM"
            ]
        };
    }

    if (!availability || availability.isClosed) {
        return [];
    }

    // 0. Check for Blocked Dates
    const isBlocked = doctor.blockedDates?.some(blockedDate => {
        const bd = new Date(blockedDate);
        return bd.getUTCFullYear() === date.getUTCFullYear() &&
            bd.getUTCMonth() === date.getUTCMonth() &&
            bd.getUTCDate() === date.getUTCDate();
    });

    if (isBlocked) {
        return [];
    }

    // --- AVAILABILITY ALGORITHM ---
    // 1. Calculate Start & End of the requested date
    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    // 2. Fetch all EXISTING bookings for this doctor on this specific date
    // We exclude "Cancelled" appointments so they become available again.
    const bookedSlots = await Appointment.find({
        providerId: doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ["Cancelled", "Rejected"] }
    }).select("timeSlot").lean();

    const bookedTimeSlots = bookedSlots.map(b => b.timeSlot);

    // 3. Subtract Booked Slots from Total Available Slots
    // Available = Total - Booked
    return availability.slots.filter(slot => !bookedTimeSlots.includes(slot));
};

/**
 * Send Booking OTP to phone
 */
export const sendBookingOtp = async (phone) => {
    return await otpService.sendOtp({ phone });
};

/**
 * Verify Booking OTP
 */
export const verifyBookingOtp = async (phone, otp) => {
    return await otpService.verifyOtp({ phone, otp });
};

/**
 * Create a new appointment
 */
export const createAppointment = async (userId, bookingData) => {
    const {
        doctorId,
        clinicId,
        appointmentDate,
        timeSlot,
        reason,
        visitType,
        paymentOption,
        phone,
        otp,
        homeAddress
    } = bookingData;

    // 1. Verify OTP
    await verifyBookingOtp(phone, otp);

    if (visitType === 'HOME_VISIT' && (!homeAddress || homeAddress.trim() === '')) {
        throw new Error("Full address is required for home visits.");
    }

    // 2. Validate Doctor & Affiliation
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== "active") {
        throw new Error("Doctor is not active or not found");
    }

    const affiliation = await Affiliation.findOne({
        clinicId,
        providerId: doctorId,
        status: "ACTIVE"
    });
    if (!affiliation) {
        throw new Error("Doctor is not clinic-approved or not affiliated with this clinic");
    }

    // 3. Double check slot availability (CRITICAL: Race Condition Prevention)
    // We check the DB one last time before converting the intent into an actual booking.
    // This prevents two users from booking the same slot at the exact same millisecond.
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Appointment.findOne({
        providerId: doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        timeSlot,
        status: { $nin: ["Cancelled", "Rejected"] } // Ignore cancelled and rejected ones
    });

    if (existingBooking) {
        throw new Error("This slot is already booked. Please choose another one.");
    }

    // 4. Get Patient ID
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    // 5. Create Appointment (Database Entry)
    // Inserts the new document with "Pending" status.
    const appointment = await Appointment.create({
        patientId: patient._id,
        providerId: doctorId,
        providerType: "Doctor",
        clinicId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: "Pending",
        appointmentType: visitType || "CLINIC_VISIT",
        homeAddress: visitType === 'HOME_VISIT' ? homeAddress : undefined,
        reason,
        consultationFee: visitType === 'HOME_VISIT' ? (doctor.consultationFee || 0) + 500 : (doctor.consultationFee || 0), // Base fee + 500 surcharge
        paymentStatus: "Pending", // Initial status
        paymentOption: paymentOption || "Clinic"
    });

    // Notify patient for confirmation
    await createNotification({
        recipientId: userId,
        type: "APPOINTMENT",
        title: "Appointment Requested 📨",
        message: `Your appointment request for Dr. ${doctor.fullName} has been received and is awaiting approval.`,
        data: { appointmentId: appointment._id }
    });

    // --- NEW: SEND REQUEST RECEIVED EMAIL ---
    if (patient && patient.email) {
        try {
            const clinic = await Clinic.findById(clinicId);
            const dateStr = new Date(appointmentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const emailHtml = getAppointmentRequestTemplate({
                patientName: patient.fullName,
                doctorName: doctor.fullName,
                clinicName: clinic ? clinic.clinicName : "HealHub Clinic",
                date: dateStr,
                timeSlot: timeSlot
            });

            await sendEmail({
                to: patient.email,
                subject: `Appointment Request Received: Dr. ${doctor.fullName} 📨`,
                html: emailHtml
            });
            console.log(`📧 Request email sent to ${patient.email}`);
        } catch (emailErr) {
            console.error("❌ Failed to send request received email:", emailErr);
        }
    }

    // In Model B (Pay After Approval), we DO NOT initiate payment here.
    // The patient only pays once the doctor approves the request.
    return { appointment, paymentData: null };
};

/**
 * Re-initiate payment for an Approved appointment
 */
export const reinitiateAppointmentPayment = async (userId, appointmentId) => {
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId: patient._id
    });

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "Approved") {
        throw new Error("Only approved appointments can be paid for.");
    }

    if (appointment.paymentStatus === "Paid") {
        throw new Error("This appointment is already paid for.");
    }

    // Ensure paymentOption is updated to "Online" when re-initiating digital payment
    appointment.paymentOption = "Online";
    await appointment.save();

    const { initiateAppointmentPayment } = await import("../payment/paymentService.js");
    const paymentData = await initiateAppointmentPayment(appointment._id);

    return paymentData;
};

/**
 * Get appointments for a patient (Upcoming or Past)
 */
export const getPatientAppointments = async (userId, type) => {
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const now = new Date();
    let query = { patientId: patient._id };

    if (type === "upcoming") {
        query.appointmentDate = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
        query.status = { $in: ["Pending", "Approved"] };
    } else if (type === "past") {
        query.$or = [
            { appointmentDate: { $lt: new Date(now.setHours(0, 0, 0, 0)) } },
            { status: { $in: ["Completed", "Cancelled", "Rejected"] } }
        ];
    }

    const appointments = await Appointment.find(query)
        .populate("providerId", "fullName specialization profilePhoto")
        .populate("clinicId", "clinicName address phone")
        .sort({ appointmentDate: type === "upcoming" ? 1 : -1 })
        .lean();

    return appointments;
};

/**
 * Get detailed appointment with timeline
 */
export const getAppointmentDetails = async (userId, appointmentId) => {
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId: patient._id
    })
        .populate("providerId", "fullName specialization profilePhoto qualification experienceYears consultationFee")
        .populate("clinicId", "clinicName address phone description")
        .lean();

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    // Dynamic timeline based on status and timestamps
    const timeline = [
        { status: "Booked", time: appointment.createdAt, completed: true }
    ];

    if (appointment.status === "Approved") {
        timeline.push({ status: "Approved", time: appointment.updatedAt, completed: true });
    } else if (appointment.status === "Rejected") {
        timeline.push({ status: "Rejected", time: appointment.updatedAt, completed: true });
    } else if (appointment.status === "Cancelled") {
        timeline.push({ status: "Cancelled", time: appointment.updatedAt, completed: true });
    } else if (appointment.status === "Completed") {
        timeline.push({ status: "Approved", time: appointment.updatedAt, completed: true }); // Mocked approval time
        timeline.push({ status: "Completed", time: appointment.updatedAt, completed: true });
    }

    return { ...appointment, timeline };
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (userId, appointmentId) => {
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId: patient._id
    });

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (!["Pending", "Approved", "Rescheduled"].includes(appointment.status)) {
        throw new Error(`Cannot cancel appointment with status: ${appointment.status}`);
    }

    const wasPaid = appointment.paymentStatus === "Paid";
    appointment.status = "Cancelled";

    if (wasPaid) {
        // In a production environment, you would call the Khalti Refund API here.
        // For now, we update the payment status to "Refunded" to acknowledge the need.
        appointment.paymentStatus = "Refunded";
        console.log(`💰 Appointment ${appointment._id} was paid. Refunding... (Placeholder logic)`);
    }

    await appointment.save();

    // Notify patient
    await createNotification({
        recipientId: userId,
        type: "APPOINTMENT",
        title: "Appointment Cancelled",
        message: `Your appointment with Dr. ${appointment.providerId?.fullName || 'the specialist'} has been cancelled.${wasPaid ? " A refund has been initiated." : ""}`,
        data: { appointmentId: appointment._id }
    });

    return appointment;
};

/**
 * Switch payment option to Clinic for an approved appointment
 */
export const switchToClinicPayment = async (userId, appointmentId) => {
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        patientId: patient._id
    }).populate("providerId", "fullName");

    if (!appointment) {
        const error = new Error("Appointment not found");
        error.statusCode = 404;
        throw error;
    }

    if (appointment.status !== "Approved") {
        throw new Error("Only approved appointments can be updated.");
    }

    if (appointment.paymentStatus === "Paid") {
        throw new Error("This appointment is already paid for.");
    }

    appointment.paymentOption = "Clinic";
    await appointment.save();

    // Create notification for the patient acknowledging the switch
    const { createNotification } = await import("../common/notificationService.js");
    await createNotification({
        recipientId: userId,
        type: "APPOINTMENT",
        title: "Payment Method Updated",
        message: `Your payment method for appointment with Dr. ${appointment.providerId?.fullName} has been switched to 'Pay at Clinic'.`,
        data: { appointmentId: appointment._id }
    });

    return appointment;
};
