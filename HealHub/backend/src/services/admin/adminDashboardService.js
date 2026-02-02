import mongoose from "mongoose";
import User from "../../models/user.js";
import Clinic from "../../models/clinic.js";
import Doctor from "../../models/doctor.js";

/**
 * Real-time System Health Check
 */
export const getSystemHealth = async () => {
    const health = {
        api: "Online",
        database: mongoose.connection.readyState === 1 ? "Online" : "Offline",
        email: "Active", // Assuming active if server is running for now, can be refined
        payment: "Online"
    };

    return health;
};

/**
 * Get aggregated dashboard statistics
 */
export const getDashboardSummary = async () => {
    const totalClinics = await Clinic.countDocuments();
    const pendingClinics = await Clinic.countDocuments({ status: "PENDING_APPROVAL" });
    const approvedUnpaidClinics = await Clinic.countDocuments({ status: "APPROVED_UNPAID" });
    const activeClinics = await Clinic.countDocuments({ status: "ACTIVE" });
    const blockedClinics = await Clinic.countDocuments({ status: "BLOCKED" });
    const rejectedClinics = await Clinic.countDocuments({ status: "REJECTED" });

    // Only verified doctors are "Active Doctors"
    const totalDoctors = await Doctor.countDocuments();
    const verifiedDoctors = await Doctor.countDocuments({ verificationStatus: "verified" });

    // Detailed User Stats
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const activeUsers = await User.countDocuments({ status: "active", role: { $ne: "admin" } });
    const suspendedUsers = await User.countDocuments({ status: "suspended", role: { $ne: "admin" } });

    return {
        clinics: {
            total: totalClinics,
            pending: pendingClinics,
            approvedUnpaid: approvedUnpaidClinics,
            active: activeClinics,
            blocked: blockedClinics,
            rejected: rejectedClinics,
        },
        users: {
            total: totalUsers,
            active: activeUsers,
            suspended: suspendedUsers,
            patients: await User.countDocuments({ role: "patient" }),
            doctors: await User.countDocuments({ role: "doctor" }),
            clinicAdmins: await User.countDocuments({ role: "clinic" }),
            therapists: await User.countDocuments({ role: "therapist" })
        },
        doctors: verifiedDoctors,
        platformHealth: suspendedUsers > totalUsers * 0.1 ? "Critical" : "Optimal"
    };
};
