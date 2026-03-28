import Clinic from "../../models/clinic.js";
import AuditLog from "../../models/auditLog.js";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import { sendEmail, getClinicApprovalTemplate } from "../common/emailService.js";

/**
 * Manage Clinic Approval Status
 */
export const updateClinicStatus = async (clinicId, status, adminId) => {
    const validStatuses = ["APPROVED_UNPAID", "REJECTED", "BLOCKED", "ACTIVE"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status type");
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) throw new Error("Clinic not found");

    const oldStatus = clinic.status;
    clinic.status = status;
    await clinic.save();

    await AuditLog.create({
        action: `CLINIC_${status}`,
        performedBy: adminId,
        targetId: clinicId,
        details: `Clinic status changed to ${status} from ${oldStatus}`
    });

    // When admin approves: send email with a secure set-password link
    if (status === "APPROVED_UNPAID") {
        try {
            const token = jwt.sign(
                { email: clinic.email, clinicId: clinic._id.toString() },
                config.jwtSecret,
                { expiresIn: "48h" }
            );

            const frontendUrl = config.appUrl || "http://localhost:3000";
            const setPasswordLink = `${frontendUrl}/set-password?token=${token}`;

            const html = getClinicApprovalTemplate({
                clinicName: clinic.clinicName,
                ownerName: clinic.ownerName,
                setPasswordLink,
            });

            await sendEmail({
                to: clinic.email,
                subject: "🎉 Your HealHub Clinic Has Been Approved!",
                html,
            });
        } catch (emailError) {
            console.error("Failed to send clinic approval email:", emailError);
            // Don't throw — the approval still succeeded; just log the email failure
        }
    }

    return clinic;
};

export const fetchClinics = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        status,
        search,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = options;

    const query = {};
    if (status) query.status = status;
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const clinics = await Clinic.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Clinic.countDocuments(query);

    return {
        clinics,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };
};

export const getClinicDetails = async (clinicId) => {
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) throw new Error("Clinic not found");
    return clinic;
};
