import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
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
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },
        sender: {
            type: String,
            enum: ["PATIENT", "PROVIDER"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["TEXT", "PRESCRIPTION", "REPORT"],
            default: "TEXT",
        },
        attachments: [{
            name: String,
            url: String,
        }],
        readAt: {
            type: Date,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
