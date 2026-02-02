import AuditLog from "../../models/auditLog.js";

/**
 * Fetch System Security Logs
 */
export const getSystemLogs = async (options = {}) => {
    const { page = 1, limit = 10 } = options;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await AuditLog.find()
        .populate("performedBy", "email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await AuditLog.countDocuments();

    return {
        logs,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

export const getLogsForExport = async () => {
    const logs = await AuditLog.find()
        .populate("performedBy", "email")
        .sort({ createdAt: -1 });

    const header = "Timestamp,Action,Performed By,IP Address,Details\n";
    const rows = logs.map(log =>
        `${new Date(log.createdAt).toISOString()},${log.action},${log.performedBy?.email || "System"},${log.ipAddress || "N/A"},"${(log.details || "").replace(/"/g, '""')}"`
    ).join("\n");

    return header + rows;
};
