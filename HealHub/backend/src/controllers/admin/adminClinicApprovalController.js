import * as adminClinicApprovalService from "../../services/admin/adminClinicApprovalService.js";

/**
 * Admin Clinic Approval Controller
 */
export const updateClinic = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const { status } = req.body;
        const result = await adminClinicApprovalService.updateClinicStatus(clinicId, status, req.user._id);
        res.status(200).json({ message: `Clinic ${status} successfully`, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getClinics = async (req, res) => {
    try {
        const { page, limit, status, search, sortBy, sortOrder } = req.query;
        const result = await adminClinicApprovalService.fetchClinics({
            page,
            limit,
            status,
            search,
            sortBy,
            sortOrder
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getClinicById = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const result = await adminClinicApprovalService.getClinicDetails(clinicId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
