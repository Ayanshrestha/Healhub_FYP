import * as clinicDashboardService from "../../services/clinic/clinicDashboardService.js";

export const getStats = async (req, res) => {
    try {
        const stats = await clinicDashboardService.getDashboardStats(req.clinic._id);
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const analytics = await clinicDashboardService.getAnalyticsData(req.clinic._id);
        res.json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
