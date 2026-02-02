import * as reportService from "../../services/user/reportService.js";

export const list = async (req, res) => {
    try {
        const reports = await reportService.getAggregatedReports(req.user._id);
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
