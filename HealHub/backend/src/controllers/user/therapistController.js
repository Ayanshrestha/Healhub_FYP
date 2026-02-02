import * as therapistService from "../../services/user/therapistService.js";

export const getProfile = async (req, res) => {
    try {
        const result = await therapistService.getTherapistData(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
