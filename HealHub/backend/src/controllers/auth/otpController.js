import * as otpService from "../../services/auth/otpService.js";

/**
 * OTP Controller
 */
export const sendOtp = async (req, res) => {
    try {
        const { email, phone } = req.body;
        const result = await otpService.sendOtp({
            email: email?.trim(),
            phone: phone?.trim()
        });
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, phone, otp, deleteAfter } = req.body;
        const result = await otpService.verifyOtp({
            email: email?.trim(),
            phone: phone?.trim(),
            otp: otp?.trim(),
            deleteAfter: deleteAfter !== undefined ? deleteAfter : true
        });
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
