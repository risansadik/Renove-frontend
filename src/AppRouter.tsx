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
import { ForgotPasswordPage } from "./features/user-auth/Forgot-password-page.js";
import { ResetPasswordPage } from "./features/user-auth/Reset-password-page.js";
import { UserLoginPage } from "./features/user-auth/User-login-page.js";
import { UserRegisterPage } from "./features/user-auth/User-register-page.js";
import { VerifyOtpPage } from "./features/user-auth/Verify-otp-page.js";

const UserDashboard = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <p className="text-brand-400 text-sm font-mono mb-2">reNove</p>
      <h1 className="font-display text-3xl font-bold text-white">User Dashboard</h1>
      <p className="text-white/40 mt-2">Coming soon - your recovery journey awaits.</p>
    </div>
  </div>
);

const TherapistDashboard = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <p className="text-brand-400 text-sm font-mono mb-2">reNove</p>
      <h1 className="font-display text-3xl font-bold text-white">Therapist Dashboard</h1>
      <p className="text-white/40 mt-2">Coming soon - your session management area.</p>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <p className="font-mono text-brand-400 text-6xl font-bold mb-4">404</p>
      <p className="text-white/40">This page does not exist.</p>
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
            background: "#1a1927",
            color: "#e8e6f0",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#6c47ff", secondary: "#fff" } },
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/user/login" replace />} />

        <Route
          path="/user/register"
          element={
            <GuestRoute role="user">
              <UserRegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/user/login"
          element={
            <GuestRoute role="user">
              <UserLoginPage />
            </GuestRoute>
          }
        />
        <Route path="/user/verify-otp" element={<VerifyOtpPage role="user" />} />
        <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/user/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/therapist/register"
          element={
            <GuestRoute role="therapist">
              <TherapistRegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/therapist/login"
          element={
            <GuestRoute role="therapist">
              <TherapistLoginPage />
            </GuestRoute>
          }
        />
        <Route path="/therapist/verify-otp" element={<VerifyOtpPage role="therapist" />} />
        <Route
          path="/therapist/dashboard"
          element={
            <ProtectedRoute role="therapist">
              <TherapistDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/login"
          element={
            <GuestRoute role="admin">
              <AdminLoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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
