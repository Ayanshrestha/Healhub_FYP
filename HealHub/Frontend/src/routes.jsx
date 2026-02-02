import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import PatientSignup from "./features/auth/PatientSignup";
import DoctorSignup from "./features/auth/DoctorSignup";
import TherapistSignup from "./features/auth/TherapistSignup";
import ClinicSignup from "./features/auth/ClinicSignup";
import VerifyOtp from "./features/auth/VerifyOtp";
import SetPassword from "./features/auth/SetPassword";

import AdminLogin from "./features/admin/pages/AdminLogin";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import UserManagement from "./features/admin/pages/UserManagement";
import ClinicManagement from "./features/admin/pages/ClinicManagement";
import AdminClinicDetails from "./features/admin/pages/AdminClinicDetails";
import AdminUserDetails from "./features/admin/pages/AdminUserDetails";
import PlatformAnalytics from "./features/admin/pages/PlatformAnalytics";
import SystemSettings from "./features/admin/pages/SystemSettings";
import PaymentVerification from "./features/clinic/pages/PaymentVerification";
import ClinicSubscription from "./features/clinic/pages/ClinicSubscription";
import AdminProtectedRoute from "./features/admin/components/AdminProtectedRoute";
import ClinicDashboard from "./features/clinic/pages/ClinicDashboard";
import DoctorManagementPage from "./features/clinic/pages/DoctorManagementPage";
import DoctorPublicProfile from "./features/clinic/pages/DoctorPublicProfile";
import AppointmentManagementPage from "./features/clinic/pages/AppointmentManagementPage";
import PatientManagementPage from "./features/clinic/pages/PatientManagementPage";
import ClinicAnalyticsPage from "./features/clinic/pages/ClinicAnalyticsPage";
import SubscriptionBillingPage from "./features/clinic/pages/SubscriptionBillingPage";
import ClinicProfilePage from "./features/clinic/pages/ClinicProfilePage";
import SettingsPage from "./features/clinic/pages/SettingsPage";
import ClinicProtectedRoute from "./features/clinic/components/ClinicProtectedRoute";
import ProviderLayout from "./layouts/ProviderLayout";
import ProviderDashboard from "./features/provider/pages/ProviderDashboard";
import ProviderAppointments from "./features/provider/pages/ProviderAppointments";
import ProviderAffiliations from "./features/provider/pages/ProviderAffiliations";
import ProviderMessages from "./features/provider/pages/ProviderMessages";
import ProviderEarnings from "./features/provider/pages/ProviderEarnings";
import ProviderProfile from "./features/provider/pages/ProviderProfile";
import ProviderSettings from "./features/provider/pages/ProviderSettings";
import ProviderProtectedRoute from "./features/provider/components/ProviderProtectedRoute";
import PatientLayout from "./layouts/PatientLayout";
import PatientDashboard from "./features/patient/pages/PatientDashboard";
import ClinicDiscovery from "./features/patient/pages/ClinicDiscovery";
import ClinicProfile from "./features/patient/pages/ClinicProfile";
import BookingFlow from "./features/patient/pages/BookingFlow";
import MyAppointments from "./features/patient/pages/MyAppointments";
import MedicineReminders from "./features/patient/pages/MedicineReminders";
import PatientMessages from "./features/patient/pages/PatientMessages";
import PatientReports from "./features/patient/pages/PatientReports";
import PatientProfile from "./features/patient/pages/PatientProfile";
import PatientPaymentVerification from "./features/patient/pages/PatientPaymentVerification";
import PatientProtectedRoute from "./features/patient/components/PatientProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Role-based signup */}
      <Route path="/signup/patient" element={<PatientSignup />} />
      <Route path="/signup/doctor" element={<DoctorSignup />} />
      <Route path="/signup/therapist" element={<TherapistSignup />} />
      <Route path="/signup/clinic" element={<ClinicSignup />} />

      {/* OTP flow */}
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/set-password" element={<SetPassword />} />
      <Route path="/payment-verification" element={<PaymentVerification />} />

      {/* Clinic Admin Routes */}
      <Route path="/clinic/dashboard" element={<ClinicProtectedRoute><ClinicDashboard /></ClinicProtectedRoute>} />
      <Route path="/clinic/doctors" element={<ClinicProtectedRoute><DoctorManagementPage /></ClinicProtectedRoute>} />
      <Route path="/clinic/doctors/:doctorId" element={<ClinicProtectedRoute><DoctorPublicProfile /></ClinicProtectedRoute>} />
      <Route path="/clinic/appointments" element={<ClinicProtectedRoute><AppointmentManagementPage /></ClinicProtectedRoute>} />
      <Route path="/clinic/patients" element={<ClinicProtectedRoute><PatientManagementPage /></ClinicProtectedRoute>} />
      <Route path="/clinic/analytics" element={<ClinicProtectedRoute><ClinicAnalyticsPage /></ClinicProtectedRoute>} />
      <Route path="/clinic/billing" element={<SubscriptionBillingPage />} />
      <Route path="/clinic/profile" element={<ClinicProtectedRoute><ClinicProfilePage /></ClinicProtectedRoute>} />
      <Route path="/clinic/settings" element={<ClinicProtectedRoute><SettingsPage /></ClinicProtectedRoute>} />

      {/* Patient Routes */}
      <Route path="/patient" element={<PatientProtectedRoute><PatientLayout /></PatientProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="clinics" element={<ClinicDiscovery />} />
        <Route path="clinics/:id" element={<ClinicProfile />} />
        <Route path="book/:clinicId" element={<BookingFlow />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="medicines" element={<MedicineReminders />} />
        <Route path="messages/:appointmentId" element={<PatientMessages />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="payment-verification" element={<PatientPaymentVerification />} />
        {/* Fallback */}
        <Route path="*" element={<PatientDashboard />} />
      </Route>

      {/* Provider Routes (unified for Doctors and Therapists) */}
      <Route path="/provider" element={<ProviderProtectedRoute><ProviderLayout /></ProviderProtectedRoute>}>
        <Route index element={<ProviderDashboard />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="appointments" element={<ProviderAppointments />} />
        <Route path="affiliations" element={<ProviderAffiliations />} />
        <Route path="messages" element={<ProviderMessages />} />
        <Route path="earnings" element={<ProviderEarnings />} />
        <Route path="profile" element={<ProviderProfile />} />
        <Route path="settings" element={<ProviderSettings />} />
        <Route path="*" element={<ProviderDashboard />} />
      </Route>

      {/* Legacy Aliases to prevent white screens */}
      <Route path="/doctor" element={<ProviderProtectedRoute><ProviderLayout /></ProviderProtectedRoute>}><Route path="*" element={<ProviderDashboard />} /></Route>
      <Route path="/therapist" element={<ProviderProtectedRoute><ProviderLayout /></ProviderProtectedRoute>}><Route path="*" element={<ProviderDashboard />} /></Route>

      {/* System Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/:userId" element={<AdminUserDetails />} />
              <Route path="clinics" element={<ClinicManagement />} />
              <Route path="clinics/:clinicId" element={<AdminClinicDetails />} />
              <Route path="analytics" element={<PlatformAnalytics />} />
              <Route path="settings" element={<SystemSettings />} />
              {/* Fallback to dashboard */}
              <Route path="*" element={<AdminDashboard />} />
            </Routes>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}
