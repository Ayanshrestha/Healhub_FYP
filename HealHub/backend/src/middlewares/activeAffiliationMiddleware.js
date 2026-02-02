import Affiliation from "../models/affiliation.js";
import * as providerService from "../services/provider/providerService.js";

/**
 * Middleware to enforce that a provider has an ACTIVE affiliation with a specific clinic.
 * Expects clinicId in req.body, req.query, or req.params.
 */
export const enforceActiveAffiliation = async (req, res, next) => {
    try {
        const clinicId = req.body.clinicId || req.query.clinicId || req.params.clinicId;

        if (!clinicId) {
            return res.status(400).json({ success: false, message: "Clinic ID is required for this operation." });
        }

        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider profile not found." });
        }

        const affiliation = await Affiliation.findOne({
            clinicId,
            providerId: provider._id,
            status: "ACTIVE"
        });

        if (!affiliation) {
            return res.status(403).json({
                success: false,
                message: "Operation restricted: You do not have an ACTIVE affiliation with this clinic."
            });
        }

        req.affiliation = affiliation; // Attach for downstream use if needed
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
