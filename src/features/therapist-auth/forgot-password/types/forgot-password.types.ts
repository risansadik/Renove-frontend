import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ForgotPasswordForm } from "../../../../core/utils/form-schemas.ts";

export interface ForgotPasswordFormSectionProps {
  register: UseFormRegister<ForgotPasswordForm>;
  errors: FieldErrors<ForgotPasswordForm>;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface VerificationSentSectionProps {
  email: string;
  onContinue: () => void;
}