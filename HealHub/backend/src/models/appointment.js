import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "providerType",
            required: true,
        },
        providerType: {
            type: String,
            required: true,
            enum: ["Doctor", "Therapist"],
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
        appointmentDate: {
            type: Date,
            required: true,
        },
        timeSlot: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            // Pending: Created but waiting for something (or just created)
            // Approved: Confirmed by system/doctor
            // Cancelled: Slot is freed up
            enum: ["Pending", "Approved", "Confirmed", "Rescheduled", "Completed", "Cancelled"],
            default: "Pending",
        },
        appointmentType: {
            type: String,
            enum: ["CLINIC_VISIT", "HOME_VISIT"],
            default: "CLINIC_VISIT",
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Refunded"],
            default: "Pending",
        },
        reason: {
            type: String,
        },
        notes: {
            type: String,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        confirmationEmailSent: {
            type: Boolean,
            default: false,
        },
        reminder24hSent: {
            type: Boolean,
            default: false,
        },
        reminder1hSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
