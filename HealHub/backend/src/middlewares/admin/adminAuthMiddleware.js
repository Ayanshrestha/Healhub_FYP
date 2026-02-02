import User from "../../shared/models/user.js"; // This path might be wrong, wait
// Actually, in the user's template, models are in src/models/
import User from "../../models/user.js";
import { verifyJwt } from "../../utils/jwt.js";

const adminAuthMiddleware = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Admin access denied. No token provided." });
        }

        token = token.split(" ")[1];
        const decoded = await verifyJwt(token);
        const user = await User.findById(decoded.id).select("-password");

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Invalid or unauthorized admin token" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized admin access", error: error.message });
    }
};

export default adminAuthMiddleware;
