import * as clinicAuthService from "../../services/clinic/clinicAuthService.js";

export const register = async (req, res) => {
    try {
        const result = await clinicAuthService.registerClinicInitial(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
