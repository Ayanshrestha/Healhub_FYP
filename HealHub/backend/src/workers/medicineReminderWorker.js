import cron from "node-cron";
import MedicineReminder from "../models/medicineReminder.js";
import Patient from "../models/patient.js";
import { createNotification } from "../services/common/notificationService.js";
import { sendEmail, getMedicineReminderTemplate } from "../services/common/emailService.js";

/**
 * Medicine Reminder Background Worker
 * Runs every minute to check for scheduled doses
 */
export const initMedicineReminderWorker = () => {
    console.log("🚀 Medicine Reminder Worker Initialized");

    // Run every minute: * * * * *
    cron.schedule("* * * * *", async () => {
        try {
            // 1. Get current time in Nepal Standard Time (UTC+5:45)
            // This ensures the worker matches the user's local time regardless of server location
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const nstOffset = 5.75 * 60 * 60 * 1000; // 5 hours 45 minutes
            const localNow = new Date(utc + nstOffset);

            const hours = localNow.getHours();
            const minutes = localNow.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const h = (hours % 12 || 12).toString().padStart(2, '0');
            const cleanTime = `${h}:${minutes} ${ampm}`;

            // Manual YYYY-MM-DD for local date
            const today = `${localNow.getFullYear()}-${(localNow.getMonth() + 1).toString().padStart(2, '0')}-${localNow.getDate().toString().padStart(2, '0')}`;

            console.log(`⏰ [MedicineWorker] Tick: ${cleanTime} | Local Date: ${today}`);

            // 2. Find active reminders that match THIS time
            const reminders = await MedicineReminder.find({
                status: "Active",
                times: cleanTime
            });

            if (reminders.length > 0) {
                console.log(`🎯 [MedicineWorker] Found ${reminders.length} matching reminders for ${cleanTime}`);
            }

            // 3. Process each reminder
            for (const reminder of reminders) {
                // Check if this specific dose is already taken/missed for today
                const doseLog = reminder.logs.find(l => l.date === today && l.time === cleanTime);

                // Only notify if status is explicitly Pending (or log doesn't exist yet)
                if (doseLog && doseLog.status !== "Pending") {
                    console.log(`⏩ Skipping ${reminder.medicineName} for ${cleanTime} - status: ${doseLog.status}`);
                    continue;
                }

                const patient = await Patient.findById(reminder.patientId);
                if (!patient) {
                    console.log(`❌ [MedicineWorker] Patient not found for reminder: ${reminder._id}`);
                    continue;
                }

                console.log(`📡 [MedicineWorker] Sending notification to Patient: ${patient.userId} for ${reminder.medicineName}`);
                await createNotification({
                    recipientId: patient.userId,
                    type: "MEDICINE",
                    title: "Medication Reminder 💊",
                    message: `It's time for your ${reminder.medicineName} (${reminder.dosage}).`,
                    data: {
                        reminderId: reminder._id,
                        medicineName: reminder.medicineName
                    }
                });

                // --- NEW: Email Reminder ---
                if (patient.email) {
                    try {
                        const emailHtml = getMedicineReminderTemplate({
                            patientName: patient.fullName,
                            medicineName: reminder.medicineName,
                            dosage: reminder.dosage,
                            cleanTime
                        });

                        await sendEmail({
                            to: patient.email,
                            subject: `Medicine Reminder: ${reminder.medicineName} 💊`,
                            html: emailHtml
                        });
                        console.log(`📧 [MedicineWorker] Email sent to: ${patient.email}`);
                    } catch (emailErr) {
                        console.error(`❌ [MedicineWorker] Email failed for ${patient.email}:`, emailErr);
                    }
                }

                console.log(`✅ [MedicineWorker] Success: ${reminder.medicineName} notification sent.`);
            }
        } catch (error) {
            console.error("❌ Error in Medicine Reminder Worker:", error);
        }
    });
};
