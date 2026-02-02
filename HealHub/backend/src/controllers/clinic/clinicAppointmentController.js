import * as clinicAppointmentService from "../../services/clinic/clinicAppointmentService.js";

export const getAppointments = async (req, res) => {
    try {
        const appointments = await clinicAppointmentService.getClinicAppointments(req.clinic._id, req.query);
        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;
        const appointment = await clinicAppointmentService.updateAppointmentStatus(appointmentId, status, req.clinic._id);
        res.json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
