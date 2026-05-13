import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute, GuestRoute } from "./components/common/Protected-route.js";
import { AdminLoginPage } from "./features/admin-auth/Admin-login-page.js";
import { AdminLayout } from "./features/admin/Admin-layout.js";
import { AdminOverviewPage } from "./features/admin/Admin-overview-page.js";
import { AdminTherapistsPage } from "./features/admin/Admin-therapists-page.js";
import { AdminUsersPage } from "./features/admin/Admin-users-page.js";
import { TherapistLoginPage } from "./features/therapist-auth/Therapist-login-page.js";
import { TherapistRegisterPage } from "./features/therapist-auth/Therapist-register-page.js";
import { TherapistLayout } from "./features/therapist/Therapist-layout.js";
import { TherapistDashboardPage } from "./features/therapist/Therapist-dashboard-page.js";
import { ForgotPasswordPage } from "./features/user-auth/Forgot-password-page.js";
import { ResetPasswordPage } from "./features/user-auth/Reset-password-page.js";
import { UserLoginPage } from "./features/user-auth/User-login-page.js";
import { UserRegisterPage } from "./features/user-auth/User-register-page.js";
import { VerifyOtpPage } from "./features/user-auth/Verify-otp-page.js";
import { UserLayout } from "./features/user/User-layout.js";
import { UserDashboardPage } from "./features/user/User-dashboard-page.js";

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <p className="font-mono text-brand-400 text-6xl font-bold mb-4">404</p>
      <p className="text-brand-900/60">This page does not exist.</p>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fdfaf6",
            color: "#26182c",
            border: "1px solid rgba(196,168,208,0.3)",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 20px rgba(107,76,122,0.1)",
          },
          success: { iconTheme: { primary: "#4a6b52", secondary: "#fff" } },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/user/login" replace />} />

        {/* ── User auth ────────────────────────────── */}
        <Route path="/user/register" element={<GuestRoute role="user"><UserRegisterPage /></GuestRoute>} />
        <Route path="/user/login" element={<GuestRoute role="user"><UserLoginPage /></GuestRoute>} />
        <Route path="/user/verify-otp" element={<VerifyOtpPage role="user" />} />
        <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/user/reset-password" element={<ResetPasswordPage />} />

        {/* ── User dashboard (layout with sidebar + logout) ─ */}
        <Route path="/dashboard" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route index element={<UserDashboardPage />} />
          <Route path="progress" element={<UserDashboardPage />} />
          <Route path="ai-companion" element={<UserDashboardPage />} />
          <Route path="therapists" element={<UserDashboardPage />} />
          <Route path="sessions" element={<UserDashboardPage />} />
        </Route>

        {/* ── Therapist auth ───────────────────────── */}
        <Route path="/therapist/register" element={<GuestRoute role="therapist"><TherapistRegisterPage /></GuestRoute>} />
        <Route path="/therapist/login" element={<GuestRoute role="therapist"><TherapistLoginPage /></GuestRoute>} />
        <Route path="/therapist/verify-otp" element={<VerifyOtpPage role="therapist" />} />

        {/* ── Therapist dashboard (layout with sidebar + logout) ─ */}
        <Route path="/therapist" element={<ProtectedRoute role="therapist"><TherapistLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/therapist/dashboard" replace />} />
          <Route path="dashboard" element={<TherapistDashboardPage />} />
          <Route path="sessions" element={<TherapistDashboardPage />} />
          <Route path="clients" element={<TherapistDashboardPage />} />
          <Route path="messages" element={<TherapistDashboardPage />} />
          <Route path="settings" element={<TherapistDashboardPage />} />
        </Route>

        {/* ── Admin ────────────────────────────────── */}
        <Route path="/admin/login" element={<GuestRoute role="admin"><AdminLoginPage /></GuestRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="therapists" element={<AdminTherapistsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
