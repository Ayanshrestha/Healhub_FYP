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
            enum: ["Pending", "Approved", "Confirmed", "Rescheduled", "Completed", "Cancelled", "Rejected", "No-Show"],
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
        paymentOption: {
            type: String,
            enum: ["Online", "Clinic"],
            default: "Clinic",
        },
        reason: {
            type: String,
        },
        notes: {
            type: String,
        },
        consultationFee: {
            type: Number,
            default: 0,
        },
        clinicEarning: {
            type: Number,
            default: 0,
        },
        doctorEarning: {
            type: Number,
            default: 0,
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
        rejectionEmailSent: {
            type: Boolean,
            default: false,
        },
        attachments: [
            {
                name: String,
                url: String,
                fileType: {
                    type: String,
                    enum: ["PRESCRIPTION", "REPORT", "OTHER"],
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
