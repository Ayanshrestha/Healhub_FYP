import * as clinicAuthService from "../../services/clinic/clinicAuthService.js";

/**
 * Called after OTP verification — creates the pending clinic record & notifies admin.
 */
export const registerFromOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        const result = await clinicAuthService.registerClinicFromOtp(email);
        res.status(201).json({
            message: "Clinic registration submitted. Awaiting admin approval.",
            clinicId: result._id,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
