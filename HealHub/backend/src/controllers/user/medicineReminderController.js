import * as medicineReminderService from "../../services/user/medicineReminderService.js";

export const create = async (req, res) => {
    try {
        const reminder = await medicineReminderService.addReminder(req.user._id, req.body);
        res.status(201).json({ success: true, data: reminder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const list = async (req, res) => {
    try {
        const reminders = await medicineReminderService.getMyReminders(req.user._id);
        res.status(200).json({ success: true, data: reminders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await medicineReminderService.updateReminder(req.user._id, id, req.body);
        res.status(200).json({ success: true, data: reminder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await medicineReminderService.deleteReminder(req.user._id, id);
        res.status(200).json({ success: true, message: "Reminder deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const markStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await medicineReminderService.markDoseStatus(req.user._id, id, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
