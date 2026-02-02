import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema(
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

    licenseNumber: {
      type: String,
      required: true,
    },

    experienceYears: {
      type: Number,
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

    workAddress: {
      type: String,
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
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Therapist", therapistSchema);
