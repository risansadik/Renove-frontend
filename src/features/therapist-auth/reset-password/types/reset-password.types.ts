import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { ResetPasswordForm } from "../../../../core/utils/form-schemas";

export interface StepVerifyOtpProps {
  control: Control<ResetPasswordForm>;
  errors: FieldErrors<ResetPasswordForm>;
  loading: boolean;
  resending: boolean;
  countdown: number;
  canResend: boolean;
  onVerify: () => void;
  onResend: () => void;
}

export interface StepNewPasswordProps {
  register: UseFormRegister<ResetPasswordForm>;
  errors: FieldErrors<ResetPasswordForm>;
  loading: boolean;
}