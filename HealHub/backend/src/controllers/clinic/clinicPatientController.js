import * as clinicPatientService from "../../services/clinic/clinicPatientService.js";

export const getPatients = async (req, res) => {
    try {
        const patients = await clinicPatientService.getClinicPatients(req.clinic._id);
        res.json({ success: true, patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const history = await clinicPatientService.getPatientHistory(patientId, req.clinic._id);
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
