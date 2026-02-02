import * as paymentService from "../../services/payment/paymentService.js";
import Clinic from "../../models/clinic.js";

export const initiatePayment = async (req, res) => {
    try {
        const { plan } = req.body;
        // Get clinicId from logged in user
        const clinic = await Clinic.findOne({ userId: req.user._id });
        if (!clinic) {
            return res.status(404).json({ message: "Clinic profile not found" });
        }

        const data = await paymentService.initiatePayment(clinic._id, plan);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { pidx } = req.body;
        const result = await paymentService.verifyPayment(pidx);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
