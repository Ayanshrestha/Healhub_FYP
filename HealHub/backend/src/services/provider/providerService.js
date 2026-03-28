import Doctor from "../../models/doctor.js";
import Therapist from "../../models/therapist.js";
import Appointment from "../../models/appointment.js";
import Affiliation from "../../models/affiliation.js";
import Clinic from "../../models/clinic.js";

/**
 * Shared service for Doctor and Therapist roles
 */

export const searchClinics = async (query = "") => {
    const filter = { status: "ACTIVE" };

    if (query) {
        filter.$or = [
            { clinicName: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } }
        ];
    }

    return await Clinic.find(filter).select("clinicName address phone description email");
};

export const getProviderProfile = async (userId, role) => {
    if (role === "doctor") {
        return await Doctor.findOne({ userId }).populate("userId", "-password");
    } else if (role === "therapist") {
        return await Therapist.findOne({ userId }).populate("userId", "-password");
    }
    return null;
};

export const updateProviderProfile = async (userId, role, updateData) => {
    // Whitelist editable fields
    const {
        specialization, qualification, consultationFee,
        bio, profilePhoto, availability, homeVisitEnabled, address,
        blockedDates
    } = updateData;

    const cleanData = {};
    if (specialization) cleanData.specialization = specialization;
    if (qualification) cleanData.qualification = qualification;
    if (consultationFee !== undefined) cleanData.consultationFee = consultationFee;
    if (bio) cleanData.bio = bio;
    if (profilePhoto) cleanData.profilePhoto = profilePhoto;
    if (availability) cleanData.availability = availability;
    if (homeVisitEnabled !== undefined) cleanData.homeVisitEnabled = homeVisitEnabled;
    if (address) cleanData.address = address;
    if (blockedDates) cleanData.blockedDates = blockedDates;

    if (role === "doctor") {
        return await Doctor.findOneAndUpdate({ userId }, cleanData, { new: true });
    } else if (role === "therapist") {
        return await Therapist.findOneAndUpdate({ userId }, cleanData, { new: true });
    }
    return null;
};

export const getDashboardStats = async (providerId, role) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({ providerId });

    // Fetch provider to get current fee as fallback
    const provider = role === "doctor"
        ? await Doctor.findById(providerId)
        : await Therapist.findById(providerId);
    const fallbackFee = provider?.consultationFee || 500;

    const stats = {
        today: appointments.filter(a => {
            const d = new Date(a.appointmentDate);
            return d >= today && d < tomorrow;
        }).length,
        upcoming: appointments.filter(a => new Date(a.appointmentDate) >= tomorrow).length,
        completed: appointments.filter(a => a.status === "Completed").length,
        pending: appointments.filter(a => a.status === "Pending").length,
        homeVisits: appointments.filter(a => a.appointmentType === "HOME_VISIT").length, // Added home visits
        totalPatients: new Set(appointments.map(a => a.patientId.toString())).size,
        totalEarnings: Number(appointments
            .filter(a => a.status === "Completed")
            .reduce((sum, a) => {
                const fee = a.consultationFee || fallbackFee;
                return sum + (a.doctorEarning || (fee * 0.7));
            }, 0).toFixed(2))
    };

    return stats;
};

export const getEarningsReport = async (providerId) => {
    const completed = await Appointment.find({
        providerId,
        status: "Completed"
    }).populate("clinicId", "clinicName").populate("patientId", "fullName");

    // Fetch provider for fallback
    const doctor = await Doctor.findById(providerId);
    const therapist = !doctor ? await Therapist.findById(providerId) : null;
    const fallbackFee = (doctor || therapist)?.consultationFee || 500;

    // Group by month
    const monthly = completed.reduce((acc, app) => {
        const month = new Date(app.appointmentDate).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) acc[month] = { amount: 0, count: 0 };
        const fee = app.consultationFee || fallbackFee;
        acc[month].amount += (app.doctorEarning || (fee * 0.7));
        acc[month].count += 1;
        return acc;
    }, {});

    // Group by clinic
    const clinicBreakdown = completed.reduce((acc, app) => {
        const clinicName = app.clinicId?.clinicName || "Unknown Clinic";
        if (!acc[clinicName]) acc[clinicName] = 0;
        const fee = app.consultationFee || fallbackFee;
        acc[clinicName] += (app.doctorEarning || (fee * 0.7));
        return acc;
    }, {});

    // Ensure all amounts are rounded for the report
    Object.keys(monthly).forEach(m => monthly[m].amount = Number(monthly[m].amount.toFixed(2)));
    Object.keys(clinicBreakdown).forEach(c => clinicBreakdown[c] = Number(clinicBreakdown[c].toFixed(2)));

    const result = {
        totalEarnings: Number(completed.reduce((sum, a) => {
            const fee = a.consultationFee || fallbackFee;
            return sum + (a.doctorEarning || (fee * 0.7));
        }, 0).toFixed(2)),
        monthlyBreakdown: monthly,
        clinicBreakdown: clinicBreakdown,
        detailedHistory: completed.map(app => {
            const fee = app.consultationFee || fallbackFee;
            return {
                ...app.toObject(),
                doctorEarning: app.doctorEarning || Number((fee * 0.7).toFixed(2))
            };
        })
    };

    return result;
};
