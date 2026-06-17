import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useTherapistResetPassword } from "../hooks/use-reset-password";
import { AuthLayout } from "../../../../components/layout/Auth-layout";
import { TherapistResetPanel } from "../components/Therapist-reset-panel";
import { StepVerifyOtp } from "../components/Step-verify-otp";
import { StepNewPassword } from "../components/Step-new-password";

export const TherapistResetPasswordPage = () => {
  const {
    email,
    step,
    loading,
    resending,
    countdown,
    canResend,
    control,
    register,
    errors,
    handleResendOtp,
    handleVerifyOtp,
    handleSubmit,
  } = useTherapistResetPassword();

  return (
    <AuthLayout panel={<TherapistResetPanel />}>
      <div className="auth-card p-8 stagger-2">
        <Link
          to="/therapist/forgot-password"
          className="inline-flex items-center gap-2 text-brand-900/60 hover:text-brand-900/80 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-6">
          <ShieldCheck size={24} className="text-brand-600" />
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">
            {step === "otp" ? "Verify Code" : "New Password"}
          </h1>
          <p className="text-brand-900/60 text-sm">
            {step === "otp" ? (
              <>Enter the 6-digit code sent to <span className="text-brand-600 font-mono text-xs">{email}</span></>
            ) : (
              "Create a strong new password for your professional account."
            )}
          </p>
        </div>

        {step === "otp" ? (
          <StepVerifyOtp
            control={control}
            errors={errors}
            loading={loading}
            resending={resending}
            countdown={countdown}
            canResend={canResend}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
          />
        ) : (
          <form onSubmit={handleSubmit}>
            <StepNewPassword
              register={register} 
              errors={errors} 
              loading={loading} 
            />
          </form>
        )}
      </div>
    </AuthLayout>
  );
};