import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js";
import Affiliation from "../../models/affiliation.js";
import * as affiliationService from "../../services/provider/affiliationService.js";

export const getAffiliatedDoctors = async (clinicId) => {
    // 1. Get doctors via Affiliations (Modern Flow)
    const affiliations = await Affiliation.find({ clinicId, status: "ACTIVE", providerType: "Doctor" })
        .populate({
            path: "providerId",
            populate: { path: "userId", select: "fullName email profilePhoto" }
        });
    const affiliatedDoctors = affiliations.map(a => a.providerId);

    // 2. Get doctors manually verified by this clinic (Legacy/Direct Flow)
    const manualDoctors = await Doctor.find({ verifiedBy: clinicId })
        .populate("userId", "fullName email profilePhoto");

    // 3. Merge and deduplicate by _id
    const allDoctors = [...affiliatedDoctors, ...manualDoctors];
    const uniqueDoctors = Array.from(new Map(allDoctors.map(doctor => [doctor._id.toString(), doctor])).values());

    return uniqueDoctors;
};

export const getAvailableDoctors = async (clinicId, specialization) => {
    return await affiliationService.getUnaffiliatedDoctors(clinicId, specialization);
};

export const updateDoctorStatus = async (doctorId, status, clinicId) => {
    // Primary: Update Affiliation
    const affiliation = await Affiliation.findOneAndUpdate(
        { providerId: doctorId, clinicId },
        { status },
        { new: true }
    );

    // Sync: Update Doctor legacy fields
    await Doctor.findByIdAndUpdate(doctorId, {
        verificationStatus: status === "ACTIVE" ? "verified" : status.toLowerCase(),
        verifiedBy: status === "ACTIVE" ? clinicId : null
    });

    return affiliation;
};

export const removeDoctor = async (doctorId, clinicId) => {
    return await Doctor.findOneAndUpdate(
        { _id: doctorId, verifiedBy: clinicId },
        { verifiedBy: null, verificationStatus: "pending" },
        { new: true }
    );
};

export const inviteProvider = async (clinicId, providerId, providerType) => {
    return await affiliationService.inviteProvider(clinicId, providerId, providerType);
};

export const getPendingApplications = async (clinicId) => {
    return await Affiliation.find({ clinicId, status: "PENDING", requestedBy: "PROVIDER" })
        .populate("providerId"); // Dynamic population based on refPath
};

export const approveAffiliation = async (clinicId, affiliationId, status) => {
    const affiliation = await Affiliation.findOne({ _id: affiliationId, clinicId });
    if (!affiliation) throw new Error("Affiliation request not found or unauthorized.");

    affiliation.status = status;
    if (status === "ACTIVE") affiliation.affiliatedAt = new Date();
    await affiliation.save();

    // Sync to legacy fields in Doctor/Therapist for operationality
    const Model = affiliation.providerType === "Doctor" ? Doctor : Therapist;
    await Model.findByIdAndUpdate(affiliation.providerId, {
        verifiedBy: clinicId,
        verificationStatus: status === "ACTIVE" ? "verified" : "rejected",
        verifiedAt: status === "ACTIVE" ? new Date() : null
    });

    return affiliation;
};

export const getDoctorDetails = async (doctorId, clinicId) => {
    // Attempt to find in Doctor model first
    // Allow viewing if affiliated with THIS clinic OR if verified in general (facilitates discovery)
    let doctor = await Doctor.findOne({
        _id: doctorId,
        $or: [
            { verifiedBy: clinicId },
            { verificationStatus: "verified" }
        ]
    }).populate("userId", "-password");

    // If not found, try Therapist model
    if (!doctor) {
        doctor = await Therapist.findOne({
            _id: doctorId,
            $or: [
                { verifiedBy: clinicId },
                { verificationStatus: "verified" }
            ]
        }).populate("userId", "-password");
    }

    return doctor;
};
