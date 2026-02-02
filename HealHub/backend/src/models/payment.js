import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
        },
        paymentType: {
            type: String,
            enum: ["SUBSCRIPTION", "APPOINTMENT"],
            required: true,
        },
        plan: {
            type: String,
            enum: ["BASIC", "STANDARD", "PREMIUM"],
        },
        amount: {
            type: Number,
            required: true,
        },
        khaltiPid: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING",
        },
        remarks: {
            type: String,
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
