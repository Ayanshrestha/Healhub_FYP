import * as appointmentService from "../../services/user/appointmentService.js";

export const getAvailability = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query; // Expecting YYYY-MM-DD
        if (!date) throw new Error("Date is required");

        const slots = await appointmentService.getDoctorAvailability(doctorId, date);
        res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const requestOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) throw new Error("Phone number is required");

        const result = await appointmentService.sendBookingOtp(phone);
        res.status(200).json({
            success: true,
            message: "OTP sent to your phone",
            data: result
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const bookAppointment = async (req, res) => {
    try {
        // req.user._id comes from the authMiddleware (JWT)
        // Delegates the complex creation logic to the service layer
        const result = await appointmentService.createAppointment(req.user._id, req.body);
        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: result
        });
    } catch (error) {
        // Handles errors like "Slot already taken" or "OTP Invalid"
        res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
};

export const listUpcoming = async (req, res) => {
    try {
        const appointments = await appointmentService.getPatientAppointments(req.user._id, "upcoming");
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const listPast = async (req, res) => {
    try {
        const appointments = await appointmentService.getPatientAppointments(req.user._id, "past");
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.getAppointmentDetails(req.user._id, id);
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
};

export const cancel = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.cancelAppointment(req.user._id, id);
        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data: appointment
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const reinitiatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentData = await appointmentService.reinitiateAppointmentPayment(req.user._id, id);
        res.status(200).json({
            success: true,
            data: paymentData
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const switchToClinic = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.switchToClinicPayment(req.user._id, id);
        res.status(200).json({
            success: true,
            message: "Switched to clinic payment successfully",
            data: appointment
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
