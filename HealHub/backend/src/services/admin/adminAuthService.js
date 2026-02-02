import User from "../../models/user.js";
import bcrypt from "bcryptjs";

/**
 * Admin Login Business Logic
 */
export const adminLogin = async (input) => {
    const email = input.email?.trim();
    const password = input.password?.trim();

    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("Invalid admin credentials");
        error.statusCode = 401;
        throw error;
    }

    if (user.role !== "admin") {
        const error = new Error("Access denied. Admin privileges required.");
        error.statusCode = 403;
        throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        const error = new Error("Invalid admin credentials");
        error.statusCode = 401;
        throw error;
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    return {
        user: {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        profile: null,
    };
};
