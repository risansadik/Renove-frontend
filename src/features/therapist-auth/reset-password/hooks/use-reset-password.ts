import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordSchema, type ResetPasswordForm } from "../../../../core/utils/form-schemas.ts";
import { therapistAuthService } from "../../../../services/api/auth.service.ts";

export const useTherapistResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [countdown, setCountdown] = useState(60);

  const canResend = countdown <= 0;

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Redirect instantly if no valid session data context was received
  useEffect(() => {
    if (!email) {
      navigate("/therapist/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  // Handle countdown interval ticks safely
  useEffect(() => {
    if (canResend || step !== "otp") return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [canResend, step, countdown]);

  const handleResendOtp = async () => {
    try {
      setResending(true);
      await therapistAuthService.forgotPassword(email);
      toast.success("New code sent to your email");
      setCountdown(60);
    } catch {
      toast.error("Failed to resend authentication code");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const isValid = await trigger("otp");
    if (!isValid) return;

    try {
      setLoading(true);
      const otp = getValues("otp");
      await therapistAuthService.verifyResetOtp({ email, otp });
      setStep("password");
      toast.success("Code verified! Set your new password.");
    } catch {
      // API error fallback managed by interceptors or manual catch handles here
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = async (data: ResetPasswordForm) => {
    try {
      setLoading(true);
      await therapistAuthService.resetPassword(data);
      toast.success("Password reset successfully!");
      navigate("/therapist/login");
    } finally {
      setLoading(false);
    }
  };

  return {
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
    handleSubmit: handleSubmit(onFormSubmit),
  };
};