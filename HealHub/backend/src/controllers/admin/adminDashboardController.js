import * as adminDashboardService from "../../services/admin/adminDashboardService.js";
import * as adminClinicApprovalService from "../../services/admin/adminClinicApprovalService.js";
import Doctor from "../../models/doctor.js";

/**
 * Admin Dashboard Controller - Unified Endpoint
 */
export const getStats = async (req, res) => {
    try {
        const [summary, health, { clinics: pendingClinics }] = await Promise.all([
            adminDashboardService.getDashboardSummary(),
            adminDashboardService.getSystemHealth(),
            adminClinicApprovalService.fetchClinics({ status: "PENDING_APPROVAL", limit: 5 })
        ]);

        // Fetch some doctors for oversight monitoring
        const doctorOversight = await Doctor.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            ...summary,
            health,
            pendingClinics,
            doctorOversight
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
