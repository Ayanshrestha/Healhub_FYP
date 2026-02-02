import Clinic from "../../models/clinic.js";
import Affiliation from "../../models/affiliation.js";
import Doctor from "../../models/doctor.js";

/**
 * List all verified (ACTIVE) clinics with summarized data
 */
export const listVerifiedClinics = async () => {
    // Show ACTIVE clinics, but also include PENDING ones for development visibility if needed
    // or just all verified ones. Switching to a broader set for "Registered" clinics.
    const clinics = await Clinic.find({
        status: { $in: ["ACTIVE", "APPROVED_UNPAID", "PENDING_APPROVAL"] }
    })
        .select("clinicName address status specializations description")
        .lean();

    const clinicsWithStats = await Promise.all(clinics.map(async (clinic) => {
        // Count active doctors for this clinic
        const activeAffiliations = await Affiliation.find({
            clinicId: clinic._id,
            status: "ACTIVE",
            providerType: "Doctor"
        });

        const providerIds = activeAffiliations.map(a => a.providerId);
        const activeDoctors = await Doctor.find({
            _id: { $in: providerIds },
            status: "active"
        }).select("specialization").lean();

        const doctorSpecs = activeDoctors.map(d => d.specialization).filter(Boolean);
        const mergedSpecs = Array.from(new Set([
            ...(clinic.specializations || []),
            ...doctorSpecs
        ]));

        return {
            ...clinic,
            totalDoctors: activeDoctors.length,
            specializationsSummary: mergedSpecs
        };
    }));

    return clinicsWithStats;
};

/**
 * Get detailed clinic profile with doctor counts per department
 */
export const getClinicProfileDetails = async (clinicId) => {
    const clinic = await Clinic.findById(clinicId).lean();
    if (!clinic) {
        const error = new Error("Clinic not found");
        error.statusCode = 404;
        throw error;
    }

    // Get all active doctor affiliations for this clinic
    const activeAffiliations = await Affiliation.find({
        clinicId: clinic._id,
        status: "ACTIVE",
        providerType: "Doctor"
    }).populate("providerId");

    // Filter by active doctors and group by specialization
    const activeDoctors = activeAffiliations
        .map(a => a.providerId)
        .filter(doc => doc && doc.status === "active");

    const doctorCountPerDept = {};
    activeDoctors.forEach(doc => {
        const spec = doc.specialization || "General";
        doctorCountPerDept[spec] = (doctorCountPerDept[spec] || 0) + 1;
    });

    // Combine clinic-defined specializations with actual doctor specializations
    const allDeptNames = new Set([
        ...(clinic.specializations || []),
        ...Object.keys(doctorCountPerDept)
    ]);

    const departments = Array.from(allDeptNames).map(spec => ({
        name: spec,
        doctorCount: doctorCountPerDept[spec] || 0
    }));

    return {
        ...clinic,
        departments,
        totalDoctors: activeDoctors.length
    };
};

/**
 * Get only departments for a specific clinic
 */
export const getClinicDepartments = async (clinicId) => {
    const clinic = await Clinic.findById(clinicId).select("specializations").lean();
    if (!clinic) {
        const error = new Error("Clinic not found");
        error.statusCode = 404;
        throw error;
    }
    return clinic.specializations || [];
};

/**
 * Get doctors for a specific clinic and department
 * Rules:
 * - Affiliated with clinic (ACTIVE)
 * - Doctor status is active
 * - Matching department (specialization)
 */
export const getClinicDoctorsByDepartment = async (clinicId, department) => {
    // 1. Find active affiliations for this clinic
    const activeAffiliations = await Affiliation.find({
        clinicId,
        status: "ACTIVE",
        providerType: "Doctor"
    }).select("providerId").lean();

    const providerIds = activeAffiliations.map(a => a.providerId);

    // 2. Filter doctors by ID, status, and specialization
    const doctors = await Doctor.find({
        _id: { $in: providerIds },
        status: "active",
        specialization: department
    }).select("fullName specialization profilePhoto qualification experienceYears consultationFee homeVisitEnabled bio")
        .lean();

    return doctors;
};
