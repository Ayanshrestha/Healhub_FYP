import mongoose from "mongoose";

const medicineReminderSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        medicineName: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            enum: ["once", "twice", "three times", "Daily", "Weekly"],
            default: "once",
        },
        times: [{
            type: String, // e.g., "08:00 AM"
        }],
        intakeInstructions: {
            type: String,
            enum: ["Before Food", "After Food", "With Food", "None"],
            default: "None",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Expired"],
            default: "Active",
        },
        logs: [{
            date: { type: String }, // "YYYY-MM-DD"
            time: { type: String }, // "08:00 AM"
            status: {
                type: String,
                enum: ["Taken", "Missed", "Pending"],
                default: "Pending"
            },
            updatedAt: { type: Date, default: Date.now }
        }],
        notes: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model("MedicineReminder", medicineReminderSchema);
