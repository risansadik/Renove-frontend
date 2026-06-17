import { Link } from "react-router-dom";
import { AuthLayout } from "../../../../components/layout/Auth-layout.tsx";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useTherapistForgotPassword } from "../hooks/use-forgot-password.ts";
import { TherapistPanel } from "../components/Therapist-panel.tsx";
import { ForgotPasswordFormSection } from "../components/Forgot-password-form-section.tsx";
import { VerificationSentSection } from "../components/Verification-sent-section.tsx";

export const TherapistForgotPasswordPage = () => {
  const {
    loading,
    sent,
    register,
    errors,
    getValues,
    handleSubmit,
    handleContinue,
  } = useTherapistForgotPassword();

  return (
    <AuthLayout panel={<TherapistPanel />}>
      <div className="auth-card p-8 stagger-2">
        <Link
          to="/therapist/login"
          className="inline-flex items-center gap-2 text-brand-900/60 hover:text-brand-900/80 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-6">
          <KeyRound size={24} className="text-brand-600" />
        </div>

        {!sent ? (
          <ForgotPasswordFormSection
            register={register}
            errors={errors}
            loading={loading}
            onSubmit={handleSubmit}
          />
        ) : (
          <VerificationSentSection
            email={getValues("email")}
            onContinue={handleContinue}
          />
        )}
      </div>
    </AuthLayout>
  );
};