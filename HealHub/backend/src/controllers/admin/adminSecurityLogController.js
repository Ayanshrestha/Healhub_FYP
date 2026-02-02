import * as adminSecurityLogService from "../../services/admin/adminSecurityLogService.js";

/**
 * Admin Security Log Controller
 */
export const getLogs = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const data = await adminSecurityLogService.getSystemLogs({ page, limit });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const exportLogs = async (req, res) => {
    try {
        const csv = await adminSecurityLogService.getLogsForExport();
        res.header("Content-Type", "text/csv");
        res.attachment(`audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
