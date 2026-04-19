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
            refPath: 'providerType'
        },

        providerType: {
            type: String,
            required: true,
            enum: ["Doctor", "Therapist"],
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: false,
        },
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },
        sender: {
            type: String,
            enum: ["PATIENT", "PROVIDER", "CLINIC"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["TEXT", "PRESCRIPTION", "REPORT", "IMAGE"],
            default: "TEXT",
        },
        attachments: [{
            name: String,
            url: String,
        }],
        context: {
            type: String,
            enum: ["DIRECT", "CLINICAL"],
            default: "DIRECT",
        },
        readAt: {
            type: Date,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
