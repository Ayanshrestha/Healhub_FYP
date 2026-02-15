import User from "../../models/user.js";
import Doctor from "../../models/doctor.js";
import Patient from "../../models/patient.js";
import Therapist from "../../models/therapist.js";
import Clinic from "../../models/clinic.js";
import AuditLog from "../../models/auditLog.js";

/**
 * Manage User account status
 */
export const toggleUserStatus = async (userId, adminId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const newStatus = user.status === "active" ? "suspended" : "active";
    user.status = newStatus;
    await user.save();

    if (user.role === "doctor") {
        await Doctor.findOneAndUpdate({ userId }, { status: newStatus });
    } else if (user.role === "clinic") {
        await Clinic.findOneAndUpdate({ userId }, { status: newStatus });
    }

    await AuditLog.create({
        action: `USER_${newStatus.toUpperCase()}`,
        performedBy: adminId,
        targetId: userId,
        details: `User account ${newStatus}`
    });

    // Notify other admins about user status change
    try {
        const admins = await User.find({ role: "admin" });
        const { createNotification } = await import("../common/notificationService.js");

        // Fetch user name for clearer notification
        let userName = user.email;
        if (user.role === "doctor") {
            const p = await Doctor.findOne({ userId: user._id });
            if (p) userName = p.fullName;
        } else if (user.role === "patient") {
            const p = await Patient.findOne({ userId: user._id });
            if (p) userName = p.fullName;
        }

        for (const admin of admins) {
            // Don't notify the admin who performed the action? Actually, better to notify all to keep them in sync
            await createNotification({
                recipientId: admin._id,
                recipientModel: "User",
                type: "SYSTEM",
                priority: newStatus === "suspended" ? "WARNING" : "SUCCESS",
                title: `User Account ${newStatus === "suspended" ? "Suspended" : "Activated"} 🛡️`,
                message: `Account for ${userName} (${user.role}) has been ${newStatus}.`,
                link: `/admin/users/${user._id}`
            });
        }
    } catch (notifyErr) {
        console.error("Failed to send user status notification:", notifyErr);
    }

    return user;
};

export const fetchUsers = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        role,
        status,
        search,
        sortBy = "lastActivity",
        sortOrder = "desc"
    } = options;

    const query = { role: { $ne: "admin" } }; // Never return admins in user list

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
        query.email = { $regex: search, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const users = await User.find(query)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(); // Use lean for performance since we're modifying objects

    const total = await User.countDocuments(query);

    // Resolve names for each user based on their role
    const usersWithNames = await Promise.all(users.map(async (user) => {
        let name = "N/A";
        try {
            if (user.role === "doctor") {
                const profile = await Doctor.findOne({ userId: user._id }).select("fullName");
                name = profile?.fullName || "N/A";
            } else if (user.role === "therapist") {
                const profile = await Therapist.findOne({ userId: user._id }).select("fullName");
                name = profile?.fullName || "N/A";
            } else if (user.role === "patient") {
                const profile = await Patient.findOne({ userId: user._id }).select("fullName");
                name = profile?.fullName || "N/A";
            } else if (user.role === "clinic") {
                const profile = await Clinic.findOne({ userId: user._id }).select("clinicName");
                name = profile?.clinicName || "N/A";
            }
        } catch (err) {
            console.error(`Error fetching profile for user ${user._id}:`, err);
        }
        return { ...user, name };
    }));

    return {
        users: usersWithNames,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

export const getUserDetails = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");

    let profile = null;
    const role = user.role.toLowerCase();

    if (role === "doctor") {
        profile = await Doctor.findOne({ userId });
    } else if (role === "therapist") {
        profile = await Therapist.findOne({ userId });
    } else if (role === "patient") {
        profile = await Patient.findOne({ userId });
    } else if (role === "clinic") {
        profile = await Clinic.findOne({ userId });
    }

    return { user, profile };
};
