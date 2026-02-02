import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    specialization: {
      type: String,
      required: true,
    },

    nmcLicense: {
      type: String,
      required: true,
    },

    experienceYears: {
      type: Number,
      required: true,
    },

    qualification: {
      type: String,
      default: "",
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    homeVisitEnabled: {
      type: Boolean,
      default: false,
    },

    availability: {
      type: Map,
      of: {
        slots: [String],
        isClosed: Boolean,
      },
      default: {},
    },

    affiliation: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "blocked"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
