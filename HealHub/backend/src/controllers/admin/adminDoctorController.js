import Doctor from "../../models/doctor.js";
import AuditLog from "../../models/auditLog.js";

/**
 * Verify a doctor account manually
 */
export const verifyDoctor = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.id; // From auth middleware

        const doctor = await Doctor.findOne({ userId });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor profile not found for this user"
            });
        }

        if (doctor.verificationStatus === "verified") {
            return res.status(400).json({
                success: false,
                message: "Doctor is already verified"
            });
        }

        doctor.verificationStatus = "verified";
        doctor.verifiedAt = new Date();
        // Since admin is verifying, we can either set verifiedBy to adminId (if the schema supports User ID there) 
        // or leave it / store it differently. The schema has 'verifiedBy' ref 'Clinic', might be legacy or multi-purpose.
        // For now, let's just update the status and log it.

        await doctor.save();

        await AuditLog.create({
            action: "DOCTOR_VERIFIED",
            performedBy: adminId,
            targetId: userId,
            details: `Doctor ${doctor.fullName} verified by admin`
        });

        res.status(200).json({
            success: true,
            message: "Doctor verified successfully",
            data: doctor
        });
    } catch (error) {
        console.error("Error verifying doctor:", error);
        res.status(500).json({
            success: false,
            message: "Failed to verify doctor"
        });
    }
};
