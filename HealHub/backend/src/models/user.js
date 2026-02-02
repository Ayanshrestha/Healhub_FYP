import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          const regex =
            /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
          return regex.test(value);
        },
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: false, // added after OTP verification
    },

    role: {
      type: String,
      required: true,
      enum: ["patient", "doctor", "therapist", "clinic", "admin"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
