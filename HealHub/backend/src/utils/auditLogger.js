import AuditLog from "../models/auditLog.js";

/**
 * Log a critical system action
 */
export const logAction = async (req, action, details) => {
    try {
        await AuditLog.create({
            performedBy: req.user?._id,
            action,
            details,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers["user-agent"]
        });
    } catch (error) {
        console.error("Failed to create audit log:", error.message);
    }
};
