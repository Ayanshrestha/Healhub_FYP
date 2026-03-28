import Appointment from "../../models/appointment.js";
import Doctor from "../../models/doctor.js";
import Patient from "../../models/patient.js";
import Clinic from "../../models/clinic.js";

export const getDashboardStats = async (clinicId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDoctors = await Doctor.countDocuments({ verifiedBy: clinicId });

    // Simplification: Count distinct patients who have appointments with this clinic
    const distinctPatients = await Appointment.distinct("patientId", { clinicId });
    const totalPatients = distinctPatients.length;

    const todayAppointments = await Appointment.countDocuments({
        clinicId,
        appointmentDate: { $gte: today }
    });

    const monthlyAppointments = await Appointment.countDocuments({
        clinicId,
        createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) }
    });

    const clinic = await Clinic.findById(clinicId);

    // Aggregating Clinic's 30% Share with robust fallbacks
    const completedApps = await Appointment.find({ clinicId, status: "Completed" });
    const totalEarnings = Number(completedApps.reduce((sum, app) => {
        const fee = app.consultationFee || 500;
        return sum + (app.clinicEarning || (fee * 0.30));
    }, 0).toFixed(2));

    return {
        totalDoctors,
        totalPatients,
        todayAppointments,
        monthlyAppointments,
        totalEarnings, // Added clinic earnings
        subscriptionStatus: clinic.status,
    };
};

export const getAnalyticsData = async (clinicId) => {
    const year = new Date().getFullYear();

    // 1. Monthly Trends (Appointments and Revenue)
    const monthlyData = await Appointment.aggregate([
        {
            $match: {
                clinicId: clinicId,
                status: "Completed",
                appointmentDate: {
                    $gte: new Date(year, 0, 1),
                    $lte: new Date(year, 11, 31)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$appointmentDate" },
                count: { $sum: 1 },
                revenue: { $sum: "$clinicEarning" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    const appointmentStats = Array(12).fill(0);
    const revenueStats = Array(12).fill(0);

    monthlyData.forEach(item => {
        appointmentStats[item._id - 1] = item.count;
        revenueStats[item._id - 1] = Number(item.revenue.toFixed(2));
    });

    // 2. Top Performing Doctors (by appointment count)
    const topDoctors = await Appointment.aggregate([
        { $match: { clinicId, status: "Completed" } },
        {
            $group: {
                _id: "$providerId",
                appointmentCount: { $sum: 1 },
                totalRevenue: { $sum: "$clinicEarning" }
            }
        },
        { $sort: { appointmentCount: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "doctors",
                localField: "_id",
                foreignField: "_id",
                as: "doctorInfo"
            }
        },
        { $unwind: "$doctorInfo" },
        {
            $project: {
                name: "$doctorInfo.fullName",
                specialization: "$doctorInfo.specialization",
                count: "$appointmentCount",
                revenue: { $round: ["$totalRevenue", 2] }
            }
        }
    ]);

    return {
        appointments: appointmentStats,
        revenue: revenueStats,
        topDoctors
    };
};
