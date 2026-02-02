import Appointment from "../../models/appointment.js";
import Doctor from "../../models/doctor.js";
import Affiliation from "../../models/affiliation.js";
import * as otpService from "../auth/otpService.js";
import { initiatePayment, initiateAppointmentPayment } from "../payment/paymentService.js";
import { createNotification } from "../common/notificationService.js";

/**
 * Get available slots for a doctor on a specific date
 */
export const getDoctorAvailability = async (doctorId, dateString) => {
    const date = new Date(dateString);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()];

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const availability = doctor.availability?.get(dayName);
    if (!availability || availability.isClosed) {
        return [];
    }

    // Get existing bookings for this doctor on this date
    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSlots = await Appointment.find({
        providerId: doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "Cancelled" }
    }).select("timeSlot").lean();

    const bookedTimeSlots = bookedSlots.map(b => b.timeSlot);

    // Filter available slots
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
        otp
    } = bookingData;

    // 1. Verify OTP
    await verifyBookingOtp(phone, otp);

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

    // 3. Double check slot availability
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await Appointment.findOne({
        providerId: doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        timeSlot,
        status: { $ne: "Cancelled" }
    });

    if (existingBooking) {
        throw new Error("This slot is already booked. Please choose another one.");
    }

    // 4. Get Patient ID
    const Patient = (await import("../../models/patient.js")).default;
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    // 5. Create Appointment
    const appointment = await Appointment.create({
        patientId: patient._id,
        providerId: doctorId,
        providerType: "Doctor",
        clinicId,
        appointmentDate: new Date(appointmentDate),
        timeSlot,
        status: "Pending",
        appointmentType: visitType || "CLINIC_VISIT",
        reason,
        paymentStatus: "Pending" // Initial status
    });

    // Notify Clinic/Provider if needed (future), but let's notify the patient for confirmation
    await createNotification({
        recipientId: userId,
        type: "APPOINTMENT",
        title: "Appointment Booked",
        message: `Your appointment with Dr. ${doctor.fullName} on ${appointmentDate} at ${timeSlot} has been booked.`,
        data: { appointmentId: appointment._id }
    });

    let paymentData = null;
    if (paymentOption === "Online") {
        paymentData = await initiateAppointmentPayment(appointment._id);
    }

    return { appointment, paymentData };
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

    if (!["Pending", "Approved"].includes(appointment.status)) {
        throw new Error(`Cannot cancel appointment with status: ${appointment.status}`);
    }

    appointment.status = "Cancelled";
    await appointment.save();

    // Notify patient
    await createNotification({
        recipientId: userId,
        type: "APPOINTMENT",
        title: "Appointment Cancelled",
        message: `Your appointment with Dr. ${appointment.providerId?.fullName || 'the specialist'} has been cancelled.`,
        data: { appointmentId: appointment._id }
    });

    return appointment;
};
