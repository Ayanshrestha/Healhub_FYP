import Appointment from "../../models/appointment.js";
import * as providerService from "../../services/provider/providerService.js";
import { logAction } from "../../utils/auditLogger.js";
import { createNotification } from "../../services/notificationService.js";

export const getAppointments = async (req, res) => {
    try {
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);
        const { status, clinicId, page = 1, limit = 10, search } = req.query;

        const query = { providerId: provider._id };
        if (status && status !== 'all') query.status = status;
        if (clinicId) query.clinicId = clinicId;

        if (search) {
            const Patient = (await import("../../models/patient.js")).default;
            const patients = await Patient.find({
                fullName: { $regex: search, $options: 'i' }
            }).select('_id');
            const patientIds = patients.map(p => p._id);
            query.patientId = { $in: patientIds };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const totalResults = await Appointment.countDocuments(query);
        const appointments = await Appointment.find(query)
            .populate("patientId", "fullName email phone gender age")
            .populate("clinicId", "clinicName address")
            .sort({ appointmentDate: 1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            appointments,
            pagination: {
                totalPages: Math.ceil(totalResults / limit),
                currentPage: parseInt(page),
                totalResults,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, notes } = req.body;

        // 1. Get Provider Profile
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);

        // 2. Find Appointment with Ownership Check
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            providerId: provider._id
        }).populate("providerId", "fullName");

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found or unauthorized" });
        }

        // 3. Define Valid Transitions (Hospital State Machine)
        const validTransitions = {
            "Pending": ["Approved", "Rejected", "Cancelled"],
            "Approved": ["Completed", "Cancelled", "No-Show"],
            "Rescheduled": ["Approved", "Rejected", "Cancelled"], // Same as pending
            "Completed": [], // Final state
            "Rejected": [],  // Final state
            "Cancelled": [], // Final state
            "No-Show": []    // Final state
        };

        if (!validTransitions[appointment.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid transition: Cannot move from ${appointment.status} to ${status}`
            });
        }

        // 4. Update Status
        appointment.status = status;
        if (notes) appointment.notes = notes;
        await appointment.save();

        await logAction(req, "APPOINTMENT_STATUS_UPDATE", `Appointment ${appointmentId} set to ${status}`);

        // Notify Patient
        await createNotification({
            recipientId: appointment.patientId,
            recipientModel: "User",
            title: `Appointment ${status}`,
            message: `Your appointment with ${appointment.providerId.fullName} has been ${status}.`,
            type: "APPOINTMENT",
            priority: ["Cancelled", "Rejected", "No-Show"].includes(status) ? "ERROR" : "SUCCESS"
        });

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { appointmentDate, timeSlot } = req.body;

        // 1. Get Provider Profile
        const provider = await providerService.getProviderProfile(req.user._id, req.user.role);

        // 2. Find Appointment with Ownership Check
        const appointment = await Appointment.findOne({
            _id: appointmentId,
            providerId: provider._id
        }).populate("providerId", "fullName");

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found or unauthorized" });
        }

        // 3. Prevent rescheduling completed/cancelled appointments
        if (["Completed", "Cancelled", "Rejected"].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot reschedule an appointment that is already ${appointment.status}`
            });
        }

        appointment.appointmentDate = appointmentDate;
        appointment.timeSlot = timeSlot;
        appointment.status = "Rescheduled";
        await appointment.save();

        await logAction(req, "APPOINTMENT_RESCHEDULE", `Appointment ${appointmentId} rescheduled to ${appointmentDate}`);

        // Notify Patient
        await createNotification({
            recipientId: appointment.patientId,
            recipientModel: "User",
            title: "Appointment Rescheduled",
            message: `Your appointment with ${appointment.providerId.fullName} has been rescheduled to ${new Date(appointmentDate).toLocaleDateString()} at ${timeSlot}.`,
            type: "APPOINTMENT",
            priority: "WARNING"
        });

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAppointmentDetails = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId)
            .populate("patientId", "fullName email phone gender age bloodGroup address")
            .populate("clinicId", "clinicName address phone")
            .lean();

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Add calculated age if DOB exists but age doesn't (optional robustness)
        if (appointment.patientId && appointment.patientId.dob && !appointment.patientId.age) {
            const dob = new Date(appointment.patientId.dob);
            const ageDiffMs = Date.now() - dob.getTime();
            const ageDate = new Date(ageDiffMs);
            appointment.patientId.age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        res.status(200).json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadClinicalAttachments = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { fileType } = req.body; // PRESCRIPTION or REPORT

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        const newAttachments = req.files.map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`,
            fileType: fileType || "OTHER",
            uploadedAt: new Date()
        }));

        appointment.attachments.push(...newAttachments);
        await appointment.save();

        await logAction(req, "CLINICAL_ATTACHMENT_UPLOAD", `Uploaded ${newAttachments.length} files to appointment ${appointmentId}`);

        res.status(200).json({
            success: true,
            message: "Clinical attachments uploaded successfully",
            attachments: newAttachments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
