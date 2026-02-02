import * as adminAnalyticsService from "../../services/admin/adminAnalyticsService.js";

/**
 * Admin Analytics Controller
 */
export const getStats = async (req, res) => {
    try {
        const analytics = await adminAnalyticsService.getPlatformGrowth();
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
