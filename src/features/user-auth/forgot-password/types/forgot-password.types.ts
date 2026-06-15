import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { type ForgotPasswordForm } from "../../../../core/utils/form-schemas.ts";

export interface RequestResetFormProps {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<ForgotPasswordForm>;
    errors: FieldErrors<ForgotPasswordForm>;
    loading: boolean;
}

export interface ResetSuccessViewProps {
    emailValue: string;
    handleContinue: () => void;
}