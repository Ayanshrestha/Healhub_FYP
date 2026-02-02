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
        bio, profilePhoto, availability, homeVisitEnabled, address
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
        totalEarnings: appointments
            .filter(a => a.status === "Completed")
            .reduce((sum, a) => sum + (a.consultationFee || 0), 0) // We'll need to store fee in Appointment for history
    };

    return stats;
};

export const getEarningsReport = async (providerId) => {
    const completed = await Appointment.find({
        providerId,
        status: "Completed"
    }).populate("clinicId", "clinicName");

    // Group by month
    const monthly = completed.reduce((acc, app) => {
        const month = new Date(app.appointmentDate).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) acc[month] = { amount: 0, count: 0 };
        acc[month].amount += (app.consultationFee || 0);
        acc[month].count += 1;
        return acc;
    }, {});

    // Group by clinic (as requested)
    const clinicBreakdown = completed.reduce((acc, app) => {
        const clinicName = app.clinicId?.clinicName || "Unknown Clinic";
        if (!acc[clinicName]) acc[clinicName] = 0;
        acc[clinicName] += (app.consultationFee || 0);
        return acc;
    }, {});

    return {
        totalEarnings: completed.reduce((sum, a) => sum + (a.consultationFee || 0), 0),
        monthlyBreakdown: monthly,
        clinicBreakdown: clinicBreakdown, // Added clinic breakdown
        detailedHistory: completed
    };
};
