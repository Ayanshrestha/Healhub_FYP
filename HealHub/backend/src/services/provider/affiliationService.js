import Affiliation from "../../models/affiliation.js";
import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js";

export const applyToClinic = async (providerId, providerType, clinicId) => {
    // Prevent duplicate applications
    const existing = await Affiliation.findOne({ clinicId, providerId });
    if (existing) {
        throw new Error(`You have already applied to or are affiliated with this clinic. Current status: ${existing.status}`);
    }

    return await Affiliation.create({
        clinicId,
        providerId,
        providerType,
        requestedBy: "PROVIDER",
        status: "PENDING"
    });
};

export const inviteProvider = async (clinicId, providerId, providerType) => {
    // Prevent duplicate invitations
    const existing = await Affiliation.findOne({ clinicId, providerId });
    if (existing) {
        throw new Error(`This provider has already applied to or been invited by your clinic. Current status: ${existing.status}`);
    }

    return await Affiliation.create({
        clinicId,
        providerId,
        providerType,
        requestedBy: "CLINIC",
        status: "PENDING"
    });
};

export const updateAffiliationStatus = async (affiliationId, status) => {
    const affiliation = await Affiliation.findByIdAndUpdate(
        affiliationId,
        { status, affiliatedAt: status === "ACTIVE" ? new Date() : null },
        { new: true }
    );

    // If approved (ACTIVE), sync back to legacy Doctor/Therapist models for verification status
    if (status === "ACTIVE") {
        const Model = affiliation.providerType === "Doctor" ? Doctor : Therapist;
        await Model.findByIdAndUpdate(affiliation.providerId, {
            verificationStatus: "verified",
            verifiedBy: affiliation.clinicId,
            verifiedAt: new Date()
        });
    }

    return affiliation;
};

export const getAffiliationById = async (affiliationId) => {
    return await Affiliation.findById(affiliationId);
};

export const getProviderAffiliations = async (providerId) => {
    return await Affiliation.find({ providerId })
        .populate("clinicId", "clinicName email phone address");
};

export const getClinicProviders = async (clinicId) => {
    return await Affiliation.find({ clinicId, status: "ACTIVE" })
        .populate("providerId");
};

export const getUnaffiliatedDoctors = async (clinicId, specialization) => {
    // 1. Get all providerIds already linked to this clinic (any status)
    const existingAffiliations = await Affiliation.find({ clinicId }).select("providerId");
    const excludedIds = existingAffiliations.map(a => a.providerId);

    // 2. Find Doctors NOT in that list
    const query = { _id: { $nin: excludedIds }, verificationStatus: { $in: ["verified", "pending"] } };
    if (specialization) {
        query.specialization = new RegExp(specialization, "i");
    }

    return await Doctor.find(query).sort({ createdAt: -1 }).limit(50);
};
