import User from "../../models/user.js";
import Doctor from "../../models/doctor.js";
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
        .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    return {
        users,
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
