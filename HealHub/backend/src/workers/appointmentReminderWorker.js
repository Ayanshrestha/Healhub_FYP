import cron from "node-cron";
import Appointment from "../models/appointment.js";
import Patient from "../models/patient.js";
import Clinic from "../models/clinic.js";
import Doctor from "../models/doctor.js";
import { sendEmail, getAppointmentReminderTemplate } from "../services/common/emailService.js";

/**
 * Appointment Reminder Background Worker
 * Runs every day at 8:00 AM to check for appointments tomorrow
 */
/**
 * Appointment Reminder Background Worker
 * Runs every 15 minutes to check for upcoming appointments (24h and 1h reminders)
 */
export const initAppointmentReminderWorker = () => {
    console.log("🚀 Appointment Reminder Worker Initialized (15m intervals)");

    cron.schedule("*/15 * * * *", async () => {
        try {
            // Get current time in Nepal Standard Time (UTC+5:45)
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const nstOffset = 5.75 * 60 * 60 * 1000;
            const nstNow = new Date(utc + nstOffset);

            console.log(`⏰ [AppointmentWorker] Tick: ${nstNow.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}`);

            // Find upcoming appointments that are confirmed/approved and need ANY reminder
            const appointments = await Appointment.find({
                status: { $in: ["Approved", "Confirmed"] },
                $or: [
                    { reminder24hSent: false },
                    { reminder1hSent: false }
                ]
            }).populate("patientId").populate("providerId").populate("clinicId");

            for (const appt of appointments) {
                try {
                    // 1. Calculate the exact appointment start time in NST
                    // appt.appointmentDate is likely 00:00:00 of that day
                    // timeSlot is "HH:MM AM - HH:MM PM"
                    const startTimeStr = appt.timeSlot.split(" - ")[0]; // "10:00 AM"

                    const [time, modifier] = startTimeStr.split(" ");
                    let [hours, minutes] = time.split(":").map(Number);
                    if (modifier === "PM" && hours < 12) hours += 12;
                    if (modifier === "AM" && hours === 12) hours = 0;

                    const apptStartTime = new Date(appt.appointmentDate);
                    apptStartTime.setHours(hours, minutes, 0, 0);

                    // Time difference in hours
                    const diffMs = apptStartTime - nstNow;
                    const diffHours = diffMs / (1000 * 60 * 60);

                    const patient = appt.patientId;
                    if (!patient || !patient.email) continue;

                    const dateStr = appt.appointmentDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    // 2. CHECK 24-HOUR REMINDER (Window: 23 to 24.5 hours before)
                    if (diffHours > 23 && diffHours <= 24.5 && !appt.reminder24hSent) {
                        console.log(`📩 [AppointmentWorker] Sending 24h reminder to ${patient.email}`);
                        const emailHtml = getAppointmentReminderTemplate({
                            patientName: patient.fullName,
                            doctorName: appt.providerId?.fullName || "Specialist",
                            clinicName: appt.clinicId?.clinicName || "HealHub Clinic",
                            date: dateStr,
                            timeSlot: appt.timeSlot,
                            type: '24h'
                        });

                        await sendEmail({
                            to: patient.email,
                            subject: `Reminder: Appointment Tomorrow at ${appt.timeSlot} 🏥`,
                            html: emailHtml
                        });

                        appt.reminder24hSent = true;
                        appt.reminderSent = true; // Legacy support
                        await appt.save();
                    }

                    // 3. CHECK 1-HOUR REMINDER (Window: 0.5 to 1.5 hours before)
                    if (diffHours > 0.5 && diffHours <= 1.5 && !appt.reminder1hSent) {
                        console.log(`📩 [AppointmentWorker] Sending 1h reminder to ${patient.email}`);
                        const emailHtml = getAppointmentReminderTemplate({
                            patientName: patient.fullName,
                            doctorName: appt.providerId?.fullName || "Specialist",
                            clinicName: appt.clinicId?.clinicName || "HealHub Clinic",
                            date: dateStr,
                            timeSlot: appt.timeSlot,
                            type: '1h'
                        });

                        await sendEmail({
                            to: patient.email,
                            subject: `Urgent: Appointment in 1 Hour 🏥`,
                            html: emailHtml
                        });

                        appt.reminder1hSent = true;
                        appt.reminderSent = true; // Legacy support
                        await appt.save();
                    }

                } catch (innerError) {
                    console.error(`❌ [AppointmentWorker] Error processing appt ${appt._id}:`, innerError);
                }
            }
        } catch (error) {
            console.error("❌ Error in Appointment Reminder Worker:", error);
        }
    });
};
