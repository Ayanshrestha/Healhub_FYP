import Patient from "../../models/patient.js";
import Appointment from "../../models/appointment.js";

/**
 * Get patient profile data
 */
export const getPatientData = async (userId) => {
    return await Patient.findOne({ userId });
};

/**
 * Update patient profile
 * Rule: Patients cannot edit email or fullName
 */
export const updatePatientProfile = async (userId, updateData) => {
    const { email, fullName, ...allowedUpdates } = updateData;

    const patient = await Patient.findOneAndUpdate(
        { userId },
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );

    if (!patient) {
        const error = new Error("Patient profile not found");
        error.statusCode = 404;
        throw error;
    }

    return patient;
};

/**
 * Get limited patient profile for providers (Doctors/Clinics)
 * Rule: Visible only if an appointment exists
 */
export const getLimitedPatientProfile = async (patientId, requesterId, requesterRole) => {
    // Check if appointment exists
    const query = { patientId };

    if (requesterRole === "doctor" || requesterRole === "therapist") {
        query.providerId = requesterId;
    } else if (requesterRole === "clinic") {
        query.clinicId = requesterId;
    } else {
        const error = new Error("Unauthorized access to patient profile");
        error.statusCode = 403;
        throw error;
    }

    const appointment = await Appointment.findOne(query);

    if (!appointment) {
        const error = new Error("Access denied. No appointment found with this patient.");
        error.statusCode = 403;
        throw error;
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
        const error = new Error("Patient not found");
        error.statusCode = 404;
        throw error;
    }

    // Return limited fields
    return {
        _id: patient._id,
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        profilePhoto: patient.profilePhoto,
        dob: patient.dob
    };
};
