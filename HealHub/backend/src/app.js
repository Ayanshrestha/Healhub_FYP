import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// --- Route Imports ---

// Admin Domain
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.js";
import adminDashboardRoutes from "./routes/admin/adminDashboardRoutes.js";
import adminClinicApprovalRoutes from "./routes/admin/adminClinicApprovalRoutes.js";
import adminUserManagementRoutes from "./routes/admin/adminUserManagementRoutes.js";
import adminAnalyticsRoutes from "./routes/admin/adminAnalyticsRoutes.js";
import adminSecurityLogRoutes from "./routes/admin/adminSecurityLogRoutes.js";

// Auth & OTP Domain
import userAuthRoutes from "./routes/auth/userAuthRoutes.js";
import otpRoutes from "./routes/auth/otpRoutes.js";

// Clinic Domain
import clinicAuthRoutes from "./routes/clinic/clinicAuthRoutes.js";
import clinicRoutes from "./routes/clinic/clinicRoutes.js";

// User Domain (Patient & Therapist)
import patientRoutes from "./routes/user/patientRoutes.js";
import patientClinicRoutes from "./routes/user/patientClinicRoutes.js";
import appointmentRoutes from "./routes/user/appointmentRoutes.js";
import messagingRoutes from "./routes/user/messagingRoutes.js";
import medicineReminderRoutes from "./routes/user/medicineReminderRoutes.js";
import notificationRoutes from "./routes/common/notificationRoutes.js";
import reportRoutes from "./routes/user/reportRoutes.js";

// Provider Domain (Doctor & Therapist Dashboard)
import providerRoutes from "./routes/provider/providerRoutes.js";

// Payment Domain
import paymentRoutes from "./routes/payment/paymentRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.APP_URL, "http://localhost:3000", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// Serve static uploads
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --- API Route Mounting ---

// Base Auth & OTP
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/auth", userAuthRoutes);
app.use("/api/otp", otpRoutes);

// Admin Domain
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/clinics", adminClinicApprovalRoutes);
app.use("/api/admin/users", adminUserManagementRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/logs", adminSecurityLogRoutes);

// Clinic Domain
app.use("/api/clinic/auth", clinicAuthRoutes);
app.use("/api/clinic", clinicRoutes);

// User Domain
app.use("/api/user/patient", patientRoutes);
app.use("/api/user/patient/clinics", patientClinicRoutes);
app.use("/api/user/patient/appointments", appointmentRoutes);
app.use("/api/user/patient/messages", messagingRoutes);
app.use("/api/user/patient/reminders", medicineReminderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user/patient/reports", reportRoutes);

// Provider Domain
app.use("/api/provider", providerRoutes);

// Payment Domain
app.use("/api/payment", paymentRoutes);
app.use("/api/medicine", medicineRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("HealHub Backend API is Running");
});

export default app;
