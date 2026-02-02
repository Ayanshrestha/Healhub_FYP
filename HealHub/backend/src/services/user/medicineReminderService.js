import MedicineReminder from "../../models/medicineReminder.js";
import Patient from "../../models/patient.js";

/**
 * Add a new medicine reminder
 */
export const addReminder = async (userId, reminderData) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const reminder = await MedicineReminder.create({
        ...reminderData,
        patientId: patient._id
    });

    return reminder;
};

/**
 * Get all active reminders for a patient for TODAY
 * This ensures logs exist for today's intake tracking
 */
export const getMyReminders = async (userId) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const today = new Date().toISOString().split("T")[0];
    const reminders = await MedicineReminder.find({
        patientId: patient._id,
        status: "Active"
    }).sort({ createdAt: -1 });

    // Ensure logs exist for today's time slots
    for (const reminder of reminders) {
        let updated = false;
        for (const time of reminder.times) {
            const hasLog = reminder.logs.find(l => l.date === today && l.time === time);
            if (!hasLog) {
                reminder.logs.push({ date: today, time: time, status: "Pending" });
                updated = true;
            }
        }
        if (updated) await reminder.save();
    }

    return reminders;
};

/**
 * Mark a specific dose as Taken or Missed
 */
export const markDoseStatus = async (userId, reminderId, logData) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const { date, time, status } = logData; // status: Taken, Missed, Pending

    const reminder = await MedicineReminder.findOne({
        _id: reminderId,
        patientId: patient._id
    });

    if (!reminder) throw new Error("Reminder not found");

    const logIndex = reminder.logs.findIndex(l => l.date === date && l.time === time);

    if (logIndex > -1) {
        reminder.logs[logIndex].status = status;
        reminder.logs[logIndex].updatedAt = new Date();
    } else {
        reminder.logs.push({ date, time, status, updatedAt: new Date() });
    }

    await reminder.save();
    return reminder;
};

/**
 * Update a reminder
 */
export const updateReminder = async (userId, reminderId, updateData) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    // Clear logs if times change? Or keep history? Usually keep history but add new pending logs
    const reminder = await MedicineReminder.findOneAndUpdate(
        { _id: reminderId, patientId: patient._id },
        updateData,
        { new: true }
    );

    if (!reminder) throw new Error("Reminder not found or unauthorized");
    return reminder;
};

/**
 * Delete a reminder
 */
export const deleteReminder = async (userId, reminderId) => {
    const patient = await Patient.findOne({ userId });
    if (!patient) throw new Error("Patient profile not found");

    const reminder = await MedicineReminder.findOneAndDelete({
        _id: reminderId,
        patientId: patient._id
    });

    if (!reminder) throw new Error("Reminder not found or unauthorized");
    return { success: true };
};
