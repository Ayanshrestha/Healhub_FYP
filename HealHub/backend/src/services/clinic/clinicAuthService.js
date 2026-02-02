import Clinic from "../../models/clinic.js";
import User from "../../models/user.js";
import { createNotification } from "../common/notificationService.js";

/**
 * Clinic Auth Business Logic
 */
export const registerClinicInitial = async (data) => {
    // Logic for initial clinic signup
    const clinic = await Clinic.create(data);

    // Notify Admin
    try {
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
            await createNotification({
                recipientId: admin._id,
                recipientModel: "User",
                type: "SYSTEM",
                title: "New Clinic Registration 🏥",
                message: `${clinic.name} has registered and is awaiting approval.`,
                priority: "high",
                link: `/admin/clinics/${clinic._id}`,
                data: { clinicId: clinic._id }
            });
        }
    } catch (error) {
        console.error("Failed to notifiy admin of new clinic:", error);
    }

    return clinic;
};
