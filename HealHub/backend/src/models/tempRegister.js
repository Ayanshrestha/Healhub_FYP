import mongoose from "mongoose";

const tempRegisterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "therapist", "clinic"],
    },

    data: {
      type: Object,
      required: true, // stores full profile info temporarily
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TempRegister", tempRegisterSchema);
