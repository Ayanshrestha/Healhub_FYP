import mongoose from "mongoose";

const affiliationSchema = new mongoose.Schema(
    {
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true,
        },
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "providerType",
        },
        providerType: {
            type: String,
            required: true,
            enum: ["Doctor", "Therapist"],
        },
        status: {
            type: String,
            enum: ["PENDING", "ACTIVE", "REJECTED", "BLOCKED"],
            default: "PENDING",
        },
        requestedBy: {
            type: String,
            enum: ["CLINIC", "PROVIDER"],
            required: true,
        },
        affiliatedAt: {
            type: Date,
        }
    },
    { timestamps: true }
);

// Ensure a provider can't have duplicate pending/active affiliations with the same clinic
affiliationSchema.index({ clinicId: 1, providerId: 1 }, { unique: true });

export default mongoose.model("Affiliation", affiliationSchema);
