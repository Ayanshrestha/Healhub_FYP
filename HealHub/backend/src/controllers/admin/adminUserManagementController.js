import * as adminUserManagementService from "../../services/admin/adminUserManagementService.js";

/**
 * Admin User Management Controller
 */
export const toggleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await adminUserManagementService.toggleUserStatus(userId, req.user._id);
        res.status(200).json({ message: `User status updated to ${result.status}`, data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { page, limit, role, status, search, sortBy, sortOrder } = req.query;
        const result = await adminUserManagementService.fetchUsers({
            page,
            limit,
            role,
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

export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await adminUserManagementService.getUserDetails(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
