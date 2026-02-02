import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            // e.g., "LOGIN_SUCCESS", "LOGIN_FAILED", "CLINIC_APPROVED", "CLINIC_REJECTED", "USER_SUSPENDED", "USER_ACTIVATED"
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // can be null for system actions or failed logins
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // the ID of the clinic or user being modified
        },
        details: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
