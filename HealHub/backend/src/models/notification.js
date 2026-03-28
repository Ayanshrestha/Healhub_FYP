import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientModel: {
            type: String,
            enum: ["User", "Clinic", "Admin"],
            default: "User",
        },
        type: {
            type: String,
            enum: ["APPOINTMENT", "MESSAGE", "REMINDER", "SYSTEM", "MEDICINE", "CLINIC", "PAYMENT", "CLINICAL"],
            required: true,
        },
        priority: {
            type: String,
            enum: ["LOW", "NORMAL", "HIGH", "URGENT", "SUCCESS", "INFO", "WARNING", "ERROR"],
            default: "NORMAL",
        },
        link: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
        },
        readAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
