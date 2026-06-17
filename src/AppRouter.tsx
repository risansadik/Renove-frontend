import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute, GuestRoute } from "./components/common/Protected-route.tsx";
import { AdminLoginPage } from "./features/admin/admin-auth/pages/Admin-login-page.tsx";
import { AdminLayout } from "./features/admin/admin-layout/layouts/Admin-layout.tsx";
import { AdminOverviewPage } from "./features/admin//admin-overview/pages/Admin-overview-page.tsx";
import { AdminTherapistsPage } from "./features/admin/admin-therapist/pages/Admin-therapists-page.tsx";
import { AdminUsersPage } from "./features/admin/admin-user/pages/Admin-users-page.tsx";
import { AdminFinancePage } from "./features/admin/admin-finance/pages/Admin-finance-page.tsx";
import { AdminProfilePage } from "./features/admin/admin-profile/pages/AdminProfilePage.tsx";
import { AdminProfileReviewPage } from "./features/admin/admin-profile-review/pages/AdminProfileReviewPage.tsx";
import { TherapistLoginPage } from "./features/therapist-auth/Therapist-login-page.tsx";
import { TherapistRegisterPage } from "./features/therapist-auth/Therapist-register-page.tsx";
import { TherapistForgotPasswordPage } from "./features/therapist-auth/Therapist-forgot-password-page.tsx";
import { TherapistResetPasswordPage } from "./features/therapist-auth/Therapist-reset-password-page.tsx";
import { TherapistLayout } from "./features/therapist/Therapist-layout.tsx";
import { TherapistDashboardPage } from "./features/therapist/Therapist-dashboard-page.tsx";
import { ForgotPasswordPage } from "./features/user-auth/forgot-password/pages/Forgot-password-page.tsx";
import { ResetPasswordPage } from "./features/user-auth/reset-password/pages/Reset-password-page.tsx";
import { UserLoginPage } from "./features/user-auth/user-login/pages/User-login-page.tsx";
import { UserRegisterPage } from "./features/user-auth/user-register/pages/User-register-page.tsx";
import { VerifyOtpPage } from "./features/user-auth/verify-otp/pages/Verify-otp-page.tsx";
import { UserLayout } from "./features/user/User-layout.tsx";
import { UserDashboardPage } from "./features/user/user-dashboard/pages/User-dashboard-page.tsx";
import { UserProgressPage } from "./features/user/user-progress/pages/UserProgressPage.tsx";
import { UserWalletPage } from "./features/user/UserWalletPage.tsx";
import { UserProfilePage } from "./features/user/UserProfilePage.tsx";
import { TherapistWalletPage } from "./features/therapist/TherapistWalletPage.tsx";
import { useThemeStore } from "./store/use-theme-store.ts";
import { TherapistProfilePage } from "./features/therapist/TherapistProfilePage.tsx";
import { LevelJourneyPage } from "./features/level/LevelJourneyPage.tsx";
import { AiCompanionPage } from "./features/user/AI-companion/pages/AiCompanionPage.tsx";
import { VideoCallPage } from "./features/call/video-call/pages/VideoCallPage.tsx";
import { ReportIssuePage } from "./features/report/ReportIssuePage.tsx";
import { MyReportsPage } from "./features/report/MyReportsPage.tsx";
import { ReportDetailsPage } from "./features/report/ReportDetailsPage.tsx";
import { AdminReportsPage } from "./features/report/AdminReportsPage.tsx";

const NotFoundPage = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="text-center">
      <p className="font-mono text-brand-400 text-6xl font-bold mb-4">404</p>
      <p className="text-brand-900/60">This page does not exist.</p>
    </div>
  </div>
);

export const AppRouter = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: isDark ? "rgba(26, 17, 30, 0.95)" : "rgba(253, 250, 246, 0.95)",
              color: isDark ? "#ece3f0" : "#26182c",
              border: isDark
                ? "1px solid rgba(184,155,190,0.2)"
                : "1px solid rgba(196,168,208,0.3)",
              borderRadius: "16px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.5)"
                : "0 8px 32px rgba(107,76,122,0.12)",
              backdropFilter: "blur(12px)",
            },
            success: {
              iconTheme: { primary: "#4a6b52", secondary: "#fff" },
              style: {
                borderLeft: "4px solid #4a6b52",
              }
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
              style: {
                borderLeft: "4px solid #ef4444",
              }
            }
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
            <Route path="progress" element={<UserProgressPage />} />
            <Route path="ai-companion" element={<AiCompanionPage />} />
            <Route path="therapists" element={<UserDashboardPage />} />
            <Route path="sessions" element={<UserDashboardPage />} />
            <Route path="wallet" element={<UserWalletPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="journey" element={<LevelJourneyPage />} />
            <Route path="session/:bookingId" element={<VideoCallPage />} />
            <Route path="report" element={<ReportIssuePage reporterContext="user" />} />
            <Route path="reports" element={<MyReportsPage reportPath="/dashboard/report" detailBasePath="/dashboard/reports" />} />
            <Route path="reports/:id" element={<ReportDetailsPage backPath="/dashboard/reports" />} />
          </Route>

          {/* ── Therapist auth ───────────────────────── */}
          <Route path="/therapist/register" element={<GuestRoute role="therapist"><TherapistRegisterPage /></GuestRoute>} />
          <Route path="/therapist/login" element={<GuestRoute role="therapist"><TherapistLoginPage /></GuestRoute>} />
          <Route path="/therapist/verify-otp" element={<VerifyOtpPage role="therapist" />} />
          <Route path="/therapist/forgot-password" element={<TherapistForgotPasswordPage />} />
          <Route path="/therapist/reset-password" element={<TherapistResetPasswordPage />} />

          {/* ── Therapist dashboard (layout with sidebar + logout) ─ */}
          <Route path="/therapist" element={<ProtectedRoute role="therapist"><TherapistLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/therapist/dashboard" replace />} />
            <Route path="dashboard" element={<TherapistDashboardPage />} />
            <Route path="sessions" element={<TherapistDashboardPage />} />
            <Route path="availability" element={<TherapistDashboardPage />} />
            <Route path="clients" element={<TherapistDashboardPage />} />
            <Route path="messages" element={<TherapistDashboardPage />} />
            <Route path="wallet" element={<TherapistWalletPage />} />
            <Route path="profile" element={<TherapistProfilePage />} />
            <Route path="settings" element={<TherapistDashboardPage />} />
            <Route path="session/:bookingId" element={<VideoCallPage />} />
            <Route path="report" element={<ReportIssuePage reporterContext="therapist" />} />
            <Route path="reports" element={<MyReportsPage reportPath="/therapist/report" detailBasePath="/therapist/reports" />} />
            <Route path="reports/:id" element={<ReportDetailsPage backPath="/therapist/reports" />} />
          </Route>

          {/* ── Admin ────────────────────────────────── */}
          <Route path="/admin/login" element={<GuestRoute role="admin"><AdminLoginPage /></GuestRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="therapists" element={<AdminTherapistsPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="reviews" element={<AdminProfileReviewPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="reports/:id" element={<ReportDetailsPage backPath="/admin/reports" />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};
