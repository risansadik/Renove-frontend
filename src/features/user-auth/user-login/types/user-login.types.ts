import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { type LoginForm } from "../../../../core/utils/form-schemas.ts";

export interface CredentialsFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<LoginForm>;
  errors: FieldErrors<LoginForm>;
  loading: boolean;
}

export interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled: boolean;
  googleLoading: boolean;
}

