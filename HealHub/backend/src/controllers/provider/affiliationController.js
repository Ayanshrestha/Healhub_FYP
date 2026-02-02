import * as affiliationService from "../../services/provider/affiliationService.js";
import * as providerService from "../../services/provider/providerService.js";
import { createNotification } from "../../services/notificationService.js";

export const applyToClinic = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        const { clinicId } = req.body;

        const affiliation = await affiliationService.applyToClinic(
            provider._id,
            req.user.role === "doctor" ? "Doctor" : "Therapist",
            clinicId
        );

        // Notify Clinic
        await createNotification({
            recipientId: clinicId,
            recipientModel: "Clinic",
            title: "New Affiliation Request",
            message: `${provider.fullName} has applied to join your clinic.`,
            type: "CLINIC"
        });

        res.status(201).json({ success: true, affiliation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAffiliation = async (req, res) => {
    try {
        const { affiliationId, status } = req.body;
        const providerId = (await providerService.getProviderProfile(req.user._id, req.user.role))._id;

        // Security: Find affiliation first to check ownership and requestedBy
        const affiliation = await affiliationService.getAffiliationById(affiliationId);

        if (!affiliation || affiliation.providerId.toString() !== providerId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this affiliation." });
        }

        // Providers can only accept/reject invitations (requestedBy: CLINIC)
        if (affiliation.requestedBy !== "CLINIC") {
            return res.status(400).json({ success: false, message: "Providers can only respond to invitations from clinics." });
        }

        const updated = await affiliationService.updateAffiliationStatus(affiliationId, status);

        // Notify Clinic
        await createNotification({
            recipientId: affiliation.clinicId,
            recipientModel: "Clinic",
            title: "Affiliation Invitation Update",
            message: `${req.user.role === 'doctor' ? 'Doctor' : 'Therapist'} has ${status.toLowerCase()} your invitation.`,
            type: "CLINIC",
            priority: status === "ACTIVE" ? "SUCCESS" : "INFO"
        });

        res.status(200).json({ success: true, affiliation: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyAffiliations = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        const affiliations = await affiliationService.getProviderAffiliations(provider._id);
        res.status(200).json({ success: true, affiliations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
