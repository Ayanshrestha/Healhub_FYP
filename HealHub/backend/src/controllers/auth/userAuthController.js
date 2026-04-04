import * as userAuthService from "../../services/auth/userAuthService.js";
import { createJwt } from "../../utils/jwt.js";

/**
 * User Auth Controller (Patient, Doctor, Clinic, Therapist)
 */
export const startRegistration = async (req, res) => {
    try {
        console.log("--- REGISTRATION ATTEMPT ---");
        console.log("Body:", req.body);
        console.log("File:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            size: req.file.size
        } : "NONE");
        
        const result = await userAuthService.startRegistration(req.body, req.file);
        
        console.log("Registration outcome: SUCCESS");
        res.status(200).json({
            success: true,
            message: "Registration started. OTP sent.",
            data: result
        });

    } catch (error) {
        console.error("--- REGISTRATION FAILURE ---");
        console.error("Error Message:", error.message);
        console.error("Stack:", error.stack);
        
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const completeRegistration = async (req, res) => {
    try {
        const { user, profile } = await userAuthService.completeRegistration(req.body);
        const token = createJwt({ id: user._id, role: user.role });

        res.cookie("authToken", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user,
            profile
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { user, profile, nextStep } = await userAuthService.login(req.body);
        const token = createJwt({ id: user._id, role: user.role });

        res.cookie("authToken", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
            profile,
            nextStep
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
