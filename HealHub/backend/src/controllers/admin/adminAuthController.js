import * as adminAuthService from "../../services/admin/adminAuthService.js";
import AuditLog from "../../models/auditLog.js";
import { createJwt } from "../../utils/jwt.js";

/**
 * Admin Login Controller
 */
export const loginAdmin = async (req, res) => {
    try {
        const input = req.body;
        console.log("ADMIN LOGIN ATTEMPT:", input);
        const { user, profile } = await adminAuthService.adminLogin(input);

        const token = createJwt({
            id: user._id,
            role: user.role,
        });

        // Log Successful Login
        await AuditLog.create({
            action: "ADMIN_LOGIN_SUCCESS",
            performedBy: user._id,
            details: `Admin ${user.email} logged in successfully`,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.status(200).json({
            message: "Admin login successful",
            token,
            user,
            profile,
        });

    } catch (error) {
        // Log Failed Login
        await AuditLog.create({
            action: "ADMIN_LOGIN_FAILED",
            details: `Log in failed for: ${req.body.email}. Reason: ${error.message}`,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.status(error.statusCode || 500).json({
            message: error.message || "Admin login failed",
        });
    }
};
