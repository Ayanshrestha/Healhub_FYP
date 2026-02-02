import Clinic from "../models/clinic.js";

const clinicStatusMiddleware = async (req, res, next) => {
    try {
        if (req.user.role !== "clinic") {
            return next();
        }

        const clinic = await Clinic.findOne({ userId: req.user._id });
        if (!clinic) {
            return res.status(404).json({ message: "Clinic profile not found" });
        }

        if (clinic.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Access denied. Clinic subscription is not active.",
                status: clinic.status,
            });
        }

        req.clinic = clinic;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default clinicStatusMiddleware;
