import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    clinicName: {
      type: String,
      required: true,
    },

    ownerName: {
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

    licenseNumber: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING_APPROVAL",
        "APPROVED_UNPAID",
        "ACTIVE",
        "BLOCKED",
        "REJECTED",
      ],
      default: "PENDING_APPROVAL",
    },

    subscriptionPlan: {
      type: String,
      enum: ["BASIC", "STANDARD", "PREMIUM", null],
      default: null,
    },

    subscriptionStartDate: {
      type: Date,
    },

    subscriptionEndDate: {
      type: Date,
    },

    subscriptionStatus: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", null],
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    operatingHours: {
      type: Map,
      of: {
        open: String,
        close: String,
        isClosed: Boolean,
      },
      default: {},
    },

    facilities: [{
      type: String,
    }],

    specializations: [{
      type: String,
    }],

    documents: [{
      name: String,
      url: String,
      type: { type: String },
      uploadedAt: { type: Date, default: Date.now },
    }],

    notificationPreferences: {
      appointments: { type: Boolean, default: true },
      doctorRequests: { type: Boolean, default: true },
      subscriptionExpiry: { type: Boolean, default: true },
      adminMessages: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);
