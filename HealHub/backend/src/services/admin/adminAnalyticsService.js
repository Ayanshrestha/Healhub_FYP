import User from "../../models/user.js";
import Clinic from "../../models/clinic.js";
import Doctor from "../../models/doctor.js";

/**
 * Platform Growth Analytics
 * Returns monthly registration counts for the last 6 months
 */
export const getPlatformGrowth = async () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const aggregateGrowth = async (Model) => {
        const data = await Model.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map to 6-month array
        return Array.from({ length: 6 }, (_, i) => {
            const targetMonth = (sixMonthsAgo.getMonth() + i) % 12 + 1;
            const found = data.find(d => d._id === targetMonth);
            return {
                month: months[targetMonth - 1],
                count: found ? found.count : 0
            };
        });
    };

    const [patients, clinics, doctors] = await Promise.all([
        aggregateGrowth(User), // Using User for general growth, can filter by role: 'patient'
        aggregateGrowth(Clinic),
        aggregateGrowth(Doctor)
    ]);

    return {
        series: [
            { name: "Patients", data: patients.map(p => p.count) },
            { name: "Clinics", data: clinics.map(c => c.count) },
            { name: "Doctors", data: doctors.map(d => d.count) }
        ],
        categories: patients.map(p => p.month)
    };
};
