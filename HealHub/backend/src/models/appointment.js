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
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
