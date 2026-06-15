import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { type ResetPasswordForm } from "../../../../core/utils/form-schemas.ts";

export interface OtpVerificationStepProps {
    control: Control<ResetPasswordForm>;
    errors: FieldErrors<ResetPasswordForm>;
    loading: boolean;
    canResend: boolean;
    resending: boolean;
    countdown: number;
    handleVerifyOtp: () => Promise<void>;
    handleResendOtp: () => Promise<void>;
}

export interface PasswordSubmissionStepProps {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<ResetPasswordForm>;
    errors: FieldErrors<ResetPasswordForm>;
    loading: boolean;
}

