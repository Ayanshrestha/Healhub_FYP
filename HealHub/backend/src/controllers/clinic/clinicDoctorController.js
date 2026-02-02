import * as clinicDoctorService from "../../services/clinic/clinicDoctorService.js";

export const getDoctors = async (req, res) => {
    try {
        const doctors = await clinicDoctorService.getAffiliatedDoctors(req.clinic._id);
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAvailableDoctors = async (req, res) => {
    try {
        const { specialization } = req.query;
        const doctors = await clinicDoctorService.getAvailableDoctors(req.clinic._id, specialization);
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyDoctor = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await clinicDoctorService.updateDoctorStatus(doctorId, status, req.clinic._id);
        res.json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        await clinicDoctorService.removeDoctor(doctorId, req.clinic._id);
        res.json({ success: true, message: "Doctor removed from clinic" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const inviteDoctor = async (req, res) => {
    try {
        const { providerId, providerType } = req.body; // providerType: 'Doctor' or 'Therapist'
        const clinicId = req.clinic._id;

        const affiliation = await clinicDoctorService.inviteProvider(clinicId, providerId, providerType);
        res.status(201).json({ success: true, affiliation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getApplications = async (req, res) => {
    try {
        const applications = await clinicDoctorService.getPendingApplications(req.clinic._id);
        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const handleAffiliation = async (req, res) => {
    try {
        const { affiliationId, status } = req.body; // status: 'ACTIVE' or 'REJECTED'
        const clinicId = req.clinic._id;

        const affiliation = await clinicDoctorService.approveAffiliation(clinicId, affiliationId, status);
        res.json({ success: true, affiliation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDoctorDetails = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const clinicId = req.clinic._id;
        const doctor = await clinicDoctorService.getDoctorDetails(doctorId, clinicId);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found or not affiliated with your clinic." });
        }

        res.json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
