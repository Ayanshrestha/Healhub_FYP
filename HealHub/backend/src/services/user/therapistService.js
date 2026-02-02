import Therapist from "../../models/therapist.js";

/**
 * Therapist specialized services
 */
export const getTherapistData = async (userId) => {
    return await Therapist.findOne({ userId });
};
