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

    return {
        totalDoctors,
        totalPatients,
        todayAppointments,
        monthlyAppointments,
        subscriptionStatus: clinic.status,
    };
};

export const getAnalyticsData = async (clinicId) => {
    // Aggregating appointments per month for the current year
    const year = new Date().getFullYear();
    const data = await Appointment.aggregate([
        {
            $match: {
                clinicId: clinicId,
                appointmentDate: {
                    $gte: new Date(year, 0, 1),
                    $lte: new Date(year, 11, 31)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$appointmentDate" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Format for frontend (index 0-11)
    const monthlyStats = Array(12).fill(0);
    data.forEach(item => {
        monthlyStats[item._id - 1] = item.count;
    });

    return monthlyStats;
};
