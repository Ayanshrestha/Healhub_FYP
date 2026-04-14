import * as clinicDiscoveryService from "../../services/user/clinicDiscoveryService.js";

export const getClinics = async (req, res) => {
    try {
        const { location } = req.query;
        const clinics = await clinicDiscoveryService.listVerifiedClinics({ location });
        res.status(200).json({
            success: true,
            data: clinics
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const getClinicDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const clinic = await clinicDiscoveryService.getClinicProfileDetails(id);
        res.status(200).json({
            success: true,
            data: clinic
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const listDepartments = async (req, res) => {
    try {
        const { id } = req.params;
        const departments = await clinicDiscoveryService.getClinicDepartments(id);
        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export const listDoctors = async (req, res) => {
    try {
        const { id: clinicId, department } = req.params;
        const doctors = await clinicDiscoveryService.getClinicDoctorsByDepartment(clinicId, department);
        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
